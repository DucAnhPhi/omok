import React from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { NavigationScreenProp } from "react-navigation";

interface Props {
  navigation: NavigationScreenProp<any>;
}

const ImageBackArrow = require("./arrow-left.png");

function BackButton(props: Props) {
  return (
    <TouchableOpacity
      style={styles.backWrapper}
      onPress={() => props.navigation.goBack()}
    >
      <Image
        source={ImageBackArrow}
        style={styles.back}
        resizeMode={"contain"}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backWrapper: {
    display: "flex",
    justifyContent: "center",
    width: 60,
    height: 60,
    paddingLeft: 15
  },
  back: {
    height: 20,
    width: 20,
    resizeMode: "contain"
  }
});

export default BackButton;
