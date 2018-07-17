import { Navigation } from "react-native-navigation";
import GameView from "./views/GameView";
import HomeView from "./views/HomeView";

export function initAppNav() {
  registerViews();
  // event is called once app is launched
  Navigation.events().registerAppLaunchedListener(() => {
    // set app navigation layout
    Navigation.setRoot({
      root: {
        stack: {
          children: [
            {
              component: {
                name: "omok.HomeView"
              }
            },
            {
              component: {
                name: "omok.GameView"
              }
            }
          ]
        }
      }
    });
  });
}

function registerViews() {
  Navigation.registerComponent("omok.GameView", () => GameView);
  Navigation.registerComponent("omok.HomeView", () => HomeView);
}
