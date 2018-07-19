import { Navigation } from "react-native-navigation";
import { Provider } from "react-redux";
import { store } from "../store";
import GameView from "./GameView";
import HomeView from "./HomeView";

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
}
