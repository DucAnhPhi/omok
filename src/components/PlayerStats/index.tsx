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
            <Text style={styles.playerName}>DUCANHPHI1</Text>
            <Text>1500</Text>
          </View>
          <View style={styles.playerType}>
            <Image source={ImageCross} style={{ width: 20, height: 20 }} />
          </View>
          <View style={styles.playerTime}>
            <Text style={styles.playerTimeText}> 5:00</Text>
          </View>
        </View>
        <View style={[styles.playerCard, false && styles.activePlayer]}>
          <View style={styles.playerHeader}>
            <Text style={styles.playerName}>DAVID</Text>
            <Text>1500</Text>
          </View>
          <View style={styles.playerType}>
            <Image source={ImageCircle} style={{ width: 20, height: 20 }} />
          </View>
          <View style={styles.playerTime}>
            <Text style={styles.playerTimeText}> 5:00</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  players: {
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  playerCard: {
    width: 145,
    opacity: 0.2,
    marginHorizontal: 10,
    position: "relative",
    borderWidth: 5,
    borderRadius: 5
  },
  playerHeader: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  playerName: {
    fontSize: 18,
    fontWeight: "600",
    color: "black"
  },
  playerType: {
    position: "absolute",
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderTopRightRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    height: 30,
    width: 30,
    left: 0,
    bottom: 0
  },
  playerTime: {
    flexDirection: "row",
    justifyContent: "center"
  },
  playerTimeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "black"
  },
  activePlayer: {
    opacity: 1
  }
});
