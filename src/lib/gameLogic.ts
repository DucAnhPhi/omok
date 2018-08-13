export default class GameLogic {
  static checkRow(row, col, positions, currentToken) {
    let inALine = 0;
    for (let colOffset = 1; colOffset < 5; colOffset++) {
      if (positions[row][col + colOffset] === currentToken) {
        inALine++;
      } else {
        break;
      }
    }
    return inALine === 4;
  }

  static checkColumn(row, col, positions, currentToken) {
    let inALine = 0;
    for (let rowOffset = 1; rowOffset < 5; rowOffset++) {
      if (positions[row + rowOffset][col] === currentToken) {
        inALine++;
      } else {
        break;
      }
    }
    return inALine === 4;
  }

  static checkDiagonalRight(row, col, positions, currentToken) {
    let inALine = 0;
    for (let offset = 1; offset < 5; offset++) {
      if (positions[row + offset][col + offset] === currentToken) {
        inALine++;
      } else {
        break;
      }
    }
    return inALine === 4;
  }

  static checkDiagonalLeft(row, col, positions, currentToken) {
    let inALine = 0;
    for (let offset = 1; offset < 5; offset++) {
      if (positions[row + offset][col - offset] === currentToken) {
        inALine++;
      } else {
        break;
      }
    }
    return inALine === 4;
  }

  // tslint:disable-next-line:cyclomatic-complexity
  static checkVictory(token: boolean, positions: any[][]) {
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
          if (this.checkRow(row, col, positions, currentToken)) {
            return true;
          }
        }
        // lookup the next 4 same tokens south if row + 4 <15
        if (!overBottomLimit) {
          if (this.checkColumn(row, col, positions, currentToken)) {
            return true;
          }
        }
        // lookup the next 4 same tokens diagonally right if col+4<15 && row+4<15
        if (!overRightLimit && !overBottomLimit) {
          if (this.checkDiagonalRight(row, col, positions, currentToken)) {
            return true;
          }
        }
        // lookup the next 4 same tokens diagonally left if col-4 >=0 && row+4<15
        if (!overLeftLimit && !overBottomLimit) {
          if (this.checkDiagonalLeft(row, col, positions, currentToken)) {
            return true;
          }
        }
      }
    }
    return false;
  }
}
