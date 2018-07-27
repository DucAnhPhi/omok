import React from "react";
import { Alert, StyleSheet, View } from "react-native";
import ActionButton from "../../components/ActionButton";
import Board from "../../components/Board";
import PlayerStats from "../../components/PlayerStats";

interface State {
  boardPositions: any[][];
  whiteTurn: boolean;
}

const checkRow = (row, col, positions, currentToken) => {
  let inALine = 0;
  for (let colOffset = 1; colOffset < 5; colOffset++) {
    if (positions[row][col + colOffset] === currentToken) {
      inALine++;
    } else {
      break;
    }
  }
  return inALine === 4;
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
  return inALine === 4;
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
  return inALine === 4;
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
  return inALine === 4;
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
        if (checkRow(row, col, positions, currentToken)) {
          return true;
        }
      }
      // lookup the next 4 same tokens south if row + 4 <15
      if (!overBottomLimit) {
        if (checkColumn(row, col, positions, currentToken)) {
          return true;
        }
      }
      // lookup the next 4 same tokens diagonally right if col+4<15 && row+4<15
      if (!overRightLimit && !overBottomLimit) {
        if (checkDiagonalRight(row, col, positions, currentToken)) {
          return true;
        }
      }
      // lookup the next 4 same tokens diagonally left if col-4 >=0 && row+4<15
      if (!overLeftLimit && !overBottomLimit) {
        if (checkDiagonalLeft(row, col, positions, currentToken)) {
          return true;
        }
      }
    }
  }
  return false;
};

export default class OfflineGameView extends React.Component<undefined, State> {
  static navigatorStyle = {
    navBarBackgroundColor: "#FEFAD4",
    topBarElevationShadowEnabled: false,
    navBarTitleTextCentered: true
  };

  constructor() {
    super(undefined);
    this.state = {
      boardPositions: [...Array(15)].map(() => [...Array(15)]),
      whiteTurn: true
    };
  }

  makeMove = (position: { x: number; y: number }) => {
    const newBoardPositions = this.state.boardPositions.slice();
    // if field already occupied, cancel function
    if (newBoardPositions[position.y][position.x] !== undefined) {
      return;
    }
    newBoardPositions[position.y][position.x] = this.state.whiteTurn;
    this.setState({
      boardPositions: newBoardPositions,
      whiteTurn: !this.state.whiteTurn
    });
    const isVictory = checkVictory(
      this.state.whiteTurn,
      this.state.boardPositions
    );
    if (isVictory) {
      alert("win");
    }
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
