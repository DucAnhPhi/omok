import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Backend from "../../lib/backend";
import { loginSuccess } from "../../store/auth";

interface Props {
  navigator: any;
  loginSuccess: () => void;
}

class LoginModal extends React.Component<Props> {
  static navigatorStyle = {
    navBarHidden: true
  };

  async loginAsGuest() {
    const { navigator } = this.props;
    const currentUser = await Backend.loginAsGuest();
    if (currentUser) {
      this.props.loginSuccess();
      const currentProfile = await Backend.getCurrentProfile();
      if (currentProfile && currentProfile.exists) {
        // if profile for authenticated user exists
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

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators({ loginSuccess }, dispatch);

export default connect(
  undefined,
  mapDispatchToProps
)(LoginModal);
