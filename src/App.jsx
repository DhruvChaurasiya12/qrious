import { useState } from "react";
import GameWindow from "./Components/GameWindow";
import SidePane from "./Components/SidePane";
import GameContextProvider from "./Components/GameContext";
import "./App.css";

function App() {
  const [title, setTitle] = useState("Learn Optics with Games");
  const [videoUrls, setVideoUrls] = useState([
    "https://www.youtube.com/embed/bhhMJSKNCQY?si=28a8WyMHAWQQPDGj",
  ]);
  const [hints, setHints] = useState([
    "Place the first mirror near the wall to redirect the ray.",
    "Keep mirrors vertical for simpler control.",
    "Think about the angle of incidence = angle of reflection.",
  ]);
  const [theory, setTheory] = useState([
    "Light reflects symmetrically when it hits a flat surface.",
    "The incident ray, reflected ray, and normal all lie on the same plane.",
    "Multiple reflections can be used to guide light to a target.",
  ]);

  const [references, setReferences] = useState([
    {
      title: "Reflection Physics",
      link: "https://en.wikipedia.org/wiki/Reflection_(physics)",
    },
    {
      title: "Light & Optics (Khan Academy)",
      link: "https://www.khanacademy.org/science/physics/light-waves",
    },
  ]);

  return (
    <>
      <div className="window-container flex">
        <GameContextProvider>
          <SidePane />
          <GameWindow />
          <div className="secondary-pane"></div>
        </GameContextProvider>
      </div>
    </>
  );
}

export default App;
