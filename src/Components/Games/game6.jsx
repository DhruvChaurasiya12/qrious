import React, { useEffect, useState, useRef } from 'react';

const FractionQuizGame = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [gameState, setGameState] = useState({
    currentQuestion: 0,
    score: 0,
    selectedPieces: new Set(),
    showFeedback: false,
    feedbackMessage: '',
    isCorrect: false,
    gameOver: false
  });

  // Questions data
  const questions = [
    {
      fraction: { numerator: 1, denominator: 4 },
      layout: {
        pieces: [
          { id: 0, x: 0, y: 0, width: 0.5, height: 0.5 },
          { id: 1, x: 0.5, y: 0, width: 0.5, height: 0.5 },
          { id: 2, x: 0, y: 0.5, width: 1, height: 0.25 },
          { id: 3, x: 0, y: 0.75, width: 1, height: 0.25 }
        ]
      }
    },
    {
      fraction: { numerator: 3, denominator: 8 },
      layout: {
        pieces: [
          { id: 0, x: 0, y: 0, width: 0.25, height: 0.5 },
          { id: 1, x: 0.25, y: 0, width: 0.25, height: 0.5 },
          { id: 2, x: 0.5, y: 0, width: 0.25, height: 0.5 },
          { id: 3, x: 0.75, y: 0, width: 0.25, height: 0.5 },
          { id: 4, x: 0, y: 0.5, width: 0.5, height: 0.5 },
          { id: 5, x: 0.5, y: 0.5, width: 0.25, height: 0.25 },
          { id: 6, x: 0.75, y: 0.5, width: 0.25, height: 0.25 },
          { id: 7, x: 0.5, y: 0.75, width: 0.5, height: 0.25 }
        ]
      }
    },
    {
      fraction: { numerator: 2, denominator: 6 },
      layout: {
        pieces: [
          { id: 0, x: 0, y: 0, width: 1, height: 0.33 },
          { id: 1, x: 0, y: 0.33, width: 0.5, height: 0.33 },
          { id: 2, x: 0.5, y: 0.33, width: 0.5, height: 0.33 },
          { id: 3, x: 0, y: 0.66, width: 0.33, height: 0.34 },
          { id: 4, x: 0.33, y: 0.66, width: 0.33, height: 0.34 },
          { id: 5, x: 0.66, y: 0.66, width: 0.34, height: 0.34 }
        ]
      }
    }
  ];

  const currentQ = questions[gameState.currentQuestion];
  const targetFraction = currentQ.fraction;

  // Draw function
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas || !currentQ) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const rectSize = Math.min(width * 0.6, height * 0.6);
    const rectX = (width - rectSize) / 2;
    const rectY = (height - rectSize) / 2;

    // Draw all pieces
    currentQ.layout.pieces.forEach(piece => {
      const pieceX = rectX + piece.x * rectSize;
      const pieceY = rectY + piece.y * rectSize;
      const pieceWidth = piece.width * rectSize;
      const pieceHeight = piece.height * rectSize;

      ctx.fillStyle = gameState.selectedPieces.has(piece.id) ? '#4CAF50' : '#ffffff';
      ctx.fillRect(pieceX, pieceY, pieceWidth, pieceHeight);
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.strokeRect(pieceX, pieceY, pieceWidth, pieceHeight);
    });
  };

  // Resize canvas
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (canvas && container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      draw();
    }
  };

  useEffect(() => {
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  useEffect(() => {
    draw();
  }, [gameState]);

  // Handle clicks with proper coordinate mapping
  const handleCanvasClick = (e) => {
    if (!currentQ || gameState.showFeedback || gameState.gameOver) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = canvas.width;
    const height = canvas.height;

    const scaleX = width / rect.width;
    const scaleY = height / rect.height;
    const canvasX = x * scaleX;
    const canvasY = y * scaleY;

    const rectSize = Math.min(width * 0.6, height * 0.6);
    const rectX = (width - rectSize) / 2;
    const rectY = (height - rectSize) / 2;

    currentQ.layout.pieces.forEach(piece => {
      const pieceX = rectX + piece.x * rectSize;
      const pieceY = rectY + piece.y * rectSize;
      const pieceWidth = piece.width * rectSize;
      const pieceHeight = piece.height * rectSize;

      if (canvasX >= pieceX && canvasX <= pieceX + pieceWidth &&
          canvasY >= pieceY && canvasY <= pieceY + pieceHeight) {
        setGameState(prev => {
          const newSelected = new Set(prev.selectedPieces);
          if (newSelected.has(piece.id)) {
            newSelected.delete(piece.id);
          } else {
            newSelected.add(piece.id);
          }
          return { ...prev, selectedPieces: newSelected };
        });
      }
    });
  };

  // Submit answer
  const submitAnswer = () => {
    if (gameState.selectedPieces.size === 0 || gameState.showFeedback) return;
    const selectedCount = gameState.selectedPieces.size;
    const total = currentQ.layout.pieces.length;
    const selectedFraction = selectedCount / total;
    const targetValue = targetFraction.numerator / targetFraction.denominator;
    const isCorrect = Math.abs(selectedFraction - targetValue) < 0.001;
    const message = isCorrect ? 'Correct! Well done!' :
      `Incorrect. You selected ${selectedCount}/${total}, needed ${targetFraction.numerator}/${targetFraction.denominator}`;
    setGameState(prev => ({
      ...prev,
      showFeedback: true,
      isCorrect,
      feedbackMessage: message,
      score: prev.score + (isCorrect ? 1 : 0)
    }));
    setTimeout(() => {
      if (gameState.currentQuestion + 1 >= questions.length) {
        setGameState(prev => ({ ...prev, gameOver: true }));
      } else {
        setGameState(prev => ({
          ...prev,
          currentQuestion: prev.currentQuestion + 1,
          selectedPieces: new Set(),
          showFeedback: false,
          feedbackMessage: '',
          isCorrect: false
        }));
      }
    }, 2000);
  };

  // Restart game
  const restartGame = () => {
    setGameState({
      currentQuestion: 0,
      score: 0,
      selectedPieces: new Set(),
      showFeedback: false,
      feedbackMessage: '',
      isCorrect: false,
      gameOver: false
    });
  };

  return (
    <div ref={containerRef} style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <h2 style={{ textAlign: 'center', marginTop: '1rem' }}>
        Select {targetFraction.numerator}/{targetFraction.denominator}
      </h2>
      <div style={{ position: 'relative', width: '100%', height: '70%' }}>
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%', border: '2px solid #333' }}
          onClick={handleCanvasClick}
        />
        {gameState.showFeedback && (
          <div style={{
            position: 'absolute',
            bottom: '10%',
            width: '100%',
            textAlign: 'center',
            fontSize: '1.2rem',
            color: gameState.isCorrect ? '#4CAF50' : '#f44336'
          }}>
            {gameState.feedbackMessage}
          </div>
        )}
      </div>
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        {!gameState.gameOver ? (
          <>
            <p>Score: {gameState.score}</p>
            <p>Question {gameState.currentQuestion + 1}/{questions.length}</p>
            <button
              onClick={submitAnswer}
              disabled={gameState.selectedPieces.size === 0 || gameState.showFeedback}
              style={{
                padding: '0.5rem 1.5rem',
                fontSize: '1rem',
                backgroundColor: gameState.selectedPieces.size > 0 ? '#2196F3' : '#ccc',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: gameState.selectedPieces.size > 0 ? 'pointer' : 'not-allowed'
              }}
            >
              Submit
            </button>
          </>
        ) : (
          <>
            <h2>Game Complete!</h2>
            <p>Final Score: {gameState.score}/{questions.length}</p>
            <button
              onClick={restartGame}
              style={{
                padding: '0.5rem 1.5rem',
                fontSize: '1rem',
                backgroundColor: '#4CAF50',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Play Again
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default FractionQuizGame;
