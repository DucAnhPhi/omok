import React from "react";
import { StyleSheet, View } from "react-native";
import ActionButton from "../../components/ActionButton";
import Board from "../../components/Board";
import PlayerStats from "../../components/PlayerStats";
import GameLogic from "../../lib/gameLogic";

interface State {
  boardPositions: any[][];
  whiteTurn: boolean;
}

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
    const isVictory = GameLogic.checkVictory(
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
