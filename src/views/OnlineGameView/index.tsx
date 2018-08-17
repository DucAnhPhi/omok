import React from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import firebase from "react-native-firebase";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import SocketIOClient from "socket.io-client";
import { URI } from "../../../config";
import ActionButton from "../../components/ActionButton";
import Board from "../../components/Board";
import PlayerStats from "../../components/PlayerStats";
import GameLogic from "../../lib/gameLogic";
import {
  IGame,
  IGameOptional,
  IMove,
  InitialGame,
  IPosition,
  IProfile
} from "../../models";
import { updateProfile } from "../../store/profile";

interface Props {
  isCreating?: { timeMode: number };
  isJoining?: boolean;
  gameId?: string;
  profile: IProfile;
  updateProfile: (profile: IProfile) => void;
}
interface State {
  game: IGame;
  moves: IMove[];
  isPlayer1: boolean;
  rejectedDraw: boolean;
  rejectedRedo: boolean;
  requestedDraw: boolean;
  requestedRedo: boolean;
  gameEndType: "win" | "lose" | "draw" | null;
}

class OnlineGameView extends React.Component<Props, State> {
  static navigatorStyle = {
    navBarBackgroundColor: "#FEFAD4",
    topBarElevationShadowEnabled: false,
    navBarTitleTextCentered: true
  };

  gameSocket: SocketIOClient.Socket;
  timerRef: number;

  constructor(props) {
    super(undefined);
    this.state = {
      moves: [],
      game: { ...InitialGame },
      isPlayer1: false,
      rejectedDraw: false,
      rejectedRedo: false,
      requestedDraw: false,
      requestedRedo: false,
      gameEndType: null
    };
  }

  async componentDidMount() {
    const { isCreating, isJoining, gameId } = this.props;
    const firebaseToken = await firebase.auth().currentUser.getIdToken(true);
    this.gameSocket = SocketIOClient.connect(
      `${URI}/game`,
      {
        query: { token: firebaseToken }
      }
    );
    if (isCreating) {
      this.setState({ isPlayer1: true });
      this.gameSocket.emit("createGame", { timeMode: isCreating.timeMode });
    }
    if (isJoining) {
      this.gameSocket.emit("joinGame", { gameId });
    }

    this.gameSocket.on(
      "updateGame",
      (params: { gameProps?: IGameOptional; moves?: IMove[] }) => {
        const updatedGame: IGame = { ...this.state.game };
        if (params.gameProps) {
          Object.keys(params.gameProps).map(key => {
            updatedGame[key] = params.gameProps[key];
          });
        }
        console.log(params.moves);
        this.setState({
          game: updatedGame,
          moves: params.moves ? params.moves : this.state.moves
        });
      }
    );

    this.gameSocket.on("playerLeft", () => {
      clearInterval(this.timerRef);
      // set whoever is left as player1 and clear state
      // update points if necessary
      const { isPlayer1, game } = this.state;
      const currentKey = isPlayer1 ? "1" : "2";
      const updatedGame = {
        ...InitialGame,
        player1: game[`player${currentKey}`],
        player1Uid: game[`player${currentKey}Uid`],
        player1Name: game[`player${currentKey}Name`],
        player1Points: game.playing
          ? game[`player${currentKey}Points`] + 50
          : game[`player${currentKey}Points`],
        player1Time: game.timeMode * 60
      };
      this.setState({
        game: updatedGame,
        isPlayer1: true,
        rejectedDraw: false,
        rejectedRedo: false,
        requestedDraw: false,
        requestedRedo: false,
        gameEndType: game.playing ? "win" : null
      });
    });

    this.gameSocket.on(
      "gameEnded",
      (params: {
        victory?: { isPlayer1: boolean };
        draw?: boolean;
        updatedGame: IGame;
      }) => {
        clearInterval(this.timerRef);
        let gameEndType;
        if (params.draw) {
          gameEndType = "draw";
        }
        if (params.victory !== undefined) {
          gameEndType =
            params.victory.isPlayer1 === this.state.isPlayer1 ? "win" : "lose";
        }
        this.setState({
          game: params.updatedGame,
          rejectedDraw: false,
          rejectedRedo: false,
          requestedDraw: false,
          requestedRedo: false,
          gameEndType
        });
      }
    );

    this.gameSocket.on("turn", () => {
      this.setState({
        game: {
          ...this.state.game,
          player1HasTurn: this.state.isPlayer1
        },
        rejectedDraw: false,
        rejectedRedo: false,
        requestedDraw: false,
        requestedRedo: false
      });
      this.timerRef = setInterval(() => {
        this.gameSocket.emit("tick", { gameId: this.state.game.gameId });
      }, 1000);
    });

    this.gameSocket.on("offer", (type: "redo" | "draw") => {
      if (
        (this.state.rejectedDraw && type === "draw") ||
        (this.state.rejectedRedo && type === "redo")
      ) {
        return;
      }
      const opponentName = this.state.isPlayer1
        ? this.state.game.player2Name
        : this.state.game.player1Name;
      let alertTitle;
      let alertMessage;
      if (type === "redo") {
        alertTitle = "Redo Request";
        alertMessage = `${opponentName} requests to redo the recent move.`;
      }
      if (type === "draw") {
        alertTitle = "Draw Offer";
        alertMessage = `${opponentName} offers a draw.`;
      }
      Alert.alert(alertTitle, alertMessage, [
        {
          text: "reject",
          onPress: () => {
            if (type === "redo") {
              this.setState({ rejectedRedo: true });
            }
            if (type === "draw") {
              this.setState({ rejectedDraw: true });
            }
          },
          style: "cancel"
        },
        {
          text: "accept",
          onPress: () => {
            clearInterval(this.timerRef);
            this.gameSocket.emit("offerAccepted", {
              gameId: this.state.game.gameId,
              type
            });
            this.setState({
              game: {
                ...this.state.game,
                player1HasTurn: !this.state.isPlayer1
              }
            });
          }
        }
      ]);
    });
  }

