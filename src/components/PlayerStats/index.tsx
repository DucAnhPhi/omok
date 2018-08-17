import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { formatSeconds } from "../../lib/time";

const ImageCross = require("./assets/cross.png");
const ImageCircle = require("./assets/circle.png");
const ImageReady = require("./assets/ready.png");

interface Props {
  name: string;
  points?: string;
  isPlayer1: boolean;
  time?: number;
  hasTurn: boolean;
  isReady?: boolean;
  offline?: boolean;
}

export default function PlayerStats(props: Props) {
  return (
    <View
      style={[
        styles.playerCard,
        props.hasTurn && styles.activePlayer,
        !props.offline && { height: 75 }
      ]}
    >
      <View style={styles.playerHeader}>
        <View>
          <Text style={styles.playerName}>{props.name.toUpperCase()}</Text>
        </View>
        {!props.offline &&
          props.points.length !== 0 && (
            <Text style={{ color: "black" }}>{props.points}P</Text>
          )}
      </View>
      {props.isReady && <Image source={ImageReady} style={styles.ready} />}
      <Image
        source={props.isPlayer1 ? ImageCross : ImageCircle}
        style={[styles.playerType, props.offline && styles.offline]}
      />
      {!props.offline &&
        props.time !== undefined && (
          <View style={styles.playerTime}>
            <Text style={styles.playerTimeText}>
              {formatSeconds(props.time)}
            </Text>
          </View>
        )}
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
  offline: {
    left: 0,
    bottom: 0
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
    height: 25,
    width: 25,
    left: 5,
    bottom: 5
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
  },
  ready: {
    position: "absolute",
    right: 5,
    bottom: 5,
    width: 25,
    height: 25
  }
});
