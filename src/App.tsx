import { Navigation } from "react-native-navigation";
import { persistStore } from "redux-persist";
import { store } from "./store";
import { registerViews } from "./views/navigation";

persistStore(store);
registerViews();

// start the app
Navigation.startSingleScreenApp({
  screen: {
    screen: "omok.HomeView",
    title: "Welcome"
  }
});
