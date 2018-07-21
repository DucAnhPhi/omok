import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LoginButton } from "react-native-fbsdk";
import { connect } from "react-redux";
import Backend from "../../lib/backend";
import Logger from "../../lib/logger";

interface Props {
  navigator: any;
  authenticated: boolean;
}

class LoginModal extends React.Component<Props> {
  static navigatorStyle = {
    navBarHidden: true
  };

  loginAsGuest() {
    Backend.loginAsGuest().then(() => {
      this.routeToModals();
    });
  }

  loginWithFB(error, result) {
    Backend.loginFB(error, result)
      .then(() => {
        this.routeToModals();
      })
      .catch(() => Logger.error("FB Login failed", ""));
  }

  async routeToModals() {
    const { navigator, authenticated } = this.props;
    if (authenticated) {
      const currentProfile = await Backend.getCurrentProfile();
      if (currentProfile && currentProfile.exists) {
        // if profile for authenticated user exists
        navigator.dismissAllModals();
        navigator.push({
          screen: "omok.GameView",
          title: "ONLINE",
          animated: true
        });
      } else {
        // if profile for authenticated user does NOT exists
        navigator.showModal({
          screen: "omok.CreateProfileModal",
          animationType: "screen"
        });
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Login</Text>
        <TouchableOpacity
          onPress={() => {
            this.loginAsGuest();
          }}
        >
          <Text>Login as a guest</Text>
        </TouchableOpacity>
        <LoginButton
          onLoginFinished={(error, result) => {
            this.loginWithFB(error, result);
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  }
});

const mapStateToProps = (state: any) => ({
  authenticated: state.authReducer.authenticated
});

export default connect(mapStateToProps)(LoginModal);
