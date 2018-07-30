import React from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import firebase from "react-native-firebase";
import SocketIOClient from "socket.io-client";
import ActionButton from "../../components/ActionButton";
import Board from "../../components/Board";
import PlayerStats from "../../components/PlayerStats";
import Backend from "../../lib/backend";

interface Props {
  isCreating?: boolean;
}
interface State {
  boardPositions: any[][];
  gameId: string;
  playerIds: { [key: string]: boolean };
  playerWhite: string;
  loading: boolean;
  loadingMessage: string;
  winner: string;
}

const convertToPositions = (moves: { [key: string]: boolean }) => {
  const boardPositions = [...Array(15)].map(() => [...Array(15)]);
  Object.keys(moves).map(move => {
    const position = JSON.parse(move); // { x: number, y: number}
    boardPositions[position.y][position.x] = moves[move];
  });
  return boardPositions;
};

export default class OnlineGameView extends React.Component<Props, State> {
  static navigatorStyle = {
    navBarBackgroundColor: "#FEFAD4",
    topBarElevationShadowEnabled: false,
    navBarTitleTextCentered: true
  };

  io: SocketIOClient.Socket;

  constructor() {
    super(undefined);
    this.state = {
      loading: false,
      playerIds: {},
      boardPositions: [...Array(15)].map(() => [...Array(15)]),
      gameId: null,
      playerWhite: null,
      loadingMessage: null,
      winner: null
    };
  }

  componentDidMount() {
    this.io = SocketIOClient("http://192.168.178.51:3000");
    this.io.emit("createGame", { userId: firebase.auth().currentUser.uid });
    this.io.on("gameCreated", initialGame => {
      console.log(initialGame);
    });
  }

  componentWillUnmount() {
    if (this.io) {
      this.io.close();
    }
  }

  makeMove = (position: { x: number; y: number }) => {
    Backend.makeMove(this.state.gameId, position);
  };

  render() {
    return (
      <View style={styles.container}>
        {!this.state.loading && <PlayerStats />}
        {this.state.loading && (
          <View style={styles.loadingIndicator}>
            <ActivityIndicator size={"large"} color={"#8FB9A8"} />
            <Text>{this.state.loadingMessage}</Text>
          </View>
        )}
        <Board
          boardPositions={this.state.boardPositions}
          makeMove={this.makeMove}
        />
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
