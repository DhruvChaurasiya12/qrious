import React, { useEffect, useState, useRef, useContext } from 'react';
import { GameContext } from "./../GameContext";

const Game5 = ({ gameCollections }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [gameState, setGameState] = useState('playing'); // playing, finished
  const [animationState, setAnimationState] = useState('');
  const [timeLeft, setTimeLeft] = useState(15);
  const [isAnswered, setIsAnswered] = useState(false);
  
  const timerRef = useRef(null);
  
  // Sample quiz questions - you can replace with your own
  const questions = [
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correct: 2,
      difficulty: "easy"
    },
    {
      id: 2,
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correct: 1,
      difficulty: "easy"
    },
    {
      id: 3,
      question: "What is 15 × 8?",
      options: ["110", "120", "125", "130"],
      correct: 1,
      difficulty: "medium"
    },
    {
      id: 4,
      question: "Who painted the Mona Lisa?",
      options: ["Van Gogh", "Picasso", "Da Vinci", "Monet"],
      correct: 2,
      difficulty: "medium"
    },
    {
      id: 5,
      question: "What is the chemical symbol for gold?",
      options: ["Go", "Gd", "Au", "Ag"],
      correct: 2,
      difficulty: "hard"
    }
  ];

  const {
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
  } = useContext(GameContext);

  useEffect(() => {
    setTitle("Timed Quiz Game");
    setVideoUrls([
      "https://www.youtube.com/embed/3Xc3CA655Y4?si=U1eXz9kYbG5m1m8R",
    ]);
    setTheory([
      "Percent game is where you ",
      "Use arrow keys to change the snake's direction.",
      "The game ends if the snake runs into itself.",
    ]);
    setReferences([
      {
        title: "Percentage Game - Wikipedia",
        link: "https://en.wikipedia.org/wiki/Snake_(video_game_genre)",
      },
      {
        title: "How to Play Percent game",
        link: "https://www.wikihow.com/Play-Snake",
      },
    ]);

    setHints([
      "Use the arrow keys to control the snake's direction.",
      "Try to eat the food (red square) to grow longer.",
      "Avoid running into yourself!",
    ]);
  }, []);
  const dimRef = gameCollections.dimensions;

  // Timer logic
  useEffect(() => {
    if (gameState === 'playing' && !isAnswered) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentQuestion, gameState, isAnswered]);

  const handleTimeUp = () => {
    setIsAnswered(true);
    setSelectedAnswer(-1); // -1 indicates time up
    setAnimationState('timeout');
    
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const handleAnswerClick = (answerIndex) => {
    if (isAnswered) return;
    
    setIsAnswered(true);
    setSelectedAnswer(answerIndex);
    clearInterval(timerRef.current);
    
    const isCorrect = answerIndex === questions[currentQuestion].correct;
    
    if (isCorrect) {
      setScore(prev => prev + getScoreForQuestion());
      setAnimationState('correct');
    } else {
      setAnimationState('incorrect');
    }
    
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const getScoreForQuestion = () => {
    const difficulty = questions[currentQuestion].difficulty;
    const timeBonus = Math.max(0, timeLeft - 5);
    
    let baseScore = 10;
    if (difficulty === 'medium') baseScore = 15;
    if (difficulty === 'hard') baseScore = 20;
    
    return baseScore + timeBonus;
  };

  const nextQuestion = () => {
    setAnimationState('');
    setSelectedAnswer(null);
    setIsAnswered(false);
    setTimeLeft(15);
    
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setGameState('finished');
      setShowResult(true);
    }
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameState('playing');
    setAnimationState('');
    setTimeLeft(15);
    setIsAnswered(false);
  };

  // Handle game engine events
  useEffect(() => {
    gameCollections.eventHandler = (type, event) => {
      if (type === "KEY_DOWN") {
        // Allow number keys 1-4 to select answers
        const keyNum = parseInt(event.key);
        if (keyNum >= 1 && keyNum <= 4 && !isAnswered && gameState === 'playing') {
          handleAnswerClick(keyNum - 1);
        }
        
        // Space to restart when finished
        if (event.key === ' ' && gameState === 'finished') {
          resetGame();
        }
      }
    };
  }, [currentQuestion, isAnswered, gameState]);

  // Render function for the game engine
  useEffect(() => {
    gameCollections.onrender = () => {
      // Game rendering logic happens in React render
    };
  }, []);

  const getTimerColor = () => {
    if (timeLeft > 10) return '#4CAF50';
    if (timeLeft > 5) return '#FF9800';
    return '#f44336';
  };

  const getAnswerButtonClass = (index) => {
    let baseClass = 'answer-btn';
    
    if (isAnswered) {
      if (index === questions[currentQuestion].correct) {
        baseClass += ' correct-answer';
      } else if (index === selectedAnswer && selectedAnswer !== questions[currentQuestion].correct) {
        baseClass += ' incorrect-answer';
      } else {
        baseClass += ' disabled';
      }
    }
    
    return baseClass;
  };

  if (showResult) {
    return (
      <div className="quiz-container result-screen">
        <div className="result-card">
          <h1 className="result-title">🎉 Quiz Complete!</h1>
          <div className="score-display">
            <div className="final-score">{score}</div>
            <div className="score-label">Final Score</div>
          </div>
          <div className="stats">
            <div className="stat">
              <span className="stat-number">{questions.length}</span>
              <span className="stat-label">Questions</span>
            </div>
            <div className="stat">
              <span className="stat-number">{Math.round((score / (questions.length * 20)) * 100)}%</span>
              <span className="stat-label">Accuracy</span>
            </div>
          </div>
          <button className="play-again-btn" onClick={resetGame}>
            Play Again
          </button>
          <div className="hint">Press SPACEBAR to restart</div>
        </div>
        <style jsx>{`
          .quiz-container result-screen {
            width: 100%;
            height: 100vh;
            background: #808080; /* grey background */
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
            color: white;
            overflow-y: auto;
            padding: 20px;
            box-sizing: border-box;
          }

          .result-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px 30px;
            max-width: 400px;
            width: 100%;
            text-align: center;
          }
                
          .result-title {
            font-size: 32px;
            margin-bottom: 25px;
          }
                
          .score-display {
            margin-bottom: 30px;
          }
                
          .final-score {
            font-size: 48px;
            font-weight: bold;
            color: #4CAF50;
            margin-bottom: 5px;
          }
                
          .score-label {
            font-size: 16px;
            opacity: 0.8;
          }
                
          .stats {
            display: flex;
            justify-content: space-around;
            margin-bottom: 30px;
          }
                
          .stat {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
                
          .stat-number {
            font-size: 24px;
            font-weight: bold;
            color: #64B5F6;
          }
                
          .stat-label {
            font-size: 14px;
            opacity: 0.7;
          }
                
          .play-again-btn {
            background: linear-gradient(45deg, #4CAF50, #45a049);
            color: white;
            border: none;
            border-radius: 25px;
            padding: 12px 30px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
          }
                
          .play-again-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(76, 175, 80, 0.3);
          }
                
          .hint {
            font-size: 12px;
            opacity: 0.6;
          }
        `}</style>
      </div>
      
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="quiz-container">
      {/* Header */}
      <div className="quiz-header">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
        <div className="quiz-info">
          <span className="question-counter">{currentQuestion + 1} / {questions.length}</span>
          <span className="score">Score: {score}</span>
        </div>
      </div>

      {/* Timer */}
      <div className="timer-container">
        <div 
          className="timer-circle"
          style={{ 
            background: `conic-gradient(${getTimerColor()} ${(timeLeft / 15) * 360}deg, #ddd 0deg)`
          }}
        >
          <div className="timer-inner">
            <span className="timer-text">{timeLeft}</span>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className={`question-card ${animationState}`}>
        <div className="difficulty-badge difficulty-${question.difficulty}">
          {question.difficulty.toUpperCase()}
        </div>
        <h2 className="question-text">{question.question}</h2>
        
        {/* Options */}
        <div className="options-grid">
          {question.options.map((option, index) => (
            <button style={{background:"var(--light-gray)"}}
              key={index}
              className={getAnswerButtonClass(index)}
              onClick={() => handleAnswerClick(index)}
              disabled={isAnswered}
            >
              <span className="option-number">{index + 1}</span>
              <span className="option-text">{option}</span>
              {isAnswered && index === questions[currentQuestion].correct && (
                <span className="check-mark">✓</span>
              )}
              {isAnswered && index === selectedAnswer && selectedAnswer !== questions[currentQuestion].correct && (
                <span className="x-mark">✗</span>
              )}
            </button>
          ))}
        </div>
        
        <div className="keyboard-hint">
          Use keys 1-4 or click to answer
        </div>
      </div>

      <style jsx>{`
        .quiz-container {
          width: 100%;
          height: 100vh;
          background: "var(--primary-color)";
          display: flex;
          flex-direction: column;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: white;
          overflow-y: auto;
        }

        .quiz-header {
          margin-bottom: 30px;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 15px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #4CAF50, #8BC34A);
          transition: width 0.3s ease;
        }

        .quiz-info {
          display: flex;
          justify-content: space-between;
          font-size: 18px;
          font-weight: 600;
        }

        .timer-container {
          display: flex;
          justify-content: center;
          margin-bottom: 40px;
        }

        .timer-circle {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s ease;
        }

        .timer-inner {
          width: 80px;
          height: 80px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .timer-text {
          font-size: 24px;
          font-weight: bold;
          color: #333;
        }

        .question-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 30px;
          max-width: 800px;
          margin: 0 auto;
          transition: all 0.3s ease;
          position: relative;
        }

        .question-card.correct {
          animation: correctPulse 0.6s ease;
          background: rgba(76, 175, 80, 0.3);
        }

        .question-card.incorrect {
          animation: incorrectShake 0.6s ease;
          background: rgba(244, 67, 54, 0.3);
        }

        .question-card.timeout {
          background: rgba(255, 152, 0, 0.3);
        }

        @keyframes correctPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        @keyframes incorrectShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        .difficulty-badge {
          position: absolute;
          top: -10px;
          right: 20px;
          padding: 20px 15px;
          border-radius: 15px;
          font-size: 12px;
          font-weight: bold;
        }

        .difficulty-easy { background: #4CAF50; }
        .difficulty-medium { background: #FF9800; }
        .difficulty-hard { background: #f44336; }

        .question-text {
          font-size: 28px;
          margin-bottom: 40px;
          text-align: center;
          line-height: 1.4;
        }

        .options-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .answer-btn {
          background: rgba(255, 255, 255, 0.9);
          color: #333;
          border: none;
          border-radius: 15px;
          padding: 20px;
          font-size: 18px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 15px;
          position: relative;
          min-height: 70px;
        }

        .answer-btn:hover:not(.disabled) {
          background: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }

        .answer-btn.correct-answer {
          background: #4CAF50;
          color: white;
          transform: scale(1.02);
        }

        .answer-btn.incorrect-answer {
          background: #f44336;
          color: white;
        }

        .answer-btn.disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .option-number {
          background: #667eea;
          color: white;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          flex-shrink: 0;
        }

        .option-text {
          flex: 1;
          text-align: left;
        }

        .check-mark, .x-mark {
          font-size: 24px;
          font-weight: bold;
        }

        .keyboard-hint {
          text-align: center;
          opacity: 0.8;
          font-size: 14px;
        }

        .result-screen {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .result-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(15px);
          border-radius: 25px;
          padding: 50px;
          text-align: center;
          max-width: 500px;
          width: 100%;
        }

        .result-title {
          font-size: 36px;
          margin-bottom: 30px;
        }

        .score-display {
          margin-bottom: 40px;
        }

        .final-score {
          font-size: 64px;
          font-weight: bold;
          color: #4CAF50;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .score-label {
          font-size: 18px;
          opacity: 0.9;
        }

        .stats {
          display: flex;
          justify-content: space-around;
          margin-bottom: 40px;
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-number {
          font-size: 32px;
          font-weight: bold;
          color: #64B5F6;
        }

        .stat-label {
          font-size: 14px;
          opacity: 0.8;
        }

        .play-again-btn {
          background: linear-gradient(45deg, #4CAF50, #45a049);
          color: white;
          border: none;
          border-radius: 25px;
          padding: 15px 40px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 20px;
        }

        .play-again-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
        }

        .hint {
          font-size: 14px;
          opacity: 0.7;
        }

        @media (max-width: 768px) {
          .quiz-container {
            padding: 15px;
          }
          
          .options-grid {
            grid-template-columns: 1fr;
          }
          
          .question-text {
            font-size: 22px;
          }
          
          .answer-btn {
            font-size: 16px;
            padding: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default Game5;