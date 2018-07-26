import React from "react";
import {
  Alert,
  Dimensions,
  Image,
  PanResponder,
  PanResponderInstance,
  StyleSheet,
  View
} from "react-native";
import firebase from "react-native-firebase";
import Backend from "../../lib/backend";

const ImageTile = require("./assets/tile.png");
const ImageTileActive = require("./assets/tile_active.png");
const ImageCross = require("./assets/cross.png");
const ImageCircle = require("./assets/circle.png");

const screenWidth = Dimensions.get("window").width;
const tileSize = screenWidth / 15;

interface State {
  cursorX: number;
  cursorY: number;
  boardPositionY: number;
  cursorActive: boolean;
  boardPositions: any[][];
  gameId: string;
  playerWhite: string;
}

const limitYVal = yVal => {
  if (yVal < 0) {
    return 0;
  }
  if (yVal > 14) {
    return 14;
  }
  return yVal;
};

const convertToPositions = (moves: { [key: string]: boolean }) => {
  const boardPositions = [...Array(15)].map(() => [...Array(15)]);
  Object.keys(moves).map(move => {
    const position = JSON.parse(move); // { x: number, y: number}
    boardPositions[position.y][position.x] = moves[move];
  });
  return boardPositions;
};

export default class OnlineBoard extends React.Component<undefined, State> {
  panResponder: PanResponderInstance;
  unsubscribe: any;

  constructor() {
    super(undefined);
    this.state = {
      cursorX: 0,
      cursorY: 0,
      boardPositionY: 0,
      cursorActive: false,
      boardPositions: [...Array(15)].map(() => [...Array(15)]),
      gameId: null,
      playerWhite: ""
    };

    // touch gesture logic
    this.panResponder = PanResponder.create({
      // enable drag gestures
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      // on press gesture
      onPanResponderGrant: (evt, gestureState) => {
        // get cursor coordinates
        const cursorX = Math.trunc(gestureState.x0 / tileSize);
        const cursorY = limitYVal(
          Math.trunc((gestureState.y0 - this.state.boardPositionY) / tileSize)
        );
        const newBoardPositions = this.state.boardPositions.slice();
        // cancel if tile is already occupied
        if (newBoardPositions[cursorY][cursorX] !== undefined) {
          return;
        }
        this.setState({
          cursorActive: true,
          cursorX,
          cursorY
        });
      },
      onPanResponderMove: (evt, gestureState) => {
        const cursorX = Math.trunc(gestureState.moveX / tileSize);
        const cursorY = limitYVal(
          Math.trunc(
            (gestureState.moveY - this.state.boardPositionY) / tileSize
          )
        );
        const newBoardPositions = this.state.boardPositions.slice();
        this.setState({
          cursorActive: newBoardPositions[cursorY][cursorX] === undefined, // cancel if tile is already occupied
          cursorX,
          cursorY
        });
      },
      onPanResponderRelease: (evt, gestureState) => {
        const newBoardPositions = this.state.boardPositions.slice();
        // cancel if tile is already occupied
        if (
          newBoardPositions[this.state.cursorY][this.state.cursorX] !==
          undefined
        ) {
          return;
        }
        // place token at the position
        Backend.makeMove(this.state.gameId, {
          x: this.state.cursorX,
          y: this.state.cursorY
        });
        this.setState({
          cursorActive: false
        });
      }
    });
  }

  async componentDidMount() {
    const gameSnap = await Backend.findGame();
    const gameDoc = gameSnap.docs[0];
    let gameId;
    if (gameDoc) {
      gameId = await Backend.matchGame(gameDoc.id);
      console.log("Game matched");
    } else {
      gameId = await Backend.createGame();
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

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    // if (this.state.gameId) {
    //   Backend.leaveGame(this.state.gameId);
    // }
  }

  getYPosition(e) {
    this.setState({
      boardPositionY: e.nativeEvent.layout.y
    });
  }

  getTile(row, col) {
    if (this.state.cursorActive) {
      if (row === this.state.cursorY || col === this.state.cursorX) {
        return ImageTileActive;
      }
    }
    return ImageTile;
  }

  renderBoardPositions() {
    return this.state.boardPositions.map((row, rowI) => (
      <View style={styles.row} key={rowI}>
        {row.map((col, colI) => (
          <View
            key={rowI + colI}
            style={{
              position: "relative"
            }}
          >
            <Image
              source={this.getTile(rowI, colI)}
              style={{
                width: tileSize,
                height: tileSize
              }}
            />
            {col && (
              <Image
                source={ImageCross}
                style={{
                  width: tileSize,
                  height: tileSize,
                  position: "absolute"
                }}
              />
            )}
            {col === false && (
              <Image
                source={ImageCircle}
                style={{
                  width: tileSize,
                  height: tileSize,
                  position: "absolute"
                }}
              />
            )}
          </View>
        ))}
      </View>
    ));
  }

  render() {
    return (
      <View
        style={styles.board}
        onLayout={e => this.getYPosition(e)}
        {...this.panResponder.panHandlers}
      >
        {this.renderBoardPositions()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  board: {
    marginTop: 10,
    borderTopWidth: 2,
    borderBottomWidth: 2
  },
  row: {
    flexDirection: "row"
  },
  field: {
    height: tileSize,
    width: tileSize
  }
});
