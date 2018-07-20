import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import firebase from "react-native-firebase";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Backend from "../../lib/backend";
import Logger from "../../lib/logger";
import { loginSuccess, logoutSuccess } from "../../store/auth";
import { clearProfile, updateProfile } from "../../store/profile";

interface Props {
  navigator: any;
  loginSuccess: () => void;
  logoutSuccess: () => void;
  updateProfile: (profile: any) => void;
  clearProfile: () => void;
}

class HomeView extends React.Component<Props> {
  static navigationOptions = {
    header: null
  };

  async componentDidMount() {
    const currentUser = await Backend.loginAsGuest();
    if (currentUser) {
      this.props.loginSuccess();
    }
  }

  async routingAction() {
    const { navigator } = this.props;
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
      // if user is authenticated...
      const currentProfile = await Backend.getCurrentProfile();
      if (currentProfile && currentProfile.exists) {
        // ... and profile for authenticated user exists
        this.props.updateProfile(currentProfile.data());
        navigator.push({
          screen: "omok.GameView",
          title: "ONLINE",
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
          Backend.logout().then(() => {
            this.props.logoutSuccess();
            this.props.clearProfile();
          });
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
      <View>
        <Text>Home</Text>
        <TouchableOpacity
          onPress={() => {
            this.routingAction();
          }}
        >
          <Text>PLAY ONLINE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            this.props.navigator.push({
              screen: "omok.GameView",
              title: "2 PLAYERS OFFLINE",
              animated: true
            })
          }
        >
          <Text>2 PLAYERS OFFLINE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.logout();
          }}
        >
          <Text>LOGOUT</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    { loginSuccess, logoutSuccess, updateProfile, clearProfile },
    dispatch
  );

export default connect(
  undefined,
  mapDispatchToProps
)(HomeView);
