import React, { useEffect, useState, useRef, useContext } from 'react';
import { GameContext } from "./../GameContext";

const Game7 = ({ gameCollections }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [gameState, setGameState] = useState('playing'); // playing, finished
  const [animationState, setAnimationState] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);

  // Sample quiz questions with imageUrl added
  const questions = [
    {
      id: 1,
      question: "The scale shows the weight of the items. What's the weight of 1 square?",
      options: ["4", "8", "10", "16"],
      correct: 1,
      difficulty: "easy",
      imageUrl: "/game7/img1.png"
    },
    {
      id: 2,
      question: "What's the weight of one triangle?",
      options: ["2", "4", "6", "8"],
      correct: 1,
      difficulty: "easy",
      imageUrl: "/game7/img2.png"
    },
    {
      id: 3,
      question: "What's the weight of one square?",
      options: ["1", "3", "5", "7"],
      correct: 2,
      difficulty: "easy",
      imageUrl: "/game7/img3.png"
    },
    {
      id: 4,
      question: "What's the weight of 1 triangle?",
      options: ["10", "15", "20", "25"],
      correct: 3,
      difficulty: "medium",
      imageUrl: "/game7/img4.png"
    },
    {
      id: 5,
      question: "First, what's the weight of 1 square?",
      options: ["3", "5", "7", "9"],
      correct: 0,
      difficulty: "medium",
      imageUrl: "/game7/img5.png"
    },
    {
      id: 6,
      question: "Now can you find the weight of 1 circle?",
      options: ["3", "5", "7", "9"],
      correct: 2,
      difficulty: "hard",
      imageUrl: "/game7/img6.png"
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
    setTitle("Quiz Game with Images");
    setVideoUrls(["https://www.youtube.com/embed/3Xc3CA655Y4?si=U1eXz9kYbG5m1m8R"]);
    setTheory(["This quiz shows images with each question.", "Select the correct answer based on the image."]);
    setReferences([
      { title: "Quiz Game Reference", link: "https://example.com" }
    ]);
    setHints(["Look at the image carefully before answering!"]);
  }, []);

  const handleAnswerClick = (answerIndex) => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedAnswer(answerIndex);

    const isCorrect = answerIndex === questions[currentQuestion].correct;
    if (isCorrect) {
      setScore(prev => prev + 10);
      setAnimationState('correct');
    } else {
      setAnimationState('incorrect');
    }

    setTimeout(() => {
      nextQuestion();
    }, 1000);
  };

  const nextQuestion = () => {
    setAnimationState('');
    setSelectedAnswer(null);
    setIsAnswered(false);

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
    setIsAnswered(false);
  };

  useEffect(() => {
    gameCollections.eventHandler = (type, event) => {
      if (type === "KEY_DOWN") {
        const keyNum = parseInt(event.key);
        if (keyNum >= 1 && keyNum <= 4 && !isAnswered && gameState === 'playing') {
          handleAnswerClick(keyNum - 1);
        }
        if (event.key === ' ' && gameState === 'finished') {
          resetGame();
        }
      }
    };
  }, [currentQuestion, isAnswered, gameState]);

  useEffect(() => {
    gameCollections.onrender = () => {
      // Rendering handled by React
    };
  }, []);

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
          <button className="play-again-btn" onClick={resetGame}>Play Again</button>
          <div className="hint">Press SPACEBAR to restart</div>
        </div>
        <style jsx>{`
          .quiz-container {
            width: 100%;
            height: 100vh;
            background: "";
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
            color: white;
          }
          .result-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            text-align: center;
          }
          .result-card>div{
            padding: 20px;
          }
          .final-score{
            padding:10px;
            font-size:40px;
            // font-family:;
            text-color:yellow;
          }
          .play-again-btn {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 10px;
            cursor: pointer;
          }
          .play-again-btn:hover {
            background: #45a049;
          }
        `}</style>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <span>{currentQuestion + 1} / {questions.length}</span>
        <span>Score: {score}</span>
      </div>

      <div className={`question-card ${animationState}`}>
        <div className="difficulty-badge difficulty-{question.difficulty}">
          {question.difficulty.toUpperCase()}
        </div>
        <h2 className="question-text">{question.question}</h2>
        <img src={question.imageUrl} alt="question" className="question-image" />
        <div className="options-grid">
          {question.options.map((option, index) => (
            <button key={index}
              className={getAnswerButtonClass(index)}
              onClick={() => handleAnswerClick(index)}
              disabled={isAnswered}>
              <span>{index + 1}. </span>{option}
              {isAnswered && index === questions[currentQuestion].correct && <span>✓</span>}
              {isAnswered && index === selectedAnswer && selectedAnswer !== questions[currentQuestion].correct && <span>✗</span>}
            </button>
          ))}
        </div>
        <div className="keyboard-hint">Use keys 1-4 or click to answer</div>
      </div>

      <style jsx>{`
        .quiz-container {
          width: 100%;
          height: 100vh;
          background: "var(--primary-color)";
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          overflow-y: auto;
        }
        .quiz-header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .question-card {
          background: "white";
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 20px;
          max-width: 600px;
          width: 100%;
          text-align: center;
        }
        .difficulty-badge {
          background: #4CAF50;
          color: white;
          padding: 5px 10px;
          border-radius: 5px;
          display: inline-block;
          margin-bottom: 10px;
        }
        .question-text {
          font-size: 24px;
          margin-bottom: 20px;
        }
        .question-image {
          width: 100%;
          max-height: 300px;
          object-fit: cover;
          border-radius: 10px;
          margin-bottom: 20px;
        }
        .options-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 20px;
        }
        .answer-btn {
          background: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 10px;
          padding: 15px;
          font-size: 16px;
          cursor: pointer;
        }
        .answer-btn.correct-answer {
          background: #4CAF50;
          color: white;
        }
        .answer-btn.incorrect-answer {
          background: #f44336;
          color: white;
        }
        .answer-btn.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .keyboard-hint {
          font-size: 14px;
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
};

export default Game7;
