import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import SocketIOClient from "socket.io-client";
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

  componentDidMount() {
    this.gameListSocket = SocketIOClient.connect(
      "http://192.168.178.51:3000/gameList"
    );
    this.gameListSocket.on("openGames", gameList => {
      this.setState({ gameList });
    });
  }

  componentWillUnmount() {
    if (this.gameListSocket) {
      this.gameListSocket.close();
    }
  }

  createGame() {
    this.props.navigator.push({
      screen: "omok.OnlineGameView",
      animated: true,
      passProps: {
        isCreating: true
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
            <Text style={styles.text}>{game.player1Points}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.join}
          onPress={() => this.joinGame(game.gameId)}
        >
          <Text style={styles.textBold}>JOIN</Text>
        </TouchableOpacity>
      </View>
    );
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
