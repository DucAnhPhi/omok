import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { connect } from "react-redux";
import TouchableDebounce from "../../components/TouchableDebounce";
import Backend from "../../lib/backend";
import Logger from "../../lib/logger";
import { IProfile } from "../../models";

interface Props {
  navigator: any;
  profile: IProfile;
  authenticated: boolean;
}

class HomeView extends React.Component<Props> {
  static navigatorStyle = {
    navBarHidden: true
  };

  async routingAction() {
    const { navigator, profile, authenticated } = this.props;
    if (authenticated) {
      // if user is authenticated...
      if (profile) {
        // if profile was persisted in redux
        navigator.push({
          screen: "omok.GameListView",
          title: "PLAY ONLINE",
          animated: true
        });
      } else {
        // ... and profile for authenticated user does NOT exists
        navigator.showModal({
          screen: "omok.CreateProfileModal",
          animationType: "screen"
        });
      }
    } else {
      // if user is not authenticated
      navigator.showModal({
        screen: "omok.LoginModal",
        animationType: "screen"
      });
    }
  }

  logout() {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      {
        text: "ok",
        onPress: () => {
          Backend.logout();
        }
      },
      {
        text: "cancel",
        onPress: () => Logger.info("logout cancelled", ""),
        style: "cancel"
      }
    ]);
  }

  render() {
    return (
      <View style={styles.home}>
        <TouchableDebounce
          onPress={() => {
            this.routingAction();
          }}
          style={[styles.button, { backgroundColor: "#8FB9A8" }]}
        >
          <Text style={styles.buttonLabel}>PLAY ONLINE</Text>
        </TouchableDebounce>
        <TouchableDebounce
          onPress={() =>
            this.props.navigator.push({
              screen: "omok.OfflineGameView",
              title: "2 PLAYERS OFFLINE",
              animated: true
            })
          }
          style={[styles.button, { backgroundColor: "#765D69" }]}
        >
          <Text style={styles.buttonLabel}>2 PLAYERS OFFLINE</Text>
        </TouchableDebounce>
        {this.props.authenticated && (
          <TouchableOpacity
            onPress={() => {
              this.logout();
            }}
            style={{ marginTop: 20, height: 20 }}
          >
            <Text>LOGOUT</Text>
          </TouchableOpacity>
        )}
        {!this.props.authenticated && <View style={styles.filler} />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    flex: 1,
    backgroundColor: "#FEFAD4",
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    width: 300,
    height: 50,
    margin: 15,
    borderRadius: 5,
    justifyContent: "center"
  },
  buttonLabel: {
    fontSize: 20,
    color: "black",
    textAlign: "center",
    fontWeight: "600"
  },
  filler: {
    height: 20,
    marginTop: 20
  }
});

const mapStateToProps = (state: any) => ({
  profile: state.profileReducer.profile,
  authenticated: state.authReducer.authenticated
});

export default connect(mapStateToProps)(HomeView);
