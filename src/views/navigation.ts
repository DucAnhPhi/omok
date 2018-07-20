import { Navigation } from "react-native-navigation";
import { Provider } from "react-redux";
import { store } from "../store";
import CreateProfileModal from "./CreateProfileModal";
import GameView from "./GameView";
import HomeView from "./HomeView";
import LoginModal from "./LoginModal";

export function registerViews() {
  Navigation.registerComponent(
    "omok.HomeView",
    () => HomeView,
    store,
    Provider
  );
  Navigation.registerComponent(
    "omok.GameView",
    () => GameView,
    store,
    Provider
  );
  Navigation.registerComponent(
    "omok.CreateProfileModal",
    () => CreateProfileModal,
    store,
    Provider
  );
  Navigation.registerComponent(
    "omok.LoginModal",
    () => LoginModal,
    store,
    Provider
  );
}
