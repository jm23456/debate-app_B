import React, { useEffect, useRef, useState } from "react";
import CandidateCard from "../components/CandidateCard";
import type { ChatMessage } from "../types/types";
import "../App.css";


// "Be an Active Part" - Role
interface ActiveArgumentsScreenProps {
  topicTitle: string;
  inputText: string;
  setInputText: (value: string) => void;
  onSend: () => void;
  onExit: () => void;
  hasStarted: boolean;
  onStart: () => void;
}

const ActiveArgumentsIntro: React.FC<ActiveArgumentsScreenProps> = ({
  inputText,
  setInputText,
  onSend,
  onExit,
  hasStarted,
  onStart,
}) => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [showUrgentPrompt, setShowUrgentPrompt] = useState(false);
  const [hasUserSentOpinion, setHasUserSentOpinion] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleContinue = () => {
    if (!hasStarted) {
      onStart();
      return;
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    setChatHistory(prev => [...prev, {
      id: Date.now(),
      type: "user",
      text: inputText.trim(),
      isComplete: true
    }]);
    
    // Reset urgent prompt nach User-Input
    setShowUrgentPrompt(false);
    setHasUserSentOpinion(true);
    
    onSend();
  };

  return (
    <div className="screen debate-screen">
      <div className="top-exit-row">
        <span className="timer-display">{}</span>
        <button className="exit-btn" onClick={onExit}>
          Exit
        </button>
      </div>

      {/* Chat-History - chronologisch */}
      <section className="debate-arguments">
        {chatHistory.map((msg) => (
          <div 
            key={msg.id} 
            className={`argument-box ${msg.type === "bot" ? `argument-${msg.color}` : "argument-user"}`}
          >
            <span className={msg.type === "bot" ? "argument-label" : "argument-text"}>
              {msg.text}
            </span>
          </div>
        ))}
        
        <div ref={messagesEndRef} />
      </section>

      {/* Pro vs Contra stage */}
      <section className="debate-stage">
        <div className="arguments-stage">
          {/* Pro Side */}
          <div className="arguments-side pro-side">
            <div className="side-title">Pro</div>
            <div className="candidates-row">
              <CandidateCard 
                color="yellow" 
              />
              <CandidateCard 
                color="gray" 
              />
            </div>
          </div>

          {/* Contra Side */}
          <div className="arguments-side contra-side">
            <div className="side-title">Contra</div>
            <div className="candidates-row">
              <CandidateCard 
                color="red" 
              />
              <CandidateCard 
                color="green" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Modal Overlay für Start Debate nach User-Input */}
      {!hasStarted && hasUserSentOpinion && (
        <div className="start-debate-modal-overlay">
          <div className="start-debate-modal">
            <div className="modal-icon">🎙️</div>
            <h2 className="modal-title">Ready to start the debate?</h2>
            <p className="modal-text">You've shared your opinion. Now let the debate begin!</p>
            <button className="start-debate-btn" onClick={handleContinue}>
              Start Debate
            </button>
          </div>
        </div>
      )}

      {/* Prominenter User Input Bereich */}
      <footer className="debate-input-footer active-input-footer">
        {/* Aufforderung zur Teilnahme */}
        <div className={`participation-prompt ${showUrgentPrompt ? "urgent" : ""}`}>
          {showUrgentPrompt ? (
            <span className="urgent-text">🎙️ It's your turn! Share your thoughts on the topic:</span>
          ) : (
            <span className="prompt-text">Your turn. Tell your opinion on the topic:</span>
          )}
        </div>
        
        <div className="active-input-row">
          <div className="user-mic-icon">🎙️</div>
          <input
            className="text-input active-text-input"
            placeholder="Type your opinion here..."
            value={inputText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInputText(e.target.value)
            }
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <button 
            className={"send-btn active-send-btn" + (inputText.trim() ? " active" : "")}
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
          >
            Send
          </button>
        </div>
        
      </footer>
    </div>
  );
};

export default ActiveArgumentsIntro;