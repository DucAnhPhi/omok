import React from "react";
import firebase from "react-native-firebase";
import { Provider } from "react-redux";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { persistStore } from "redux-persist";
import AppStartup from "./AppStartup";
import { store } from "./store";
import { RootStack } from "./views/navigation";

persistStore(store);

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppStartup>
          <RootStack />
        </AppStartup>
      </Provider>
    );
  }
}
