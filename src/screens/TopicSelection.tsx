import React from "react";
import CandidateCardIntro from "../components/CandidateCardIntro";
import "../App.css";

interface TopicSelectionProps {
  selectedTopic: string;
  setSelectedTopic: (value: string) => void;
  customTopic: string;
  setCustomTopic: (value: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

const TopicSelection: React.FC<TopicSelectionProps> = ({
  selectedTopic,
  setSelectedTopic,
  customTopic,
  setCustomTopic,
  onContinue,
  onBack,
}) => {
  const topics = ["Topic 1", "Topic 2", "Topic 3"];

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
    setCustomTopic("");
    onContinue();
  };

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
        <p className="subtitle">Chatbot Debate Arena</p>
        <p className="intro-text">
          Vier KI-Persönlichkeiten. Eine Debatte.<br />
          Du entscheidest, wie du mitmachst.
        </p>
      </header>

      <section className="role-title">
        <h2>Choose a topic:</h2>
        <div className="button-grid">
          {topics.map((topic) => (
            <button
              key={topic}
              className={
                "primary-btn outline" +
                (selectedTopic === topic && !customTopic
                  ? " primary-btn-active"
                  : "")
              }
              onClick={() => handleTopicSelect(topic)}
            >
              {topic}
            </button>
          ))}
        </div>
          
        <h4>Or enter your own topic here:</h4>

        <div className="custom-topic-row">
          <input
            className="text-input"
            placeholder="Type your own topic here..."
            value={customTopic}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCustomTopic(e.target.value)
            }
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter" && customTopic.trim()) {
                e.preventDefault();
                onContinue();
              }
            }}
          />
          <button 
            className={"send-btn" + (customTopic.trim() ? " active" : "")}
            onClick={onContinue}
            disabled={!customTopic.trim()}
          >
            Send
          </button>
        </div>
      </section>

      <footer className="screen-footer">
        <button className="secondary-btn" onClick={onBack}>
          Back
        </button>
      </footer>
    </div>
  );
};

export default TopicSelection;