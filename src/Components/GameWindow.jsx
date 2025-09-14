import "./gamewindow.css";
import viteLogo from "/vite.svg";
import { gameCollectionList } from "./GameCollections";
import { lazy, useContext, useEffect, useRef, useState } from "react";
import gameData from "../utitlities";
import ResizeObserver from "resize-observer-polyfill";
import { GameListContext } from "./GameContext";

// Enum-like event states
const GameEventType = {
  MouseDown: "MOUSE_DOWN",
  MouseUp: "MOUSE_UP",
  MouseMove: "MOUSE_MOVE",
  KeyDown: "KEY_DOWN",
  KeyUp: "KEY_UP",
};

const SpinnerWindow = ({ message }) => {
  return (
    <div className="spinner-container">
      <div className="spinner-child"></div>
      <div className="spinner-message">{message}</div>
    </div>
  );
};

export default () => {
  const dimRef = useRef({ width: 300, height: 300 });
  const windowRef = useRef(null);
  const { gameIndex, setGameIndex } = useContext(GameListContext);
  const [CurrentGame, setCurrentGame] = useState(null);

  const [gameLoading, setGameLoading] = useState(true);
  const [gameName, setGameName] = useState("...");

  // Setup resize observer
  useEffect(() => {
    if (windowRef.current) {
      const observer = new ResizeObserver((entries) => {
        const entry = entries[0];
        dimRef.current = {
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        };
      });

      observer.observe(windowRef.current);
      return () => {
        observer.disconnect();
      };
    }
  }, []);

  // Game collection object
  const gameCollections = useRef({
    state: 1,
    dimensions: dimRef,
    onrender: () => {},
    eventHandler: (type, event) => {
      console.log("Unhandled event:", type, event);
    },
  });

  // Centralized event listeners
  useEffect(() => {
    const handleMouseDown = (e) =>
      gameCollections.current.eventHandler(GameEventType.MouseDown, e);
    const handleMouseUp = (e) =>
      gameCollections.current.eventHandler(GameEventType.MouseUp, e);
    const handleMouseMove = (e) =>
      gameCollections.current.eventHandler(GameEventType.MouseMove, e);
    const handleKeyDown = (e) =>
      gameCollections.current.eventHandler(GameEventType.KeyDown, e);
    const handleKeyUp = (e) =>
      gameCollections.current.eventHandler(GameEventType.KeyUp, e);

    const node = windowRef.current;

    if (node) {
      node.addEventListener("mousedown", handleMouseDown);
      node.addEventListener("mouseup", handleMouseUp);
      node.addEventListener("mousemove", handleMouseMove);
    }
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      if (node) {
        node.removeEventListener("mousedown", handleMouseDown);
        node.removeEventListener("mouseup", handleMouseUp);
        node.removeEventListener("mousemove", handleMouseMove);
      }
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Render loop
  useEffect(() => {
    const interval = setInterval(() => {
      gameCollections.current.onrender();
    }, 1000 / 60);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setCurrentGame(lazy(() => import(gameCollectionList[gameIndex].component)));
    setGameLoading(true);
    setGameName(gameCollectionList[gameIndex].name);
    setTimeout(() => setGameLoading(false), 1000);
  }, [gameIndex]);

  return (
    <div className="main-content" ref={windowRef} tabIndex={0}>
      {gameLoading ? (
        <SpinnerWindow message={`loading ${gameName.substring(0, 5)}...`} />
      ) : (
        <CurrentGame gameCollections={gameCollections.current} />
      )}
    </div>
  );
};
