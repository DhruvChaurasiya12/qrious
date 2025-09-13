import { use, useContext } from "react";

export const GameContext = useContext();

const GameContextProvider = ({ children }) => {
  const [title, setTitle] = useState("no title");
  const [videoUrls, setVideoUrls] = useState([]);
  const [theory, setTheory] = useState([]);
  const [references, setReferences] = useState([]);
  const [hints, setHints] = useState([]);

  return;
  <GameContext.Provider
    value={
      (title,
      setTitle,
      videoUrls,
      setVideoUrls,
      theory,
      setTheory,
      references,
      setReferences,
      hints,
      setHints)
    }
  >
    {children}
  </GameContext.Provider>;
};

export default GameContextProvider;
