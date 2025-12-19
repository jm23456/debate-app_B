import React from 'react';
import CandidateCardIntro from '../components/CandidateCardIntro';
import "../App.css";

interface SummaryProps {
  topicTitle: string;
  onStartAnother: () => void;
}

const Summary: React.FC<SummaryProps> = ({onStartAnother }) => {
  return (
    <div className="screen">
      <section className="screen-body">
        <div className="intro-stage">
          {/* Pro Side */}
            <div className="introcandidates-row">
              <CandidateCardIntro color="yellow" />
              <CandidateCardIntro color="gray" />
            </div>

        {/* Contra Side */}
          <div className="introcandidates-row">
            <CandidateCardIntro color="red" />
            <CandidateCardIntro color="green" />
          </div>
        </div>
      </section>
      <header className="screen-header">
        <p className="subtitle">Summary</p>
      </header>

      <section className="screen-body scrollable">
        <p>
          Thank you for participating in the debate! Here is a summary of the
          discussion and the key arguments from both sides.
        </p>
        <div className="summary-section">
          <h3>Pro Arguments</h3>
          <p>Summary of the main pro arguments presented during the debate.</p>
        </div>
        <div className="summary-section">
          <h3>Contra Arguments</h3>
          <p>Summary of the main contra arguments presented during the debate.</p>
        </div>
      </section>

      <footer className="footer-end-row">
        <button className="con-primary-btn" onClick={onStartAnother}>
          Start another Round
        </button>
      </footer>
    </div>
  );
};

export default Summary;