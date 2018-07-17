import { Navigation } from "react-native-navigation";
import { registerViews } from "./views";

registerViews();

// start the app
Navigation.startSingleScreenApp({
  screen: {
    screen: "omok.HomeView",
    title: "Welcome"
  }
});
