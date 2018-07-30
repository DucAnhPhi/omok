import { Navigation } from "react-native-navigation";
import { Provider } from "react-redux";
import { store } from "../store";
import CreateProfileModal from "./CreateProfileModal";
import GameListView from "./GameListView";
import HomeView from "./HomeView";
import LoginModal from "./LoginModal";
import OfflineGameView from "./OfflineGameView";
import OnlineGameView from "./OnlineGameView";

export function registerViews() {
  Navigation.registerComponent(
    "omok.HomeView",
    () => HomeView,
    store,
    Provider
  );
  Navigation.registerComponent(
    "omok.GameListView",
    () => GameListView,
    store,
    Provider
  );
  Navigation.registerComponent(
    "omok.OnlineGameView",
    () => OnlineGameView,
    store,
    Provider
  );
  Navigation.registerComponent(
    "omok.OfflineGameView",
    () => OfflineGameView,
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
