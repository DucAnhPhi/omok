import React from "react";
import {
  Dimensions,
  Image,
  PanResponder,
  PanResponderInstance,
  StyleSheet,
  View
} from "react-native";

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
  isPlayerOne: boolean;
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
export default class Board extends React.Component<undefined, State> {
  panResponder: PanResponderInstance;

  constructor() {
    super(undefined);
    this.state = {
      cursorX: 0,
      cursorY: 0,
      boardPositionY: 0,
      cursorActive: false,
      boardPositions: [...Array(15)].map(() => [...Array(15)]),
      isPlayerOne: true
    };

    // touch gesture logic
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        this.setState({
          cursorActive: true,
          cursorX: Math.trunc(gestureState.x0 / tileSize),
          cursorY: limitYVal(
            Math.trunc((gestureState.y0 - this.state.boardPositionY) / tileSize)
          )
        });
      },
      onPanResponderMove: (evt, gestureState) => {
        this.setState({
          cursorActive: true,
          cursorX: Math.trunc(gestureState.moveX / tileSize),
          cursorY: limitYVal(
            Math.trunc(
              (gestureState.moveY - this.state.boardPositionY) / tileSize
            )
          )
        });
      },
      onPanResponderRelease: (evt, gestureState) => {
        // place token at the position
        const newBoardPositions = this.state.boardPositions.slice();
        newBoardPositions[this.state.cursorY][
          this.state.cursorX
        ] = this.state.isPlayerOne;
        this.setState({
          cursorActive: false,
          boardPositions: newBoardPositions,
          // change turn
          isPlayerOne: !this.state.isPlayerOne
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
    flex: 1,
    marginTop: 20
  },
  row: {
    flexDirection: "row"
  },
  field: {
    height: tileSize,
    width: tileSize
  }
});
