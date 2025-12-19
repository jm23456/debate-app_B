import React, { useState } from "react";

interface CandidateCardProps {
  color: "yellow" | "gray" | "green" | "red";
  hasMic?: boolean;
  showBubble?: boolean;
  bubbleText?: string;
  isTyping?: boolean;
  bubbleLabel?: string;
}


const CandidateCard: React.FC<CandidateCardProps> = ({ color, hasMic = false, showBubble = false, bubbleText, isTyping = false, bubbleLabel = "Introduction" }) => {
  const [hovered, setHovered] = useState(false);
  const bubbleVisible = showBubble || hovered || bubbleText !== undefined || isTyping;
  
  return (
    <div className={`candidate-card candidate-${color}`}
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
    >
      {bubbleVisible && (
        <div className="candidate-speech-bubble">
          {isTyping ? (
            <span className="typing-dots">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </span>
          ) : bubbleText !== undefined ? (
            <span>{bubbleText}<span className="cursor">|</span></span>
          ) : (
            <span>{bubbleLabel}</span>
          )}
        </div>
      )}
      <div className={`candidate-robot ${hasMic ? "has-mic" : ""}`}>
        <span className="robot-icon">🤖</span>
        {hasMic && <span className="mic-icon">🎙️</span>}
      </div>
      <div className="candidate-podium">
        <div className="podium-modern">
          <div className="podium-modern-top"></div>
          <div className="podium-modern-stand"></div>
          <div className="podium-modern-base"></div>
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;