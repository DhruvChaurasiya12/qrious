import { useState } from "react";

export default function GameQA({ gameCollections }) {
  const questions = [
    {
      q: "What is 2 + 2?",
      options: ["3", "4", "5", "22"],
      answer: "4",
    },
    {
      q: "Capital of France?",
      options: ["London", "Berlin", "Paris", "Rome"],
      answer: "Paris",
    },
    {
      q: "Which language runs in a web browser?",
      options: ["Python", "Java", "C++", "JavaScript"],
      answer: "JavaScript",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (opt) => {
    setSelected(opt);

    if (opt === currentQuestion.answer) {
      setScore((s) => s + 1);
    }

    setTimeout(() => {
      setSelected(null);
      setCurrentIndex((i) => (i + 1) % questions.length);
    }, 1000);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: "20px",
        fontFamily: "Arial",
        color: "#333",
        background: "#f4f4f4",
        boxSizing: "border-box",
      }}
    >
      <h2>Question & Answer Game</h2>
      <p>
        <strong>Score:</strong> {score}
      </p>

      <h3>{currentQuestion.q}</h3>

      <div style={{ marginTop: "15px" }}>
        {currentQuestion.options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleAnswer(opt)}
            disabled={selected !== null}
            style={{
              display: "block",
              width: "100%",
              padding: "10px",
              margin: "8px 0",
              background:
                selected === opt
                  ? opt === currentQuestion.answer
                    ? "green"
                    : "red"
                  : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
