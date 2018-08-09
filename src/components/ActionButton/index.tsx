import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface Props {
  label: string;
  onPress?: (arg: any) => void;
  disabled?: boolean;
}

export default function ActionButton(props: Props) {
  return (
    <TouchableOpacity
      onPress={props.onPress ? props.onPress : undefined}
      style={[styles.button, props.disabled && styles.disabled]}
      disabled={props.disabled}
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
    backgroundColor: "#FCD0BA",
    borderRadius: 5,
    marginHorizontal: 10
  },
  disabled: {
    opacity: 0.2
  },
  buttonLabel: {
    color: "black",
    fontWeight: "600"
  }
});
