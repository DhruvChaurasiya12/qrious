
import { useState, useEffect } from "react";

export default function Game4({ gameCollections }) {
  const questions = [
    {
      q: "What is 25% of 100?",
      totalValue: 100,
      percentage: 25,
      answer: 25,
      explanation: "25% of 100 is calculated as (25/100) × 100 = 25."
    },
    {
      q: "What is 50% of 80?",
      totalValue: 80,
      percentage: 50,
      answer: 40,
      explanation: "50% of 80 is (50/100) × 80 = 40."
    },
    {
      q: "What is 75% of 60?",
      totalValue: 60,
      percentage: 75,
      answer: 45,
      explanation: "75% of 60 is (75/100) × 60 = 45."
    },
    {
      q: "What is 20% of 150?",
      totalValue: 150,
      percentage: 20,
      answer: 30,
      explanation: "20% of 150 is (20/100) × 150 = 30."
    },
    {
      q: "What is 60% of 200?",
      totalValue: 200,
      percentage: 60,
      answer: 120,
      explanation: "60% of 200 is (60/100) × 200 = 120."
    },
    {
      q: "What is 10% of 90?",
      totalValue: 90,
      percentage: 10,
      answer: 9,
      explanation: "10% of 90 is (10/100) × 90 = 9."
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userFillPercentage, setUserFillPercentage] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [allowNext, setAllowNext] = useState(false); // New state to control next question

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (!gameOver) {
      const timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [startTime, gameOver]);

  useEffect(() => {
    setUserFillPercentage(0);
    setIsSubmitted(false);
    setShowFeedback(false);
    setShowExplanation(false);
    setAllowNext(false);
  }, [currentIndex]);

  const handleSliderChange = (event) => {
    if (isSubmitted) return;
    const value = parseInt(event.target.value);
    setUserFillPercentage(value);
  };

  const handleSubmitAnswer = () => {
    if (isSubmitted || gameOver) return;

    setIsSubmitted(true);
    setShowFeedback(true);
    setShowExplanation(false);
    setAllowNext(false);

    const tolerance = 5;
    const correct = Math.abs(userFillPercentage - currentQuestion.percentage) <= tolerance;
    setIsCorrect(correct);

    if (correct) {
      setScore((s) => s + 1);
    }

    // Auto advance only if explanation is not shown
    if (!showExplanation) {
      setTimeout(() => {
        if (!showExplanation) {
          nextQuestion();
        }
      }, 3000);
    }
  };

  const nextQuestion = () => {
    setShowFeedback(false);
    setIsSubmitted(false);
    setUserFillPercentage(0);
    setShowExplanation(false);
    setAllowNext(false);

    if (currentIndex + 1 >= questions.length) {
      setGameOver(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setUserFillPercentage(0);
    setScore(0);
    setGameOver(false);
    setShowFeedback(false);
    setElapsedTime(0);
    setStartTime(Date.now());
    setIsSubmitted(false);
    setShowExplanation(false);
    setAllowNext(false);
  };

  useEffect(() => {
    gameCollections.eventHandler = (type, event) => {
      if (type === "KEY_DOWN" && !gameOver) {
        if (event.key === 'Enter' && !isSubmitted) {
          handleSubmitAnswer();
        }
        if (event.key === ' ' && gameOver) {
          resetGame();
        }
      }
    };
  }, [isSubmitted, gameOver]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getUserAnswer = () => {
    return Math.round((userFillPercentage / 100) * currentQuestion.totalValue);
  };

  if (gameOver) {
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, sans-serif",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          textAlign: "center",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: "20px",
            padding: "40px",
            maxWidth: "500px",
            width: "100%",
          }}
        >
          <h1 style={{ fontSize: "48px", margin: "0 0 20px 0" }}>🎉</h1>
          <h2 style={{ fontSize: "32px", margin: "0 0 20px 0" }}>Quiz Complete!</h2>
          <div style={{ fontSize: "64px", fontWeight: "bold", margin: "20px 0", color: "#4CAF50" }}>
            {score}/{questions.length}
          </div>
          <div style={{ fontSize: "24px", margin: "20px 0" }}>
            {percentage}% Correct
          </div>
          <div style={{ fontSize: "20px", margin: "15px 0", color: "#64B5F6" }}>
            Total Time: {formatTime(elapsedTime)}
          </div>
          <div style={{ fontSize: "18px", marginBottom: "30px", opacity: 0.8 }}>
            {percentage >= 80 ? "Excellent work! You understand percentages! 🌟" :
              percentage >= 60 ? "Good job! Keep practicing percentages! 👍" :
                percentage >= 40 ? "Not bad, percentage practice makes perfect! 📚" :
                  "Keep trying, percentages will get easier! 💪"}
          </div>
          <button
            onClick={resetGame}
            style={{
              background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
              color: "white",
              border: "none",
              borderRadius: "25px",
              padding: "15px 30px",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
          >
            Play Again
          </button>
          <p style={{ marginTop: "20px", fontSize: "14px", opacity: 0.7 }}>
            Press SPACEBAR to restart
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        padding: "10px",
        fontFamily: "Arial, sans-serif",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "15px",
        padding: "15px 20px",
        backdropFilter: "blur(10px)",
      }}>
        <h2 style={{ margin: 0, fontSize: "24px" }}>Percentage Learning Game</h2>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <div>
            <strong>Question:</strong> {currentIndex + 1}/{questions.length}
          </div>
          <div>
            <strong>Score:</strong> {score}
          </div>
          <div>
            <strong>Time:</strong> {formatTime(elapsedTime)}
          </div>
        </div>
      </div>

      <div style={{
        textAlign: "center",
        marginBottom: "30px",
        fontSize: "32px",
        fontWeight: "bold",
      }}>
        {currentQuestion.q}
      </div>

      <div style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "flex-end",
        flex: 1,
        maxHeight: "400px",
        marginBottom: "30px",
        padding: "0 50px",
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "25%",
        }}>
          <div style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "10px",
            color: "#4CAF50",
          }}>
            {currentQuestion.totalValue}
          </div>
          <div style={{
            width: "100%",
            height: "300px",
            border: "3px solid white",
            borderRadius: "15px",
            position: "relative",
            background: "rgba(255, 255, 255, 0.1)",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute",
              bottom: "0",
              width: "100%",
              height: "100%",
              background: "linear-gradient(to top, #4CAF50, #8BC34A)",
              borderRadius: "12px",
            }} />
          </div>
          <div style={{
            marginTop: "10px",
            fontSize: "18px",
            fontWeight: "bold",
            color: "#4CAF50",
          }}>
            100% Full
          </div>
        </div>

        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "25%",
        }}>
          <div style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "10px",
            color: "#64B5F6",
          }}>
            {getUserAnswer()}
          </div>
          <div style={{
            width: "100%",
            height: "300px",
            border: "3px solid white",
            borderRadius: "15px",
            position: "relative",
            background: "rgba(255, 255, 255, 0.1)",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute",
              bottom: "0",
              width: "100%",
              height: `${userFillPercentage}%`,
              background: showFeedback && isCorrect
                ? "linear-gradient(to top, #4CAF50, #8BC34A)"
                : showFeedback && !isCorrect
                  ? "linear-gradient(to top, #f44336, #ff6b6b)"
                  : "linear-gradient(to top, #64B5F6, #90CAF9)",
              borderRadius: "12px",
              transition: "all 0.3s ease",
            }} />
            {showFeedback && (
              <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "24px",
              }}>
                {isCorrect ? "✅" : "❌"}
              </div>
            )}
          </div>
          <div style={{
            marginTop: "10px",
            fontSize: "18px",
            fontWeight: "bold",
            color: "#64B5F6",
          }}>
            {userFillPercentage}% Full
          </div>
        </div>
      </div>

      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "20px",
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "15px",
        padding: "20px",
        backdropFilter: "blur(10px)",
      }}>
        <div style={{ marginBottom: "15px", fontSize: "18px" }}>
          Drag the slider to fill the cylinder to the correct percentage:
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={userFillPercentage}
          onChange={handleSliderChange}
          disabled={isSubmitted}
          style={{
            width: "60%",
            height: "8px",
            borderRadius: "5px",
            background: "#ddd",
            outline: "none",
            cursor: isSubmitted ? "not-allowed" : "pointer",
          }}
        />
        <div style={{
          marginTop: "15px",
          display: "flex",
          gap: "20px",
          alignItems: "center"
        }}>
          <span style={{ fontSize: "20px", fontWeight: "bold" }}>
            Your Answer: {getUserAnswer()}
          </span>
          <button
            onClick={handleSubmitAnswer}
            disabled={isSubmitted}
            style={{
              background: isSubmitted
                ? "#666"
                : "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
              color: "white",
              border: "none",
              borderRadius: "20px",
              padding: "12px 25px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: isSubmitted ? "not-allowed" : "pointer",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (!isSubmitted) e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              if (!isSubmitted) e.target.style.transform = "scale(1)";
            }}
          >
            Submit Answer
          </button>
        </div>
      </div>

      {showFeedback && (
        <div style={{
          textAlign: "center",
          fontSize: "20px",
          fontWeight: "bold",
          background: isCorrect
            ? "rgba(76, 175, 80, 0.2)"
            : "rgba(244, 67, 54, 0.2)",
          borderRadius: "15px",
          padding: "15px",
          marginBottom: "10px",
        }}>
          {isCorrect ? (
            <span style={{ color: "#4CAF50" }}>
              🎉 Excellent! {currentQuestion.percentage}% of {currentQuestion.totalValue} is {currentQuestion.answer}!
            </span>
          ) : (
            <span style={{ color: "#f44336" }}>
              Try again! {currentQuestion.percentage}% of {currentQuestion.totalValue} is {currentQuestion.answer}. You filled it to {userFillPercentage}%.
            </span>
          )}

          <div style={{ marginTop: "15px" }}>
            <button
              onClick={() => {
                setShowExplanation((prev) => !prev);
                setAllowNext(true);
              }}
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                border: "1px solid white",
                borderRadius: "10px",
                padding: "8px 16px",
                color: "white",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Why?
            </button>
          </div>

          {showExplanation && (
            <div style={{
              marginTop: "15px",
              background: "rgba(0,0,0,0.2)",
              borderRadius: "10px",
              padding: "10px",
              fontSize: "16px",
              color: "#fff",
            }}>
              {currentQuestion.explanation}

              <div style={{ marginTop: "15px" }}>
                <button
                  onClick={nextQuestion}
                  style={{
                    background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "20px",
                    padding: "10px 20px",
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                >
                  Next Question
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{
        textAlign: "center",
        fontSize: "14px",
        opacity: 0.8
      }}>
        Drag the slider, press "Check Answer" (or press C) to preview, then "Submit" (or ENTER) to continue
      </div>
    </div>
  );
}