import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import firebase from "react-native-firebase";
import { connect } from "react-redux";
import SocketIOClient from "socket.io-client";
import ActionButton from "../../components/ActionButton";
import Board from "../../components/Board";
import PlayerStats from "../../components/PlayerStats";
import { IProfile } from "../../models";

interface Props {
  isCreating?: boolean;
  isJoining?: boolean;
  gameId?: string;
  profile: IProfile;
}
interface State {
  loading: boolean;
  game: any;
  timerRef: any;
}

const convertToPositions = (moves: { [key: string]: boolean }) => {
  const boardPositions = [...Array(15)].map(() => [...Array(15)]);
  Object.keys(moves).map(move => {
    const position = JSON.parse(move); // { x: number, y: number}
    boardPositions[position.y][position.x] = moves[move];
  });
  return boardPositions;
};

class OnlineGameView extends React.Component<Props, State> {
  static navigatorStyle = {
    navBarBackgroundColor: "#FEFAD4",
    topBarElevationShadowEnabled: false,
    navBarTitleTextCentered: true
  };

  gameSocket: SocketIOClient.Socket;
  timerRef: number;

  constructor() {
    super(undefined);
    this.state = {
      loading: false,
      game: null,
      timerRef: null
    };
  }

  componentDidMount() {
    const { isCreating, isJoining, profile, gameId } = this.props;
    const userId = firebase.auth().currentUser.uid;
    this.gameSocket = SocketIOClient.connect("http://192.168.178.51:3000/game");
    if (isCreating) {
      this.gameSocket.emit("createGame", { userId, user: profile, time: 5 });
    }
    if (isJoining) {
      this.gameSocket.emit("joinGame", { gameId, userId });
    }
    this.gameSocket.on("gameCreated", initialGame => {
      this.setState({ game: initialGame });
    });
    this.gameSocket.on("gameJoined", initialGame => {
      console.log(initialGame);
      this.setState({ game: initialGame });
    });
    this.gameSocket.on("move", () => {
      this.timerRef = setInterval(() => {
        this.gameSocket.emit("tick", { gameId: this.state.game.gameId });
      }, 1000);
    });
    this.gameSocket.on(
      "timeUpdated",
      (params: { time: number; isPlayer1: boolean }) => {
        console.log(params.time, params.isPlayer1);
      }
    );
  }

  componentWillUnmount() {
    if (this.gameSocket) {
      this.gameSocket.close();
    }
  }

  makeMove = () => {
    this.gameSocket.emit("move", { gameId: this.state.game.gameId });
    clearInterval(this.timerRef);
  };

  playerReady() {
    const { game } = this.state;
    if (game) {
      this.gameSocket.emit("playerReady", { gameId: game.gameId });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {!this.state.loading && <PlayerStats />}
        {this.state.loading && (
          <View style={styles.loadingIndicator}>
            <ActivityIndicator size={"large"} color={"#8FB9A8"} />
            {/* <Text>{this.state.loadingMessage}</Text> */}
          </View>
        )}
        <TouchableOpacity onPress={() => this.playerReady()}>
          <Text>READY</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.makeMove()}>
          <Text>move</Text>
        </TouchableOpacity>
        {/* <Board
          boardPositions={this.state.boardPositions}
          makeMove={this.makeMove}
        /> */}
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
    backgroundColor: "#FEFAD4",
    alignItems: "center",
    flex: 1
  },
  actionButtons: {
    marginTop: 15,
    flexDirection: "row",
    width: 270,
    justifyContent: "space-between"
  },
  loadingIndicator: {
    height: 100,
    justifyContent: "center",
    alignItems: "center"
  }
});

const mapStateToProps = (state: any) => ({
  profile: state.profileReducer.profile
});

export default connect(mapStateToProps)(OnlineGameView);
