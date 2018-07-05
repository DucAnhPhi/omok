import React, { Component } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import ImageTile from "./assets/tile.png";
import ImageCircle from "./assets/circle.png";
import ImageCross from "./assets/cross.png";
import ImageTime from "./assets/time.png";

const screenWidth = Dimensions.get("window").width;
const tileSize = screenWidth / 15;
export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.notification}>YOUR TURN</Text>
        <View style={styles.players}>
          <View style={[styles.playerCard, { borderColor: "red" }]}>
            <View style={styles.playerHeader}>
              <Text style={styles.playerName}>duc</Text>
            </View>
            <View style={styles.playerStats}>
              <View style={styles.playerType}>
                <Image
                  source={ImageCross}
                  style={{ width: tileSize, height: tileSize }}
                />
              </View>
              <View style={styles.playerTime}>
                <Text style={{ color: "red", fontSize: 20 }}> 5:00</Text>
                <Image source={ImageTime} style={{ width: 20, height: 20 }} />
              </View>
            </View>
          </View>
          <View style={styles.playerCard}>
            <View style={styles.playerHeader}>
              <Text style={styles.playerName}>david</Text>
            </View>
            <View style={styles.playerStats}>
              <View style={styles.playerType}>
                <Image
                  source={ImageCircle}
                  style={{ width: tileSize, height: tileSize }}
                />
              </View>
              <View style={styles.playerTime}>
                <Text style={{ color: "black", fontSize: 20 }}> 5:00</Text>
                <Image source={ImageTime} style={{ width: 20, height: 20 }} />
              </View>
            </View>
          </View>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonLabel}>REDO</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonLabel}>DRAW</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#c0392b" }]}
          >
            <Text style={styles.buttonLabel}>GIVE UP</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.board}>
          {[...Array(15)].map((v, i) => (
            <View style={styles.row} key={i}>
              {[...Array(15)].map((val, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    position: "relative"
                  }}
                >
                  <Image
                    source={ImageTile}
                    style={{
                      width: tileSize,
                      height: tileSize
                    }}
                  />
                  {/* <Image
                    source={ImageCross}
                    style={{
                      width: tileSize,
                      height: tileSize,
                      position: "absolute"
                    }}
                  />
                  <Image
                    source={ImageCircle}
                    style={{
                      width: tileSize,
                      height: tileSize,
                      position: "absolute"
                    }}
                  /> */}
                </TouchableOpacity>
              ))}
            </View>
          ))}
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
  notification: {
    marginTop: 15,
    fontSize: 20,
    textAlign: "center",
    color: "black"
  },
  players: {
    marginTop: 20,
    flexDirection: "row",
    width: 270,
    justifyContent: "space-between"
  },
  playerCard: {
    borderWidth: 1,
    width: 120,
    borderRadius: 4,
    borderColor: "black"
  },
  playerHeader: {
    height: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderColor: "black"
  },
  playerName: {
    fontSize: 20,
    color: "black"
  },
  playerStats: {
    flexDirection: "row"
  },
  playerType: {
    flex: 0.3,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1
  },
  playerTime: {
    flex: 0.7,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  },
  board: {
    flex: 1,
    marginTop: 20
  },
  row: {
    flexDirection: "row"
  },
  field: {
    height: tileSize,
    width: tileSize
  },
  actionButtons: {
    marginTop: 20,
    flexDirection: "row",
    width: 270,
    justifyContent: "space-between"
  },
  button: {
    borderRadius: 4,
    width: 80,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black"
  },
  buttonLabel: {
    color: "white"
  }
});
