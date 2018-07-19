import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import firebase from "react-native-firebase";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { loginSuccess } from "../../store/auth";

interface Props {
  navigator: any;
  loginSuccess: () => void;
}

class HomeView extends React.Component<Props> {
  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    firebase
      .auth()
      .signInAnonymouslyAndRetrieveData()
      .then(() => {
        this.props.loginSuccess();
      });
  }

  render() {
    return (
      <View>
        <Text>Home</Text>
        <TouchableOpacity
          onPress={() =>
            this.props.navigator.push({
              screen: "omok.GameView",
              title: "ONLINE",
              animated: true
            })
          }
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
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators({ loginSuccess }, dispatch);

export default connect(
  undefined,
  mapDispatchToProps
)(HomeView);
