import React from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import firebase from "react-native-firebase";
import SocketIOClient from "socket.io-client";
import { URI } from "../../../config";
import TouchableDebounce from "../../components/TouchableDebounce";
import Backend from "../../lib/backend";
import { IGame } from "../../models";

interface Props {
  navigator: any;
}

interface State {
  gameList: IGame[];
}

export default class GameListView extends React.Component<Props, State> {
  static navigatorStyle = {
    navBarBackgroundColor: "#FEFAD4",
    topBarElevationShadowEnabled: false,
    navBarTitleTextCentered: true
  };

  gameListSocket: SocketIOClient.Socket;

  constructor() {
    super(undefined);
    this.state = {
      gameList: []
    };
  }

  async componentDidMount() {
    const firebaseToken = await firebase.auth().currentUser.getIdToken(true);
    this.gameListSocket = SocketIOClient.connect(
      `${URI}/gameList`,
      {
        query: { token: firebaseToken }
      }
    );
    this.gameListSocket.once("connect", gameList => {
      this.setState({ gameList });
    });
    this.gameListSocket.on("openGames", gameList => {
      this.setState({ gameList });
    });
    this.gameListSocket.on("error", error =>
      console.log("socket error:", error)
    );
  }

  async componentWillUnmount() {
    if (this.gameListSocket) {
      this.gameListSocket.close();
    }
    if (firebase.auth().currentUser.isAnonymous) {
      Backend.logout();
    }
  }

  handleCreateGame() {
    Alert.alert("Create game", "Please choose the time mode:", [
      {
        text: "1 minute",
        onPress: () => this.createGame(1)
      },
      {
        text: "5 minutes",
        onPress: () => this.createGame(5)
      }
    ]);
  }

  createGame(timeMode: number) {
    this.props.navigator.push({
      screen: "omok.OnlineGameView",
      animated: true,
      passProps: {
        isCreating: { timeMode }
      }
    });
  }

  joinGame(gameId: string) {
    this.props.navigator.push({
      screen: "omok.OnlineGameView",
      animated: true,
      passProps: {
        isJoining: true,
        gameId
      }
    });
  }

  renderGameItem(game: IGame) {
    return (
      <View style={styles.openGame}>
        <View style={styles.gameCard}>
          <View style={styles.time}>
            <Text style={styles.text}>{game.timeMode} m</Text>
          </View>
          <View style={styles.creator}>
            <Text style={styles.textBold}>
              {game.player1Name.toUpperCase()}
            </Text>
            <Text style={styles.text}>{game.player1Points}P</Text>
          </View>
        </View>
        <TouchableDebounce
          style={styles.join}
          onPress={() => this.joinGame(game.gameId)}
        >
          <Text style={styles.textBold}>JOIN</Text>
        </TouchableDebounce>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>OPEN GAMES</Text>
          <TouchableDebounce
            style={styles.button}
            onPress={() => this.handleCreateGame()}
          >
            <Text style={styles.buttonLabel}>CREATE GAME</Text>
          </TouchableDebounce>
        </View>
        <FlatList
          data={this.state.gameList}
          keyExtractor={(game: IGame) => game.gameId}
          renderItem={({ item }) => this.renderGameItem(item)}
        />
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
    borderBottomWidth: 5,
    borderColor: "black",
    fontSize: 20,
    fontWeight: "600",
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
