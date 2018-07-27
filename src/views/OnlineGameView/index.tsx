import React from "react";
import { StyleSheet, View } from "react-native";
import firebase from "react-native-firebase";
import ActionButton from "../../components/ActionButton";
import Board from "../../components/Board";
import PlayerStats from "../../components/PlayerStats";
import Backend from "../../lib/backend";

interface State {
  boardPositions: any[][];
  gameId: string;
  playerWhite: string;
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
      boardPositions: [...Array(15)].map(() => [...Array(15)]),
      gameId: null,
      playerWhite: null
    };
  }

  async componentDidMount() {
    // TODO: action find game
    const gameSnap = await Backend.findGame();
    const gameDoc = gameSnap.docs[0];
    let gameId;
    if (gameDoc) {
      gameId = await Backend.matchGame(gameDoc.id);
      // TODO: action game found
      console.log("Game matched");
    } else {
      gameId = await Backend.createGame();
      // TODO: action game created
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

  render() {
    return (
      <View style={styles.container}>
        <PlayerStats />
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
  }
});
