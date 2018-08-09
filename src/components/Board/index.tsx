import React from "react";
import {
  Dimensions,
  Image,
  PanResponder,
  PanResponderInstance,
  StyleSheet,
  Text,
  View
} from "react-native";

const ImageTile = require("./assets/tile.png");
const ImageTileActive = require("./assets/tile-active.png");
const ImageTileFocus = require("./assets/tile-focus.png");
const ImageCross = require("./assets/cross.png");
const ImageCircle = require("./assets/circle.png");

const screenWidth = Dimensions.get("window").width;
const tileSize = screenWidth / 15;

interface Props {
  boardPositions: any[][];
  disabled?: boolean;
  gameEndType?: "win" | "lose" | "draw";
  makeMove: (position: { x: number; y: number }) => void;
}
interface State {
  cursorX: number;
  cursorY: number;
  cursorActive: boolean;
  boardPositionY: number;
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

export default class Board extends React.Component<Props, State> {
  panResponder: PanResponderInstance;
  unsubscribe: any;

  constructor() {
    super(undefined);
    this.state = {
      cursorX: 0,
      cursorY: 0,
      cursorActive: false,
      boardPositionY: 0
    };

    // touch gesture logic
    this.panResponder = PanResponder.create({
      // enable drag gestures
      onStartShouldSetPanResponder: (evt, gestureState) =>
        this.props.disabled ? false : true,
      // on press gesture
      onPanResponderGrant: (evt, gestureState) => {
        // get cursor coordinates
        const cursorX = Math.trunc(gestureState.x0 / tileSize);
        const cursorY = limitYVal(
          Math.trunc((gestureState.y0 - this.state.boardPositionY) / tileSize)
        );
        const newBoardPositions = this.props.boardPositions.slice();
        // cancel if tile is already occupied
        if (newBoardPositions[cursorY][cursorX] !== null) {
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
        const newBoardPositions = this.props.boardPositions.slice();
        this.setState({
          cursorActive: newBoardPositions[cursorY][cursorX] === null, // cancel if tile is already occupied
          cursorX,
          cursorY
        });
      },
      onPanResponderRelease: (evt, gestureState) => {
        const newBoardPositions = this.props.boardPositions.slice();
        // cancel if tile is already occupied
        if (
          newBoardPositions[this.state.cursorY][this.state.cursorX] !== null
        ) {
          return;
        }
        // place token at the position
        this.props.makeMove({ x: this.state.cursorX, y: this.state.cursorY });
        this.setState({
          cursorActive: false
        });
      }
    });
  }

  getYPosition(e) {
    this.setState({
      boardPositionY: e.nativeEvent.layout.y
    });
  }

  getTile(row, col) {
    if (this.state.cursorActive) {
      if (row === this.state.cursorY || col === this.state.cursorX) {
        if (row === this.state.cursorY && col === this.state.cursorX) {
          return ImageTileFocus;
        }
        return ImageTileActive;
      }
    }
    return ImageTile;
  }

  renderBoardPositions() {
    return this.props.boardPositions.map((row, rowI) => (
      <View style={styles.row} key={rowI}>
        {row.map((col, colI) => (
          <View key={rowI + colI} style={styles.field}>
            <Image
              source={this.getTile(rowI, colI)}
              style={{
                width: tileSize,
                height: tileSize
              }}
            />
            {col !== null && (
              <Image
                source={col ? ImageCross : ImageCircle}
                style={{
                  width: tileSize - 4,
                  height: tileSize - 4,
                  position: "absolute"
                }}
              />
            )}
          </View>
        ))}
      </View>
    ));
  }

  getGameEndLabel() {
    const { gameEndType } = this.props;
    if (gameEndType === "win") {
      return "YOU WIN";
    }
    if (gameEndType === "lose") {
      return "YOU LOSE";
    }
    if (gameEndType === "draw") {
      return "DRAW";
    }
  }

  render() {
    return (
      <View
        style={styles.board}
        onLayout={e => this.getYPosition(e)}
        {...this.panResponder.panHandlers}
      >
        {this.renderBoardPositions()}
        {this.props.gameEndType && (
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>{this.getGameEndLabel()}</Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  board: {
    marginTop: 10,
    position: "relative"
  },
  row: {
    flexDirection: "row"
  },
  field: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center"
  },
  overlay: {
    position: "absolute",
    zIndex: 2,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 100,
    backgroundColor: "#765D69"
  },
  overlayText: {
    fontSize: 40,
    color: "black",
    fontWeight: "600"
  }
});
