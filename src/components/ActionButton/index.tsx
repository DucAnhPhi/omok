import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface Props {
  label: string;
  isRed?: boolean;
}

export default function ActionButton(props: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, props.isRed && { backgroundColor: "#c0392b" }]}
    >
      <Text style={styles.buttonLabel}>{props.label.toUpperCase()}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 4,
    width: 80,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black"
  },
  buttonLabel: {
    color: "white"
  }
});
