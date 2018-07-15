import React from "react";
import { StyleSheet, Text, View } from "react-native";
import ActionButton from "./components/ActionButton";
import Board from "./components/Board";
import PlayerStats from "./components/PlayerStats";

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.notification}>2 PLAYERS OFFLINE</Text>
        <PlayerStats />
        <Board />
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
    backgroundColor: "white",
    alignItems: "center",
    flex: 1
  },
  notification: {
    marginTop: 15,
    fontSize: 20,
    textAlign: "center",
    color: "black",
    fontWeight: "300"
  },
  actionButtons: {
    marginTop: 20,
    flexDirection: "row",
    width: 270,
    justifyContent: "space-between"
  }
});
