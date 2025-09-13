import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import GameWindow from "./Components/GameWindow";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="window-container">
        <div className="side-pane"></div>
        <GameWindow />
        <div className="secondary-pane"></div>
      </div>
    </>
  );
}

export default App;
