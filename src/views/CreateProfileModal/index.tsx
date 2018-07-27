import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
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
  loading: boolean;
}

class CreateProfileModal extends React.Component<Props, State> {
  static navigatorStyle = {
    navBarHidden: true
  };

  constructor() {
    super(undefined);
    this.state = {
      username: "",
      loading: false
    };
  }

  async createProfile() {
    this.setState({ loading: true });
    const newProfile = await Backend.createProfile(this.state.username);
    this.setState({ loading: false });
    if (newProfile) {
      this.props.updateProfile(newProfile);
      this.props.navigator.dismissAllModals();
      this.props.navigator.push({
        screen: "omok.OnlineGameView",
        animated: true,
        title: "ONLINE"
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.loading && (
          <View style={styles.loadingSpinner}>
            <ActivityIndicator size={"large"} color={"#8FB9A8"} />
          </View>
        )}
        <CustomInput
          onChangeText={(username: string) => {
            this.setState({ username });
          }}
          value={this.state.username}
          placeholder={"Choose your username (max. 10 characters)"}
        />
        <TouchableOpacity
          onPress={() => {
            this.createProfile();
          }}
          style={styles.button}
        >
          <Text style={styles.buttonLabel}>SUBMIT</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FEFAD4",
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    margin: 10,
    height: 50,
    width: 200,
    borderRadius: 5,
    backgroundColor: "#FCD0BA",
    justifyContent: "center"
  },
  buttonLabel: {
    color: "black",
    fontWeight: "600",
    fontSize: 20,
    textAlign: "center"
  },
  loadingSpinner: {
    position: "absolute",
    zIndex: 2
  }
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators({ updateProfile }, dispatch);

export default connect(
  undefined,
  mapDispatchToProps
)(CreateProfileModal);
