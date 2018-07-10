import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const ImageCross = require("./assets/cross.png");
const ImageTime = require("./assets/time.png");
const ImageCircle = require("./assets/circle.png");

export default class PlayerStats extends React.Component {
  render() {
    return (
      <View style={styles.players}>
        <View style={[styles.playerCard, { borderColor: "red" }]}>
          <View style={styles.playerHeader}>
            <Text style={styles.playerName}>duc</Text>
          </View>
          <View style={styles.playerStats}>
            <View style={styles.playerType}>
              <Image source={ImageCross} style={{ width: 20, height: 20 }} />
            </View>
            <View style={styles.playerTime}>
              <Text style={{ color: "red", fontSize: 20 }}> 5:00</Text>
              <Image source={ImageTime} style={{ width: 20, height: 20 }} />
            </View>
          </View>
        </View>
        <View style={styles.playerCard}>
          <View style={styles.playerHeader}>
            <Text style={styles.playerName}>david</Text>
          </View>
          <View style={styles.playerStats}>
            <View style={styles.playerType}>
              <Image source={ImageCircle} style={{ width: 20, height: 20 }} />
            </View>
            <View style={styles.playerTime}>
              <Text style={{ color: "black", fontSize: 20 }}> 5:00</Text>
              <Image source={ImageTime} style={{ width: 20, height: 20 }} />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  players: {
    marginTop: 20,
    flexDirection: "row",
    width: 270,
    justifyContent: "space-between"
  },
  playerCard: {
    borderWidth: 1,
    width: 120,
    borderRadius: 4,
    borderColor: "black"
  },
  playerHeader: {
    height: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderColor: "black"
  },
  playerName: {
    fontSize: 20,
    color: "black"
  },
  playerStats: {
    flexDirection: "row"
  },
  playerType: {
    flex: 0.3,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1
  },
  playerTime: {
    flex: 0.7,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  }
});
