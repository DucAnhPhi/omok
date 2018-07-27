import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { LoginButton } from "react-native-fbsdk";
import { connect } from "react-redux";
import Backend from "../../lib/backend";
import Logger from "../../lib/logger";

interface Props {
  navigator: any;
  authenticated: boolean;
}

interface State {
  loading: boolean;
}

class LoginModal extends React.Component<Props, State> {
  static navigatorStyle = {
    navBarHidden: true
  };

  constructor() {
    super(undefined);
    this.state = {
      loading: false
    };
  }

  loginAsGuest() {
    this.setState({
      loading: true
    });
    Backend.loginAsGuest()
      .then(() => {
        this.routeToModals();
        this.setState({ loading: false });
      })
      .catch(e => {
        Logger.error("Could not login as guest", e);
        this.setState({ loading: false });
      });
  }

  loginWithFB(error, result) {
    this.setState({
      loading: true
    });
    Backend.loginFB(error, result)
      .then(() => {
        this.routeToModals();
        this.setState({ loading: false });
      })
      .catch(e => {
        Logger.error("FB Login failed", e);
        this.setState({ loading: false });
      });
  }

  async routeToModals() {
    const { navigator, authenticated } = this.props;
    if (authenticated) {
      const currentProfile = await Backend.getCurrentProfile();
      if (currentProfile && currentProfile.exists) {
        // if profile for authenticated user exists
        navigator.dismissAllModals();
        navigator.push({
          screen: "omok.OnlineGameView",
          title: "ONLINE",
          animated: true
        });
      } else {
        // if profile for authenticated user does NOT exists
        navigator.dismissAllModals();
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
        {this.state.loading && (
          <View style={styles.loadingSpinner}>
            <ActivityIndicator size={"large"} color="#8FB9A8" />
          </View>
        )}
        <LoginButton
          onLoginFinished={(error, result) => {
            this.loginWithFB(error, result);
          }}
        />
        <TouchableOpacity
          onPress={() => {
            this.loginAsGuest();
          }}
          style={{ marginTop: 20 }}
        >
          <Text>Login as a guest</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FEFAD4",
    alignItems: "center",
    justifyContent: "center"
  },
  loadingSpinner: {
    position: "absolute",
    zIndex: 2
  }
});

const mapStateToProps = (state: any) => ({
  authenticated: state.authReducer.authenticated
});

export default connect(mapStateToProps)(LoginModal);
