import { useState } from "react";
import "./game2.css";
export default function GameQA() {
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

  // Determine the CSS class for each button based on its state
  const getButtonClass = (opt) => {
    let className = "option-button";
    if (selected === opt) {
      className += opt === currentQuestion.answer ? " correct" : " incorrect";
    }
    return className;
  };

  return (
    <div className="game-qa-container">
      <h2>Question & Answer Game</h2>
      <p>
        <strong>Score:</strong> {score}
      </p>

      <h3>{currentQuestion.q}</h3>

      <div className="options-container">
        {currentQuestion.options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleAnswer(opt)}
            disabled={selected !== null}
            className={getButtonClass(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
