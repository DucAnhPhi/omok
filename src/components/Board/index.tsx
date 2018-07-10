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

const checkRow = (row, col, positions, currentToken) => {
  let inALine = 0;
  for (let colOffset = 1; colOffset < 5; colOffset++) {
    if (positions[row][col + colOffset] === currentToken) {
      inALine++;
    } else {
      break;
    }
  }
  if (inALine === 4) {
    alert("win");
    return true;
  }
};

const checkColumn = (row, col, positions, currentToken) => {
  let inALine = 0;
  for (let rowOffset = 1; rowOffset < 5; rowOffset++) {
    if (positions[row + rowOffset][col] === currentToken) {
      inALine++;
    } else {
      break;
    }
  }
  if (inALine === 4) {
    alert("win");
    return true;
  }
};

const checkDiagonalRight = (row, col, positions, currentToken) => {
  let inALine = 0;
  for (let offset = 1; offset < 5; offset++) {
    if (positions[row + offset][col + offset] === currentToken) {
      inALine++;
    } else {
      break;
    }
  }
  if (inALine === 4) {
    alert("win");
    return true;
  }
};

const checkDiagonalLeft = (row, col, positions, currentToken) => {
  let inALine = 0;
  for (let offset = 1; offset < 5; offset++) {
    if (positions[row + offset][col - offset] === currentToken) {
      inALine++;
    } else {
      break;
    }
  }
  if (inALine === 4) {
    alert("win");
    return true;
  }
};

const checkVictory = (token: boolean, positions: any[][]) => {
  for (let row = 0; row < positions.length; row++) {
    for (let col = 0; col < positions[row].length; col++) {
      const currentToken = positions[row][col];
      if (currentToken === undefined) {
        continue;
      }
      const overBottomLimit = row + 4 > 14;
      const overRightLimit = col + 4 > 14;
      const overLeftLimit = col - 4 < 0;
      // lookup the next 4 same tokens on the right if col + 4 <15
      if (!overRightLimit) {
        checkRow(row, col, positions, currentToken);
      }
      // lookup the next 4 same tokens south if row + 4 <15
      if (!overBottomLimit) {
        checkColumn(row, col, positions, currentToken);
      }
      // lookup the next 4 same tokens diagonally right if col+4<15 && row+4<15
      if (!overRightLimit && !overBottomLimit) {
        checkDiagonalRight(row, col, positions, currentToken);
      }
      // lookup the next 4 same tokens diagonally left if col-4 >=0 && row+4<15
      if (!overLeftLimit && !overBottomLimit) {
        checkDiagonalLeft(row, col, positions, currentToken);
      }
    }
  }
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
        newBoardPositions[this.state.cursorY][
          this.state.cursorX
        ] = this.state.isPlayerOne;
        checkVictory(this.state.isPlayerOne, newBoardPositions);
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
