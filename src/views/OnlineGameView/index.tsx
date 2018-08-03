import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import firebase from "react-native-firebase";
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
  loading: boolean;
  game: any;
  hasTurn: boolean;
  isPlayer1: boolean;
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

  constructor() {
    super(undefined);
    this.state = {
      loading: false,
      game: null,
      hasTurn: null,
      isPlayer1: false
    };
  }

  componentDidMount() {
    const { isCreating, isJoining, profile, gameId } = this.props;
    this.gameSocket = SocketIOClient.connect("http://192.168.178.51:3000/game");
    if (isCreating) {
      this.gameSocket.emit("createGame", { user: profile, time: 5 });
    }
    if (isJoining) {
      this.gameSocket.emit("joinGame", { gameId, user: profile });
    }
    this.gameSocket.on("gameCreated", initialGame => {
      this.setState({ isPlayer1: true, game: initialGame });
    });
    this.gameSocket.on("gameJoined", initialGame => {
      console.log(initialGame);
      this.setState({ game: initialGame });
    });
    this.gameSocket.on("move", () => {
      this.setState({ hasTurn: true });
      this.timerRef = setInterval(() => {
        this.gameSocket.emit("tick", { gameId: this.state.game.gameId });
      }, 1000);
    });
    this.gameSocket.on(
      "timeUpdated",
      (params: { time: number; isPlayer1: boolean }) => {
        if (params.isPlayer1) {
          this.setState({
            game: {
              ...this.state.game,
              player1Time: params.time
            }
          });
        } else {
          this.setState({
            game: {
              ...this.state.game,
              player2Time: params.time
            }
          });
        }
      }
    );
  }

  componentWillUnmount() {
    if (this.gameSocket) {
      this.gameSocket.close();
    }
  }

  makeMove = () => {
    this.setState({ hasTurn: false });
    this.gameSocket.emit("move", { gameId: this.state.game.gameId });
    clearInterval(this.timerRef);
  };

  playerReady() {
    const { game } = this.state;
    if (game) {
      this.gameSocket.emit("playerReady", { gameId: game.gameId });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.game && (
          <View style={styles.players}>
            <PlayerStats
              name={this.props.profile.username}
              points={this.props.profile.points}
              time={
                this.state.isPlayer1
                  ? this.state.game.player1Time
                  : this.state.game.player2Time
              }
              hasTurn={this.state.hasTurn}
              isPlayer1={this.state.isPlayer1}
            />
            <PlayerStats
              name={
                this.state.isPlayer1
                  ? this.state.game.player2Name
                  : this.state.game.player1Name
              }
              points={
                this.state.isPlayer1
                  ? this.state.game.player2Points
                  : this.state.game.player1Points
              }
              time={
                this.state.isPlayer1
                  ? this.state.game.player2Time
                  : this.state.game.player1Time
              }
              hasTurn={this.state.hasTurn === false}
              isPlayer1={!this.state.isPlayer1}
            />
          </View>
        )}
        {this.state.loading && (
          <View style={styles.loadingIndicator}>
            <ActivityIndicator size={"large"} color={"#8FB9A8"} />
            {/* <Text>{this.state.loadingMessage}</Text> */}
          </View>
        )}
        <TouchableOpacity onPress={() => this.playerReady()}>
          <Text>READY</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.makeMove()}>
          <Text>move</Text>
        </TouchableOpacity>
        {/* <Board
          boardPositions={this.state.boardPositions}
          makeMove={this.makeMove}
        /> */}
        <View style={styles.actionButtons}>
          <ActionButton label={"redo"} />
          <ActionButton label={"draw"} />
          <ActionButton label={"give up"} isRed={true} />
        </View>
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
    height: 100,
    justifyContent: "center",
    alignItems: "center"
  }
});

const mapStateToProps = (state: any) => ({
  profile: state.profileReducer.profile
});

export default connect(mapStateToProps)(OnlineGameView);
