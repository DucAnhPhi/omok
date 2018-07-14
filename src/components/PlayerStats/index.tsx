import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const ImageCross = require("./assets/cross.png");
const ImageCircle = require("./assets/circle.png");

export default class PlayerStats extends React.Component {
  render() {
    return (
      <View style={styles.players}>
        <View style={[styles.playerCard, styles.activePlayer]}>
          <View style={styles.playerHeader}>
            <Text style={styles.playerName}>DUC</Text>
          </View>
          <View style={styles.playerType}>
            <Image source={ImageCross} style={{ width: 20, height: 20 }} />
          </View>
          <View style={styles.playerTime}>
            <Text style={{ color: "#555555", fontSize: 20 }}> 5:00</Text>
          </View>
        </View>
        <View style={[styles.playerCard, false && styles.activePlayer]}>
          <View style={styles.playerHeader}>
            <Text style={styles.playerName}>DAVID</Text>
          </View>
          <View style={styles.playerType}>
            <Image source={ImageCircle} style={{ width: 20, height: 20 }} />
          </View>
          <View style={styles.playerTime}>
            <Text style={{ color: "#555555", fontSize: 20 }}> 5:00</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  players: {
    margin: 10,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  playerCard: {
    width: 145,
    padding: 15,
    opacity: 0.2,
    marginHorizontal: 10,
    position: "relative",
    borderWidth: 2
  },
  playerHeader: {
    height: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  playerName: {
    fontSize: 20,
    fontWeight: "600",
    color: "black"
  },
  playerType: {
    position: "absolute",
    borderRightWidth: 2,
    borderTopWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    width: 40,
    left: 0,
    bottom: 0
  },
  playerTime: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "center"
  },
  activePlayer: {
    backgroundColor: "#f7f7f7",
    borderWidth: 2,
    opacity: 1
  }
});
