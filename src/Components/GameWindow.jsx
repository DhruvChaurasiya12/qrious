import "./gamewindow.css";
import viteLogo from "/vite.svg";
import Game1 from "./Games/game1";
import Game2 from "./Games/game2";
import Game4 from "./Games/game4"
import { useEffect, useRef, useState } from "react";
import gameData from "../utitlities";
import ResizeObserver from "resize-observer-polyfill";

// Enum-like event states
const GameEventType = {
  MouseDown: "MOUSE_DOWN",
  MouseUp: "MOUSE_UP",
  MouseMove: "MOUSE_MOVE",
  KeyDown: "KEY_DOWN",
  KeyUp: "KEY_UP",
};

export default () => {
  const dimRef = useRef({ width: 300, height: 300 });
  const windowRef = useRef(null);

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
  const gameCollections = {
    state: 1,
    dimensions: dimRef,
    onrender: () => {},
    eventHandler: (type, event) => {
      console.log("Unhandled event:", type, event);
    },
  };

  // Centralized event listeners
  useEffect(() => {
    const handleMouseDown = (e) =>
      gameCollections.eventHandler(GameEventType.MouseDown, e);
    const handleMouseUp = (e) =>
      gameCollections.eventHandler(GameEventType.MouseUp, e);
    const handleMouseMove = (e) =>
      gameCollections.eventHandler(GameEventType.MouseMove, e);
    const handleKeyDown = (e) =>
      gameCollections.eventHandler(GameEventType.KeyDown, e);
    const handleKeyUp = (e) =>
      gameCollections.eventHandler(GameEventType.KeyUp, e);

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
      console.log("Rendering game frame");
      gameCollections.onrender();
    }, 1000 / 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="main-content" ref={windowRef} tabIndex={0}>
      <Game2 gameCollections={gameCollections} />
    </div>
  );
};
