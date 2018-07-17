import { createStackNavigator } from "react-navigation";
import GameView from "./GameView";
import HomeView from "./HomeView";

export const RootStack = createStackNavigator({
  HomeView: {
    screen: HomeView
  },
  GameView: {
    screen: GameView
  }
});
