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
import { IGame, IProfile, Position } from "../../models";
import { updateProfile } from "../../store/profile";

interface Props {
  isCreating?: boolean;
  isJoining?: boolean;
  gameId?: string;
  profile: IProfile;
  updateProfile: (profile: IProfile) => void;
}
interface State {
  points: number;
  hasTurn: boolean;
  isPlayer1: boolean;
  playerTime: number;
  timeMode: number;
  opponent: {
    name: string;
    points: number;
    playerTime: number;
    isReady: boolean;
  };
  gameId: string;
  isReady: boolean;
  boardPositions: any[];
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
      points: props.profile.points,
      gameId: props.gameId || null,
      hasTurn: null,
      isPlayer1: false,
      playerTime: null,
      timeMode: null,
      opponent: null,
      isReady: false,
      boardPositions: Array(15)
        .fill(null)
        .map(() => Array(15).fill(null)),
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
      this.gameSocket.emit("createGame", { timeMode: 5 });
    }
    if (isJoining) {
      this.gameSocket.emit("joinGame", { gameId });
    }

    this.gameSocket.once("gameCreated", initialGame => {
      this.setState({
        isPlayer1: true,
        gameId: initialGame.gameId,
        playerTime: initialGame.player1Time,
        timeMode: initialGame.timeMode
      });
    });

    this.gameSocket.on("gameJoined", initialGame => {
      console.log(initialGame);
      this.setState({
        opponent: {
          name: this.state.isPlayer1
            ? initialGame.player2Name
            : initialGame.player1Name,
          points: this.state.isPlayer1
            ? initialGame.player2Points
            : initialGame.player1Points,
          playerTime: initialGame.player1Time,
          isReady: this.state.isPlayer1
            ? initialGame.player2Ready === "true"
            : initialGame.player1Ready === "true"
        },
        playerTime: initialGame.player1Time,
        timeMode: initialGame.timeMode
      });
    });

    this.gameSocket.on("playerReady", () => {
      this.setState({
        opponent: {
          ...this.state.opponent,
          isReady: true
        }
      });
    });

    this.gameSocket.on("gameStarted", () => {
      this.setState({
        hasTurn: this.state.isPlayer1,
        isReady: false,
        opponent: {
          ...this.state.opponent,
          isReady: false
        }
      });
    });

    this.gameSocket.on("playerLeft", () => {
      clearInterval(this.timerRef);
      this.setState({
        points:
          this.state.hasTurn !== null
            ? this.state.points + 50
            : this.state.points,
        opponent: null,
        isPlayer1: true,
        hasTurn: null,
        isReady: false,
        rejectedDraw: false,
        rejectedRedo: false,
        requestedDraw: false,
        requestedRedo: false,
        playerTime: this.state.timeMode * 60,
        gameEndType: this.state.hasTurn === null ? null : "win"
      });
    });

    this.gameSocket.on("updateBoard", boardPositions => {
      console.log(boardPositions);
      this.setState({
        boardPositions
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
          points: this.state.isPlayer1
            ? params.updatedGame.player1Points
            : params.updatedGame.player2Points,
          opponent: {
            ...this.state.opponent,
            points: this.state.isPlayer1
              ? params.updatedGame.player2Points
              : params.updatedGame.player1Points
          },
          hasTurn: null,
          rejectedDraw: false,
          rejectedRedo: false,
          requestedDraw: false,
          requestedRedo: false,
          gameEndType
        });
        this.props.updateProfile({
          username: this.props.profile.username,
          points: this.state.isPlayer1
            ? params.updatedGame.player1Points
            : params.updatedGame.player2Points
        });
      }
    );

    this.gameSocket.on("turn", () => {
      this.setState({
        hasTurn: true,
        rejectedDraw: false,
        rejectedRedo: false,
        requestedDraw: false,
        requestedRedo: false
      });
      this.timerRef = setInterval(() => {
        this.gameSocket.emit("tick", { gameId: this.state.gameId });
      }, 1000);
    });

    this.gameSocket.on(
      "timeUpdated",
      (params: { playerTime: number; isPlayer1: boolean }) => {
        if (params.isPlayer1 === this.state.isPlayer1) {
          this.setState({
            playerTime: params.playerTime
          });
        } else {
          this.setState({
            opponent: {
              ...this.state.opponent,
              playerTime: params.playerTime
            }
          });
        }
      }
    );

    this.gameSocket.on("offer", (type: "redo" | "draw") => {
      if (
        (this.state.rejectedDraw && type === "draw") ||
        (this.state.rejectedRedo && type === "redo")
      ) {
        return;
      }
      let alertTitle;
      let alertMessage;
      if (type === "redo") {
        alertTitle = "Redo Request";
        alertMessage = `${
          this.state.opponent.name
        } requests to redo the recent move.`;
      }
      if (type === "draw") {
        alertTitle = "Draw Offer";
        alertMessage = `${this.state.opponent.name} offers a draw.`;
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
              gameId: this.state.gameId,
              type
            });
            this.setState({ hasTurn: false });
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

  makeMove = (position: Position) => {
    console.log("move");
    this.setState({ hasTurn: false });
    this.gameSocket.emit("move", { gameId: this.state.gameId, position });
    clearInterval(this.timerRef);
  };

  playerReady() {
    // clear board and timers and set current player ready
    this.setState({
      isReady: true,
      playerTime: this.state.timeMode * 60,
      boardPositions: Array(15)
        .fill(null)
        .map(() => Array(15).fill(null)),
      opponent: this.state.opponent
        ? {
            ...this.state.opponent,
            playerTime: this.state.timeMode * 60
          }
        : null,
      gameEndType: null
    });
    const { gameId } = this.state;
    if (gameId) {
      this.gameSocket.emit("playerReady", { gameId });
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
    this.gameSocket.emit("offer", { gameId: this.state.gameId, type });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.players}>
          <PlayerStats
            name={this.props.profile.username}
            points={this.state.points}
            time={this.state.playerTime}
            hasTurn={this.state.hasTurn}
            isPlayer1={this.state.isPlayer1}
            isReady={this.state.isReady}
          />
          {this.state.opponent && (
            <PlayerStats
              name={this.state.opponent.name}
              points={this.state.opponent.points}
              time={this.state.opponent.playerTime}
              hasTurn={this.state.hasTurn === false}
              isPlayer1={!this.state.isPlayer1}
              isReady={this.state.opponent.isReady}
            />
          )}
          {!this.state.opponent && (
            <View style={styles.loadingIndicator}>
              <Text style={styles.loadingText}>Waiting for opponent...</Text>
              <ActivityIndicator size={"small"} color={"#8FB9A8"} />
            </View>
          )}
        </View>
        {this.state.hasTurn === null && (
          <TouchableOpacity
            style={[styles.ready, this.state.isReady && styles.readyDisabled]}
            onPress={() => this.playerReady()}
            disabled={this.state.isReady}
          >
            <Text style={styles.readyLabel}>READY TO PLAY</Text>
          </TouchableOpacity>
        )}
        {this.state.hasTurn !== null && (
          <View style={styles.actionButtons}>
            <ActionButton
              label={"redo"}
              onPress={() => {
                this.offer("redo");
              }}
              disabled={this.state.hasTurn || this.state.requestedRedo}
            />
            <ActionButton
              label={"draw"}
              onPress={() => {
                this.offer("draw");
              }}
              disabled={this.state.requestedDraw}
            />
          </View>
        )}
        <Board
          boardPositions={this.state.boardPositions}
          makeMove={(position: Position) => this.makeMove(position)}
          gameEndType={this.state.gameEndType}
          disabled={!this.state.hasTurn}
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
