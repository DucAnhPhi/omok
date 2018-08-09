import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { formatSeconds } from "../../lib/time";

const ImageCross = require("./assets/cross.png");
const ImageCircle = require("./assets/circle.png");
const ImageReady = require("./assets/ready.png");

interface Props {
  name: string;
  points: number;
  isPlayer1: boolean;
  time: number;
  hasTurn: boolean;
  isReady?: boolean;
}

export default function PlayerStats(props: Props) {
  return (
    <View style={[styles.playerCard, props.hasTurn && styles.activePlayer]}>
      <View style={styles.playerHeader}>
        <View>
          <Text style={styles.playerName}>{props.name}</Text>
          {props.isReady && (
            <Image source={ImageReady} style={{ width: 20, height: 20 }} />
          )}
        </View>
        <Text>{props.points}</Text>
      </View>
      <View style={styles.playerType}>
        <Image
          source={props.isPlayer1 ? ImageCross : ImageCircle}
          style={{ width: 20, height: 20 }}
        />
      </View>
      <View style={styles.playerTime}>
        <Text style={styles.playerTimeText}>
          {props.time ? formatSeconds(props.time) : "-"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
