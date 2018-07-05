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

const screenWidth = Dimensions.get("window").width;
const tileSize = screenWidth / 15;
export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Your turn!</Text>
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
    alignItems: "center",
    backgroundColor: "white",
    flex: 1,
    justifyContent: "center"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  },
  board: {
    flex: 1
  },
  row: {
    flexDirection: "row"
  },
  field: {
    height: tileSize,
    width: tileSize
  }
});
