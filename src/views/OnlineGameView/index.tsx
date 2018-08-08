import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { connect } from "react-redux";
import SocketIOClient from "socket.io-client";
import ActionButton from "../../components/ActionButton";
import Board from "../../components/Board";
import PlayerStats from "../../components/PlayerStats";
import { IProfile } from "../../models";

interface Props {
  isCreating?: boolean;
  isJoining?: boolean;
  gameId?: string;
  profile: IProfile;
}
interface State {
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
}

const convertToPositions = (moves: { [key: string]: boolean }) => {
  const boardPositions = [...Array(15)].map(() => [...Array(15)]);
  Object.keys(moves).map(move => {
    const position = JSON.parse(move); // { x: number, y: number}
    boardPositions[position.y][position.x] = moves[move];
  });
  return boardPositions;
};

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
      gameId: props.gameId || null,
      hasTurn: null,
      isPlayer1: false,
      playerTime: null,
      timeMode: null,
      opponent: null,
      isReady: false,
      boardPositions: Array(15)
        .fill(null)
        .map(() => Array(15).fill(null))
    };
  }

  componentDidMount() {
    const { isCreating, isJoining, profile, gameId } = this.props;
    this.gameSocket = SocketIOClient.connect("http://192.168.178.51:3000/game");
    if (isCreating) {
      this.gameSocket.emit("createGame", { user: profile, timeMode: 5 });
    }
    if (isJoining) {
      this.gameSocket.emit("joinGame", { gameId, user: profile });
    }

    this.gameSocket.on("gameCreated", initialGame => {
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
      if (!this.state.isPlayer1) {
        this.setState({
          hasTurn: false
        });
      }
    });

    this.gameSocket.on("playerLeft", () => {
      clearInterval(this.timerRef);
      this.setState({
        opponent: null,
        isPlayer1: true,
        hasTurn: null,
        isReady: false,
        playerTime: this.state.timeMode * 60
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
      (params: { victory?: boolean; draw?: boolean }) => {
        this.setState({
          isReady: false,
          hasTurn: null,
          opponent: { ...this.state.opponent, isReady: false }
        });
        if (params.victory) {
          alert(`player ${params.victory} won`);
        }
      }
    );

    this.gameSocket.on("turn", () => {
      this.setState({ hasTurn: true });
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
  }

  componentWillUnmount() {
    if (this.gameSocket) {
      this.gameSocket.close();
      clearInterval(this.timerRef);
    }
  }

  makeMove = (position: { x: number; y: number }) => {
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
      opponent: {
        ...this.state.opponent,
        playerTime: this.state.timeMode * 60
      }
    });
    const { gameId } = this.state;
    if (gameId) {
      this.gameSocket.emit("playerReady", { gameId });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.players}>
          <PlayerStats
            name={this.props.profile.username}
            points={this.props.profile.points}
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
        <TouchableOpacity onPress={() => this.playerReady()}>
          <Text>READY</Text>
        </TouchableOpacity>
        <View style={styles.actionButtons}>
          <ActionButton label={"redo"} />
          <ActionButton label={"draw"} />
          <ActionButton label={"give up"} isRed={true} />
        </View>
        <Board
          boardPositions={this.state.boardPositions}
          makeMove={(position: { x: number; y: number }) =>
            this.makeMove(position)
          }
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
  actionButtons: {
    marginTop: 15,
    flexDirection: "row",
    width: 270,
    justifyContent: "space-between"
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

export default connect(mapStateToProps)(OnlineGameView);
