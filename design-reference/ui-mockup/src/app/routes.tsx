import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import { 
  LobbyScreen, 
  BodySelectScreen, 
  EngravingScreen, 
  ExplorationScreen, 
  CombatScreen, 
  VictoryScreen, 
  ShopScreen, 
  DeathScreen 
} from "./screens";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: LobbyScreen },
      { path: "body-select", Component: BodySelectScreen },
      { path: "engraving", Component: EngravingScreen },
      { path: "explore", Component: ExplorationScreen },
      { path: "combat", Component: CombatScreen },
      { path: "victory", Component: VictoryScreen },
      { path: "shop", Component: ShopScreen },
      { path: "death", Component: DeathScreen },
    ],
  },
]);
