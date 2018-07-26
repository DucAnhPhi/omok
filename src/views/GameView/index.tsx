import React from "react";
import { StyleSheet, View } from "react-native";
import ActionButton from "../../components/ActionButton";
import BackButton from "../../components/BackButton";
import OnlineBoard from "../../components/OnlineBoard";
import PlayerStats from "../../components/PlayerStats";

export default class GameView extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "2 PLAYERS OFFLINE",
      headerLeft: <BackButton navigation={navigation} />,
      headerStyle: { elevation: 0 }
    };
  };

  render() {
    return (
      <View style={styles.container}>
        <PlayerStats />
        <OnlineBoard />
        <View style={styles.actionButtons}>
          <ActionButton label={"redo"} />
          <ActionButton label={"draw"} />
          <ActionButton label={"give up"} isRed={true} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    alignItems: "center",
    flex: 1
  },
  actionButtons: {
    marginTop: 20,
    flexDirection: "row",
    width: 270,
    justifyContent: "space-between"
  }
});
