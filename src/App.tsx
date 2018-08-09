import firebase from "react-native-firebase";
import { Navigation } from "react-native-navigation";
import { persistStore } from "redux-persist";
import Backend from "./lib/backend";
import { store } from "./store";
import { registerViews } from "./views/navigation";

persistStore(store, undefined, () => {
  firebase.auth().onAuthStateChanged(async user => {
    if (user) {
      // User is signed in
      store.dispatch({ type: "USER_AUTHED" });
      if (store.getState().profileReducer.profile === null) {
        // if there was NO profile persisted
        // get current profile and update state
        const currentProfile = await Backend.getCurrentProfile();
        if (currentProfile && currentProfile.exists) {
          store.dispatch({
            type: "PROFILE_UPDATED",
            payload: { profile: currentProfile.data() }
          });
        }
      }
    } else {
      // User is signed out
      store.dispatch({ type: "USER_UNAUTHED" });
    }
  });
});
registerViews();

// start the app
Navigation.startSingleScreenApp({
  screen: {
    screen: "omok.HomeView",
    title: "Welcome"
  },
  animationType: "fade"
});
