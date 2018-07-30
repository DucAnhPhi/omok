import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

interface Props {
  navigator: any;
}

export default class GameListView extends React.Component<Props> {
  static navigatorStyle = {
    navBarBackgroundColor: "#FEFAD4",
    topBarElevationShadowEnabled: false,
    navBarTitleTextCentered: true
  };

  createGame() {
    this.props.navigator.push({
      screen: "omok.OnlineGameView",
      animated: true,
      passProps: {
        isCreating: true
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>OPEN GAMES</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.createGame()}
          >
            <Text style={styles.buttonLabel}>CREATE GAME</Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={styles.openGame}>
            <View style={styles.gameCard}>
              <View style={styles.time}>
                <Text style={styles.text}>5 m</Text>
              </View>
              <View style={styles.creator}>
                <Text style={styles.textBold}>DUCANHPHI</Text>
                <Text style={styles.text}>1500</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.join}>
              <Text style={styles.textBold}>JOIN</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FEFAD4"
  },
  header: {
    marginTop: 10,
    marginBottom: 20,
    flexDirection: "row",
    paddingHorizontal: 20
  },
  title: {
    borderBottomWidth: 10,
    borderColor: "black",
    fontSize: 20,
    color: "black",
    alignSelf: "flex-start"
  },
  button: {
    marginLeft: 40,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FCD0BA"
  },
  buttonLabel: {
    color: "black",
    fontWeight: "600"
  },
  openGame: {
    marginHorizontal: 20,
    marginVertical: 5,
    flexDirection: "row"
  },
  gameCard: {
    flexDirection: "row",
    flex: 0.8,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    borderColor: "black",
    borderWidth: 5
  },
  time: {
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center"
  },
  creator: {
    flex: 0.6
  },
  text: {
    color: "black"
  },
  textBold: {
    color: "black",
    fontWeight: "600"
  },
  join: {
    flex: 0.2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#8FB9A8",
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5
  }
});
