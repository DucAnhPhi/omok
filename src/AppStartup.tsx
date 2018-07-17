import React from "react";
import firebase from "react-native-firebase";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { loginSuccess } from "./store/auth";

interface Props {
  children: any;
  loginSuccess: () => void;
}

class AppStartup extends React.Component<Props> {
  componentDidMount() {
    firebase
      .auth()
      .signInAnonymouslyAndRetrieveData()
      .then(() => {
        console.log(firebase.auth().currentUser);
        this.props.loginSuccess();
      });
  }

  render() {
    return this.props.children;
  }
}

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators({ loginSuccess }, dispatch);

export default connect(
  undefined,
  mapDispatchToProps
)(AppStartup);
