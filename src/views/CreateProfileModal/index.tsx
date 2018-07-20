import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import firebase from "react-native-firebase";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import CustomInput from "../../components/CustomInput";
import Backend from "../../lib/backend";
import { updateProfile } from "../../store/profile";

interface Props {
  navigator: any;
  updateProfile: (profile: any) => void;
}

interface State {
  username: string;
}

class CreateProfileModal extends React.Component<Props, State> {
  static navigatorStyle = {
    navBarHidden: true
  };

  constructor() {
    super(undefined);
    this.state = {
      username: ""
    };
  }

  async createProfile() {
    const newProfile = await Backend.createProfile(this.state.username);
    if (newProfile) {
      this.props.updateProfile(newProfile);
      this.props.navigator.dismissAllModals();
      this.props.navigator.push({
        screen: "omok.GameView",
        animated: true,
        title: "ONLINE"
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Choose a username</Text>
        <CustomInput
          onChangeText={(username: string) => {
            this.setState({ username });
          }}
          value={this.state.username}
          placeholder={"Enter you username (max. 10 characters)"}
        />
        <TouchableOpacity
          onPress={() => {
            this.createProfile();
          }}
        >
          <Text>submit</Text>
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
  bindActionCreators({ updateProfile }, dispatch);

export default connect(
  undefined,
  mapDispatchToProps
)(CreateProfileModal);
