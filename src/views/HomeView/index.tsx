import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default class HomeView extends React.Component {
  render() {
    return (
      <View>
        <Text>Home</Text>
        <TouchableOpacity>
          <Text>2 PLAYERS OFFLINE</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
