import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import CustomInput from "../../components/CustomInput";
import TouchableDebounce from "../../components/TouchableDebounce";
import Backend from "../../lib/backend";
import { updateProfile } from "../../store/profile";

interface Props {
  navigator: any;
  updateProfile: (profile: any) => void;
}

interface State {
  username: string;
  loading: boolean;
  invalid: boolean;
  errorMsg: string;
}

class CreateProfileModal extends React.Component<Props, State> {
  static navigatorStyle = {
    navBarHidden: true
  };

  constructor() {
    super(undefined);
    this.state = {
      username: "",
      loading: false,
      invalid: true,
      errorMsg: ""
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
        screen: "omok.GameListView",
        title: "PLAY ONLINE",
        animated: true
      });
    }
  }

  checkValidUsername(username: string) {
    if (username.length < 3) {
      this.setState({
        invalid: true,
        errorMsg: "Your username must have at least 3 characters."
      });
    } else {
      let code: number;
      for (let i = 0; i < username.length; i++) {
        code = username.charCodeAt(i);
        if (
          !(code > 47 && code < 58) && // numeric (0-9)
          !(code > 64 && code < 91) && // upper alpha (A-Z)
          !(code > 96 && code < 123) // lower alpha (a-z)
        ) {
          this.setState({
            invalid: true,
            errorMsg: "Your username must contain only letters and numbers"
          });
          return;
        }
      }
      this.setState({
        invalid: false,
        errorMsg: ""
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
            this.checkValidUsername(username);
            this.setState({ username });
          }}
          value={this.state.username}
          placeholder={"Choose your username (max. 10 characters)"}
        />
        {this.state.errorMsg.length !== 0 && (
          <Text style={styles.errorMsg}>{this.state.errorMsg}</Text>
        )}
        <TouchableDebounce
          onPress={() => {
            this.createProfile();
          }}
          disabled={this.state.invalid}
          style={[styles.button, this.state.invalid && styles.disabled]}
        >
          <Text style={styles.buttonLabel}>SUBMIT</Text>
        </TouchableDebounce>
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
  errorMsg: {
    color: "red",
    paddingHorizontal: 10,
    width: 320
  },
  button: {
    margin: 10,
    height: 50,
    width: 200,
    borderRadius: 5,
    backgroundColor: "#FCD0BA",
    justifyContent: "center"
  },
  disabled: {
    opacity: 0.2
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
