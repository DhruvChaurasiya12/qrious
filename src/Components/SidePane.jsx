import React from "react";
import { useContext } from "react";
import { GameContext } from "./GameContext";
import "./sidepane.css";

const SidePane = () => {
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
  let keyid = 1212;
  return (
    <div className="sidepane">
      {/* Header with typing effect */}
      <div className="sidepane-header">{title || "Hints & Resources"}</div>

      {/* Video Section */}
      {videoUrls && (
        <div className="sidepane-video">
          {videoUrls.map((videoUrl, idx) => (
            <iframe
              key={keyid++}
              className="video-frame"
              src={videoUrl}
              title="Hint Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          ))}
        </div>
      )}

      {/* Hint Section */}
      {hints.length > 0 && (
        <div className="sidepane-section">
          <h3>💡 Hints</h3>
          <ul>
            {hints.map((hint, idx) => (
              <li key={idx}>{hint}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Theory Section */}
      {theory.length > 0 && (
        <div className="sidepane-section">
          <h3>📖 Theory</h3>
          <ul>
            {theory.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Extra Resources */}
      <div className="sidepane-section">
        <h3>📚 Resources</h3>
        <ul>
          {references.map((ref, idx) => {
            return (
              <li key={idx}>
                <a href={ref.link} target="_blank" rel="noopener noreferrer">
                  {ref.title}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default SidePane;
