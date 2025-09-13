import React, { useEffect } from "react";
import { gameCollectionList } from "./GameCollections";
import "./statuspane.css"; // optional styling
import { GameListContext } from "./GameContext";
import { useContext } from "react";

export default function StatusPane() {
  const { gameIndex, setGameIndex } = useContext(GameListContext);
  useEffect(() => {
    console.log("current game ", gameCollectionList[gameIndex]);
  }, [gameIndex]);
  return (
    <div className="statuspane">
      <h2 className="statuspane-header">Games</h2>
      <ul className="statuspane-list">
        {gameCollectionList.map((game, idx) => (
          <li
            key={game.id}
            className={`statuspane-item ${idx === gameIndex ? "active" : ""}`}
            onClick={() => setGameIndex(idx)}
          >
            {game.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
