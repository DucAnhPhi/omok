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
    width: 80,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#9f9f9f",
    borderWidth: 2
  },
  buttonLabel: {
    color: "white",
    fontWeight: "600"
  }
});
