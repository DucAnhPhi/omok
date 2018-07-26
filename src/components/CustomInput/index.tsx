import React from "react";
import { StyleSheet, TextInput } from "react-native";

interface TextInputProps {
  value: string;
  placeholder: string;
  onChangeText: (value: string) => void;
}

const CustomInput = (props: TextInputProps) => {
  return (
    <TextInput
      onChangeText={props.onChangeText}
      value={props.value}
      style={styles.textInput}
      underlineColorAndroid={"transparent"}
      placeholder={props.placeholder}
      autoCorrect={false}
      maxLength={10}
    />
  );
};

const styles = StyleSheet.create({
  textInput: {
    width: 320,
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 12,
    fontWeight: "400"
  }
});

export default CustomInput;
