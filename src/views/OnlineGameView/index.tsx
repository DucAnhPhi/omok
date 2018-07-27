import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import firebase from "react-native-firebase";
import ActionButton from "../../components/ActionButton";
import Board from "../../components/Board";
import PlayerStats from "../../components/PlayerStats";
import Backend from "../../lib/backend";

interface State {
  boardPositions: any[][];
  gameId: string;
  playerWhite: string;
  loading: boolean;
  loadingMessage: string;
}

const convertToPositions = (moves: { [key: string]: boolean }) => {
  const boardPositions = [...Array(15)].map(() => [...Array(15)]);
  Object.keys(moves).map(move => {
    const position = JSON.parse(move); // { x: number, y: number}
    boardPositions[position.y][position.x] = moves[move];
  });
  return boardPositions;
};

export default class OnlineGameView extends React.Component<undefined, State> {
  static navigatorStyle = {
    navBarBackgroundColor: "#FEFAD4",
    topBarElevationShadowEnabled: false,
    navBarTitleTextCentered: true
  };

  unsubscribe: any;

  constructor() {
    super(undefined);
    this.state = {
      loading: false,
      boardPositions: [...Array(15)].map(() => [...Array(15)]),
      gameId: null,
      playerWhite: null,
      loadingMessage: null
    };
  }

  async componentDidMount() {
    this.setState({
      loading: true,
      loadingMessage: "Looking for open game..."
    });
    const gameSnap = await Backend.findGame();
    const gameDoc = gameSnap.docs[0];
    let gameId;
    if (gameDoc) {
      this.setState({ loadingMessage: "Game found. Making match..." });
      gameId = await Backend.matchGame(gameDoc.id);
      this.setState({ loading: false });
      console.log("Game matched");
    } else {
      this.setState({ loadingMessage: "No open game found. Creating game..." });
      gameId = await Backend.createGame();
      this.setState({
        loadingMessage: "Game created. Waiting for opponent..."
      });
      console.log("Game created");
    }
    this.setState({ gameId });
    this.unsubscribe = firebase
      .firestore()
      .collection("games")
      .doc(gameId)
      .onSnapshot(doc => {
        if (doc.exists) {
          console.log("about to update the game state");
          const game = doc.data() as any;
          this.setState({
            boardPositions: convertToPositions(game.moves),
            playerWhite: game.playerWhite
          });
        }
      });
  }

  makeMove = (position: { x: number; y: number }) => {
    Backend.makeMove(this.state.gameId, position);
  };

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

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
