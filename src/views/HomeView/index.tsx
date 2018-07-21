import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Backend from "../../lib/backend";
import Logger from "../../lib/logger";
import { IProfile } from "../../models";
import { clearProfile } from "../../store/profile";

interface Props {
  navigator: any;
  profile: IProfile;
  authenticated: boolean;
  clearProfile: () => void;
}

class HomeView extends React.Component<Props> {
  static navigationOptions = {
    header: null
  };

  async routingAction() {
    const { navigator, profile, authenticated } = this.props;
    if (authenticated) {
      // if user is authenticated...
      if (profile) {
        // if profile was persisted in redux
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

const mapStateToProps = (state: any) => ({
  profile: state.profileReducer.profile,
  authenticated: state.authReducer.authenticated
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators({ clearProfile }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeView);
