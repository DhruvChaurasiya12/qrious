import React from "react";
import { useContext } from "react";
import { GameContext } from "./GameContext";
import "./sidepane.css";

function ShiningLoader({ message = "Loading..." }) {
  return (
    <div className="video-frame">
      <div className="shining-box">{message}</div>
    </div>
  );
}

function ShiningText({ message = "Loading..." }) {
  return (
    <div>
      <div className="shining-text">{message}</div>
      <div className="shining-text">{message}</div>
      <div className="shining-text">{message}</div>
      <div className="shining-text">{message}</div>
    </div>
  );
}

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
          <h3>💡 Videos</h3>
          {videoUrls.length > 0 ? (
            videoUrls.map((videoUrl, idx) => (
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
            ))
          ) : (
            <ShiningLoader message="Video Loading" />
          )}
        </div>
      )}

      {/* Hint Section */}
      {hints && (
        <div className="sidepane-section">
          <h3>💡 Hints</h3>
          {hints.length > 0 ? (
            <ul>
              {hints.map((hint, idx) => (
                <li key={idx}>{hint}</li>
              ))}
            </ul>
          ) : (
            <ShiningText message="loading ..." />
          )}
        </div>
      )}

      {/* Theory Section */}
      {theory && (
        <div className="sidepane-section">
          <h3>📖 Theory</h3>
          {theory.length > 0 ? (
            <ul>
              {theory.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          ) : (
            <ShiningText message="loading ..." />
          )}
        </div>
      )}

      {/* Extra Resources */}
      {references && (
        <div className="sidepane-section">
          <h3>📚 Resources</h3>
          {references.length > 0 ? (
            <ul>
              {references.map((ref, idx) => {
                return (
                  <li key={idx}>
                    <a
                      href={ref.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {ref.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : (
            <ShiningText message="loading..." />
          )}
        </div>
      )}
    </div>
  );
};

export default SidePane;
