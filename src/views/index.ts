import { Navigation } from "react-native-navigation";
import GameView from "./GameView";
import HomeView from "./HomeView";

export function registerViews() {
  Navigation.registerComponent("omok.HomeView", () => HomeView);
  Navigation.registerComponent("omok.GameView", () => GameView);
}
