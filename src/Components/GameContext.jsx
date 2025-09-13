import { useState, createContext } from "react";

const GameContext = createContext(null);
const GameListContext = createContext(null);

const GameProvider = ({ children }) => {
  const [gameIndex, setGameIndex] = useState(0);
  const [title, setTitle] = useState("no title");
  const [videoUrls, setVideoUrls] = useState([]);
  const [theory, setTheory] = useState([]);
  const [references, setReferences] = useState([]);
  const [hints, setHints] = useState([]);

  return (
    <GameListContext.Provider value={{ gameIndex, setGameIndex }}>
      <GameContext.Provider
        value={{
          title,
          setTitle,
          videoUrls,
          setVideoUrls,
          theory,
          setTheory,
          references,
          setReferences,
          hints,
          setHints,
        }}
      >
        {children}
      </GameContext.Provider>
    </GameListContext.Provider>
  );
};

export { GameContext, GameListContext };
export default GameProvider;
