import { useEffect, useRef } from "react";

const GameEventType = {
  KeyDown: "KEY_DOWN",
};

export default function GameSnake({ gameCollections }) {
  const dimRef = gameCollections.dimensions;

  // Snake state
  const snakeRef = useRef([
    { x: 5, y: 5 }, // initial position
  ]);
  const dirRef = useRef({ x: 1, y: 0 }); // moving right
  const foodRef = useRef({ x: 10, y: 10 });
  const gridSize = 20; // cell size

  // Update direction from keypress
  useEffect(() => {
    gameCollections.eventHandler = (type, e) => {
      if (type === GameEventType.KeyDown) {
        switch (e.key) {
          case "ArrowUp":
            if (dirRef.current.y === 0) dirRef.current = { x: 0, y: -1 };
            break;
          case "ArrowDown":
            if (dirRef.current.y === 0) dirRef.current = { x: 0, y: 1 };
            break;
          case "ArrowLeft":
            if (dirRef.current.x === 0) dirRef.current = { x: -1, y: 0 };
            break;
          case "ArrowRight":
            if (dirRef.current.x === 0) dirRef.current = { x: 1, y: 0 };
            break;
        }
      }
    };
  }, [gameCollections]);

  // Snake render loop
  const renderer = () => {
    const canvas = document.getElementById("snakeCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const width = dimRef.current.width;
    const height = dimRef.current.height;

    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(0, 0, width, height);

    // Move snake
    const snake = [...snakeRef.current];
    const head = {
      x: snake[0].x + dirRef.current.x,
      y: snake[0].y + dirRef.current.y,
    };

    // Wrap around edges
    head.x =
      (head.x + Math.floor(width / gridSize)) % Math.floor(width / gridSize);
    head.y =
      (head.y + Math.floor(height / gridSize)) % Math.floor(height / gridSize);

    snake.unshift(head);

    // Check if snake eats food
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      // Place new food
      foodRef.current = {
        x: Math.floor(Math.random() * (width / gridSize)),
        y: Math.floor(Math.random() * (height / gridSize)),
      };
    } else {
      snake.pop(); // move forward
    }

    snakeRef.current = snake;

    // Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(
      foodRef.current.x * gridSize,
      foodRef.current.y * gridSize,
      gridSize,
      gridSize
    );

    // Draw snake
    ctx.fillStyle = "darkblue";
    snake.forEach((seg) => {
      ctx.fillRect(seg.x * gridSize, seg.y * gridSize, gridSize, gridSize);
    });
  };

  // Attach renderer
  if (gameCollections.onrender !== renderer) {
    gameCollections.onrender = renderer;
  }

  return <canvas id="snakeCanvas"></canvas>;
}
