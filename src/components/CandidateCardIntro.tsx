import React from "react";

interface CandidateCardIntroProps {
  color: "yellow" | "gray" | "red" | "green";
}

const CandidateCardIntro: React.FC<CandidateCardIntroProps> = ({ color}) => {
  return (
    <div className={`candidate-card candidate-${color}`}>
      <div className={`candidate-robot`}>
        <span className="robot-icon">🤖</span>
      </div>
    </div>
  );
};

export default CandidateCardIntro;