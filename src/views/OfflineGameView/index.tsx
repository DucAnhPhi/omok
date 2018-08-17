import React from "react";
import { Alert, StyleSheet, View } from "react-native";
import ActionButton from "../../components/ActionButton";
import Board from "../../components/Board";
import PlayerStats from "../../components/PlayerStats";
import GameLogic from "../../lib/gameLogic";
import { IMove, IPosition } from "../../models";

interface State {
  moves: IMove[];
  player1HasTurn: boolean;
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
      moves: [],
      player1HasTurn: true
    };
  }

  makeMove = (position: IPosition) => {
    const updatedMoves = [
      ...this.state.moves,
      { ...position, isPlayer1: this.state.player1HasTurn }
    ];
    this.setState({
      moves: updatedMoves,
      player1HasTurn: !this.state.player1HasTurn
    });
    const isVictory = GameLogic.checkVictory(
      this.state.player1HasTurn,
      GameLogic.convertMovesToPositions(updatedMoves)
    );
    if (isVictory) {
      Alert.alert(
        "Win",
        `${this.state.player1HasTurn ? "PLAYER1" : "PLAYER2"} wins!`,
        [
          {
            text: "play again",
            onPress: () => {
              this.setState({
                moves: [],
                player1HasTurn: true
              });
            }
          }
        ],
        { cancelable: false }
      );
    }
  };

  redo() {
    this.setState({
      moves: this.state.moves.slice(0, -1),
      player1HasTurn: !this.state.player1HasTurn
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.players}>
          <PlayerStats
            name={"PLAYER1"}
            hasTurn={this.state.player1HasTurn}
            isPlayer1={true}
            offline={true}
          />
          <PlayerStats
            name={"PLAYER2"}
            hasTurn={this.state.player1HasTurn === false}
            isPlayer1={false}
            offline={true}
          />
        </View>
        <ActionButton
          label={"redo"}
          onPress={() => this.redo()}
          disabled={this.state.moves.length === 0}
        />
        <Board
          boardPositions={GameLogic.convertMovesToPositions(this.state.moves)}
          makeMove={(position: { x: number; y: number }) =>
            this.makeMove(position)
          }
        />
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
  players: {
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  actionButtons: {
    marginTop: 15,
    flexDirection: "row",
    width: 270,
    justifyContent: "space-between"
  }
});
