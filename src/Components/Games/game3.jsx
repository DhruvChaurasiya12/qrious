import { useEffect, useRef, useState } from "react";

const GameEventType = {
  MouseDown: "MOUSE_DOWN",
  MouseUp: "MOUSE_UP",
  MouseMove: "MOUSE_MOVE",
};

export default function GameReflection({ gameCollections }) {
  const dimRef = gameCollections.dimensions;
  const [mirrors, setMirrors] = useState([
    { x1: 200, y1: 200, x2: 300, y2: 250, dragging: false },
  ]);

  const target = useRef({ x: 400, y: 150 });
  const draggingMirror = useRef(null);
  const dragOffset = useRef({ dx: 0, dy: 0 });

  // --- Event handling for dragging entire mirrors ---
  useEffect(() => {
    gameCollections.eventHandler = (type, e) => {
      const rect = e.target.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      switch (type) {
        case GameEventType.MouseDown:
          mirrors.forEach((m, idx) => {
            const midx = (m.x1 + m.x2) / 2;
            const midy = (m.y1 + m.y2) / 2;
            if (Math.hypot(mx - midx, my - midy) < 20) {
              draggingMirror.current = idx;
              dragOffset.current = { dx: mx - midx, dy: my - midy };
              mirrors[idx].dragging = true;
            }
          });
          break;

        case GameEventType.MouseUp:
          if (draggingMirror.current !== null) {
            mirrors[draggingMirror.current].dragging = false;
            draggingMirror.current = null;
          }
          break;

        case GameEventType.MouseMove:
          if (draggingMirror.current !== null) {
            const idx = draggingMirror.current;
            const m = mirrors[idx];
            const midx = (m.x1 + m.x2) / 2;
            const midy = (m.y1 + m.y2) / 2;
            const dx = mx - midx - dragOffset.current.dx;
            const dy = my - midy - dragOffset.current.dy;

            mirrors[idx] = {
              ...m,
              x1: m.x1 + dx,
              y1: m.y1 + dy,
              x2: m.x2 + dx,
              y2: m.y2 + dy,
            };
            setMirrors([...mirrors]);
          }
          break;
      }
    };
  }, [mirrors, gameCollections]);

  // --- Helper: line intersection ---
  const intersectRaySegment = (ray, m) => {
    const { x, y, dx, dy } = ray;
    const x3 = m.x1,
      y3 = m.y1,
      x4 = m.x2,
      y4 = m.y2;

    const denom = dx * (y3 - y4) - dy * (x3 - x4);
    if (denom === 0) return null; // parallel

    const t = ((x3 - x) * (y3 - y4) - (y3 - y) * (x3 - x4)) / denom;
    const u = ((x3 - x) * dy - (y3 - y) * dx) / denom;

    if (t > 0 && u >= 0 && u <= 1) {
      return { ix: x + t * dx, iy: y + t * dy, dist: t };
    }
    return null;
  };

  // --- Helper: reflection vector ---
  const reflect = (dx, dy, m) => {
    const mx = m.x2 - m.x1;
    const my = m.y2 - m.y1;
    const len = Math.hypot(mx, my);
    const nx = -my / len;
    const ny = mx / len;

    const dot = dx * nx + dy * ny;
    return { dx: dx - 2 * dot * nx, dy: dy - 2 * dot * ny };
  };

  // --- Renderer ---
  const renderer = () => {
    console.log("Rendering Reflection Game");
  };

  if (gameCollections.onrender !== renderer) {
    gameCollections.onrender = renderer;
  }

  return <canvas id="reflectionCanvas"></canvas>;
}
