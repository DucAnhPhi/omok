import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";

const ImageTile = require("./assets/tile.png");
const ImageCross = require("./assets/cross.png");
const ImageCircle = require("./assets/circle.png");

const screenWidth = Dimensions.get("window").width;
const tileSize = screenWidth / 15;

export default class Board extends React.Component {
  render() {
    return (
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
    );
  }
}

const styles = StyleSheet.create({
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
  }
});