  componentWillUnmount() {
    if (this.gameSocket) {
      this.gameSocket.close();
      clearInterval(this.timerRef);
    }
  }

  makeMove = (position: IPosition) => {
    this.setState({
      game: {
        ...this.state.game,
        player1HasTurn: !this.state.isPlayer1
      }
    });
    this.gameSocket.emit("move", { gameId: this.state.game.gameId, position });
    clearInterval(this.timerRef);
  };

  playerReady() {
    const { isPlayer1, game } = this.state;
    // clear board and timers and set current player ready
    this.setState({
      game: {
        ...game,
        player1Ready: isPlayer1 ? true : game.player1Ready,
        player2Ready: !isPlayer1 ? true : game.player2Ready,
        player1Time: game.timeMode * 60,
        player2Time: game.timeMode * 60
      },
      moves: [],
      gameEndType: null
    });
    if (game.gameId) {
      this.gameSocket.emit("playerReady", { gameId: game.gameId });
    }
  }

  offer(type: "draw" | "redo") {
    if (type === "draw") {
      this.setState({
        requestedDraw: true
      });
    }
    if (type === "redo") {
      this.setState({
        requestedRedo: true
      });
    }
    this.gameSocket.emit("offer", { gameId: this.state.game.gameId, type });
  }

  renderPlayers() {
    const { isPlayer1, game } = this.state;
    console.log(game);
    const currentKey = isPlayer1 ? "1" : "2";
    const opponentKey = isPlayer1 ? "2" : "1";
    return (
      <View style={styles.players}>
        <PlayerStats
          name={this.props.profile.username}
          points={game[`player${currentKey}Points`]}
          time={game[`player${currentKey}Time`]}
          hasTurn={game.player1HasTurn === isPlayer1 && game.playing}
          isPlayer1={isPlayer1}
          isReady={game[`player${currentKey}Ready`]}
        />
        {game[`player${opponentKey}`].length !== 0 && (
          <PlayerStats
            name={game[`player${opponentKey}Name`]}
            points={game[`player${opponentKey}Points`]}
            time={game[`player${opponentKey}Time`]}
            hasTurn={!(game.player1HasTurn === isPlayer1) && game.playing}
            isPlayer1={!isPlayer1}
            isReady={game[`player${opponentKey}Ready`]}
          />
        )}
        {game[`player${opponentKey}`].length === 0 && (
          <View style={styles.loadingIndicator}>
            <Text style={styles.loadingText}>Waiting for opponent...</Text>
            <ActivityIndicator size={"small"} color={"#8FB9A8"} />
          </View>
        )}
      </View>
    );
  }

  render() {
    const { isPlayer1, game, moves } = this.state;
    const currentKey = isPlayer1 ? "1" : "2";
    return (
      <View style={styles.container}>
        {this.renderPlayers()}
        {!game.playing && (
          <TouchableOpacity
            style={[
              styles.ready,
              game[`player${currentKey}Ready`] && styles.readyDisabled
            ]}
            onPress={() => this.playerReady()}
            disabled={game[`player${currentKey}Ready`]}
          >
            <Text style={styles.readyLabel}>READY TO PLAY</Text>
          </TouchableOpacity>
        )}
        {game.playing && (
          <View style={styles.actionButtons}>
            <ActionButton
              label={"redo"}
              onPress={() => {
                this.offer("redo");
              }}
              disabled={
                this.state.moves.length === 0 ||
                game.player1HasTurn === isPlayer1 ||
                this.state.requestedRedo
              }
            />
            <ActionButton
              label={"draw"}
              onPress={() => {
                this.offer("draw");
              }}
              disabled={
                this.state.requestedDraw || this.state.moves.length < 20
              }
            />
          </View>
        )}
        <Board
          boardPositions={GameLogic.convertMovesToPositions(moves)}
          makeMove={(position: IPosition) => this.makeMove(position)}
          gameEndType={this.state.gameEndType}
          disabled={!(game.player1HasTurn === isPlayer1) || !game.playing}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  players: {
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  container: {
    backgroundColor: "#FEFAD4",
    alignItems: "center",
    flex: 1
  },
  ready: {
    marginVertical: 5,
    height: 40,
    width: 130,
    borderRadius: 5,
    backgroundColor: "#8FB9A8",
    alignItems: "center",
    justifyContent: "center"
  },
  readyDisabled: {
    opacity: 0.2
  },
  readyLabel: {
    color: "black",
    fontWeight: "600"
  },
  actionButtons: {
    marginVertical: 5,
    flexDirection: "row"
  },
  loadingIndicator: {
    borderWidth: 5,
    borderRadius: 5,
    borderColor: "rgba(0,0,0,0.2)",
    width: 145,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  loadingText: {
    fontSize: 13,
    fontWeight: "600",
    width: 70,
    marginRight: 10
  }
});

const mapStateToProps = (state: any) => ({
  profile: state.profileReducer.profile
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators({ updateProfile }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OnlineGameView);
