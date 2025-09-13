import { useEffect, useRef } from "react";

const GameEventType = {
  KeyDown: "KEY_DOWN",
};

export default function GameSnake({ gameCollections }) {
  const dimRef = gameCollections.dimensions; // Snake state
  gameCollections.setTitle("Snake Game");
  gameCollections.setUrls([
    "https://www.youtube.com/embed/3Xc3CA655Y4?si=U1eXz9kYbG5m1m8R",
  ]);
  gameCollections.setTheory([
    "The snake moves in a grid and grows longer when it eats food.",
    "Use arrow keys to change the snake's direction.",
    "The game ends if the snake runs into itself.",
  ]);
  gameCollections.setReference([
    {
      title: "Snake Game - Wikipedia",
      link: "https://en.wikipedia.org/wiki/Snake_(video_game_genre)",
    },
    {
      title: "How to Play Snake",
      link: "https://www.wikihow.com/Play-Snake",
    },
  ]);

  gameCollections.setHints([
    "Use the arrow keys to control the snake's direction.",
    "Try to eat the food (red square) to grow longer.",
    "Avoid running into yourself!",
  ]);

  const snakeRef = useRef([
    { x: 5, y: 5 }, // initial position
  ]);
  const dirRef = useRef({ x: 1, y: 0 }); // moving right
  const foodRef = useRef({ x: 10, y: 10 });
  const gridSize = 20; // cell size // Update direction from keypress

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
  }, [gameCollections]); // Snake render loop
  const speed = 10;
  let iterator = 0;
  const renderer = () => {
    const canvas = document.getElementById("snakeCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const width = dimRef.current.width;
    const height = dimRef.current.height;

    canvas.width = width;
    canvas.height = height; // Background color from the theme: --secondary-color

    ctx.fillStyle = "#16213e";
    ctx.fillRect(0, 0, width, height); // Move snake

    const snake = [...snakeRef.current];
    if (iterator % speed == 0) {
      iterator = 0;
      const head = {
        x: snake[0].x + dirRef.current.x,
        y: snake[0].y + dirRef.current.y,
      }; // Wrap around edges

      head.x =
        (head.x + Math.floor(width / gridSize)) % Math.floor(width / gridSize);
      head.y =
        (head.y + Math.floor(height / gridSize)) %
        Math.floor(height / gridSize);

      snake.unshift(head); // Check if snake eats food

      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        // Place new food
        foodRef.current = {
          x: Math.floor(Math.random() * (width / gridSize)),
          y: Math.floor(Math.random() * (height / gridSize)),
        };
      } else {
        snake.pop(); // move forward
      }
    }
    iterator++;

    snakeRef.current = snake; // Draw food with a contrasting color

    ctx.fillStyle = "#e94560"; // --accent-color
    ctx.fillRect(
      foodRef.current.x * gridSize,
      foodRef.current.y * gridSize,
      gridSize,
      gridSize
    ); // Draw snake with a different color from the theme

    ctx.fillStyle = "#f0f0f0"; // --text-color
    snake.forEach((seg) => {
      ctx.fillRect(seg.x * gridSize, seg.y * gridSize, gridSize, gridSize);
    });
  }; // Attach renderer

  if (gameCollections.onrender !== renderer) {
    gameCollections.onrender = renderer;
  }

  return <canvas id="snakeCanvas"></canvas>;
}
