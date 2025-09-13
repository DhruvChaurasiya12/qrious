import { useState } from "react";
import GameContextProvider from "./Components/GameContext";
import SidePane from "./Components/SidePane";
import GameWindow from "./Components/GameWindow";
import StatusPane from "./Components/StatusPane";
import "./App.css";

function App() {
  const [currentGameId, setCurrentGameId] = useState(0);

  return (
    <GameContextProvider>
      <div className="window-container flex">
        <SidePane />
        <GameWindow gameIndex={currentGameId} />
        <StatusPane
          currentGameId={currentGameId}
          setGameState={setCurrentGameId}
        />
      </div>
    </GameContextProvider>
  );
}

export default App;
