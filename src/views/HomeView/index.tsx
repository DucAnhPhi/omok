import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  navigation: any;
}

export default class HomeView extends React.Component<Props> {
  static navigationOptions = {
    header: null
  };
  render() {
    return (
      <View>
        <Text>Home</Text>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("GameView")}
        >
          <Text>PLAY ONLINE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("GameView")}
        >
          <Text>2 PLAYERS OFFLINE</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
