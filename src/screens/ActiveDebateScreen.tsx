import React, { useEffect, useRef, useState } from "react";
import CandidateCard from "../components/CandidateCard";
import type { ChatMessage } from "../types/types";
import "../App.css";


// "Be an Active Part" - Role
interface ActiveDebateScreenProps {
  topicTitle: string;
  timeLeft: string;
  inputText: string;
  setInputText: (value: string) => void;
  onSend: () => void;
  onExit: () => void;
  hasStarted: boolean;
  onStart: () => void;
}

const ActiveDebateScreen: React.FC<ActiveDebateScreenProps> = ({
  timeLeft,
  inputText,
  setInputText,
  onSend,
  onExit,
  hasStarted,
  onStart,
}) => {
  const [visibleBubbles, setVisibleBubbles] = useState(0);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState<string>("yellow");
  const [currentTypingText, setCurrentTypingText] = useState<string | undefined>(undefined);
  const [messagesSinceUserInput, setMessagesSinceUserInput] = useState(0);
  const [showUrgentPrompt, setShowUrgentPrompt] = useState(false);
  const [hasUserSentOpinion, setHasUserSentOpinion] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasStartedRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Die Argument-Bubbles mit Chatbot-Farben
  const argumentBubbles = [
    { color: "yellow", text: "This is my first argument for the Pro side.", side: "pro" },
    { color: "red", text: "I disagree! Here is my counterargument.", side: "contra" },
    { color: "gray", text: "Adding to the Pro position with more evidence.", side: "pro" },
    { color: "green", text: "But consider this opposing viewpoint!", side: "contra" },
    { color: "yellow", text: "Let me conclude with a final Pro argument.", side: "pro" },
  ];

  const typewriterEffect = (text: string, color: string, side: string) => {
    const words = text.split(" ");
    let wordCount = 0;
    setCurrentTypingText("");
    
    const interval = setInterval(() => {
      wordCount++;
      if (wordCount <= words.length) {
        setCurrentTypingText(words.slice(0, wordCount).join(" "));
      } else {
        clearInterval(interval);
        setCurrentTypingText(undefined);
        setChatHistory(prev => [...prev, {
          id: Date.now(),
          type: "bot",
          color: color,
          text: text,
          side: side,
          isComplete: true
        }]);
        setVisibleBubbles(prev => prev + 1);
        
        // Zähle Bot-Nachrichten und zeige nach 3 die dringende Aufforderung
        setMessagesSinceUserInput(prev => {
          const newCount = prev + 1;
          if (newCount >= 3 && !showUrgentPrompt) {
            setShowUrgentPrompt(true);
          }
          return newCount;
        });
      }
    }, 150);
  };

  // Starte automatisch die erste Nachricht beim Laden
  useEffect(() => {
    if (!hasStarted) return;
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      const firstBubble = argumentBubbles[0];
      setCurrentSpeaker(firstBubble.color);
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
        typewriterEffect(firstBubble.text, firstBubble.color, firstBubble.side);
      }, 1500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasStarted]);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

  const handleContinue = () => {
    if (!hasStarted) {
      onStart();
      return;
    }

    // Reset urgent prompt wenn User auf Continue klickt
    if (showUrgentPrompt) {
      setShowUrgentPrompt(false);
      setMessagesSinceUserInput(0);
    }

    const isBusy = isTyping || currentTypingText !== undefined;

    if (visibleBubbles < argumentBubbles.length && !isBusy) {
      const nextBubble = argumentBubbles[visibleBubbles];
      setCurrentSpeaker(nextBubble.color);
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
        typewriterEffect(nextBubble.text, nextBubble.color, nextBubble.side);
      }, 1500);
    } else if (visibleBubbles >= argumentBubbles.length && !isBusy) {
      onExit();
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    const wasUrgentPrompt = showUrgentPrompt;
    
    setChatHistory(prev => [...prev, {
      id: Date.now(),
      type: "user",
      text: inputText.trim(),
      isComplete: true
    }]);
    
    // Reset urgent prompt nach User-Input
    setShowUrgentPrompt(false);
    setMessagesSinceUserInput(0);
    setHasUserSentOpinion(true);
    
    onSend();
    
    // Wenn urgentPrompt aktiv war, automatisch Continue ausführen
    if (wasUrgentPrompt && hasStarted) {
      setTimeout(() => {
        const isBusy = isTyping || currentTypingText !== undefined;
        if (visibleBubbles < argumentBubbles.length && !isBusy) {
          const nextBubble = argumentBubbles[visibleBubbles];
          setCurrentSpeaker(nextBubble.color);
          setIsTyping(true);
          
          setTimeout(() => {
            setIsTyping(false);
            typewriterEffect(nextBubble.text, nextBubble.color, nextBubble.side);
          }, 1500);
        }
      }, 500);
    }
  };

  return (
    <div className="screen active-debate-screen">
      <div className="top-exit-row">
        <span className="timer-display">{timeLeft}</span>
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
      <section className="active-debate-stage">
        <div className="arguments-stage">
          {/* Pro Side */}
          <div className="arguments-side pro-side">
            <div className="side-title">Pro</div>
            <div className="candidates-row">
              <CandidateCard 
                color="yellow" 
                hasMic={hasStarted && currentSpeaker === "yellow"}
                isTyping={hasStarted && isTyping && currentSpeaker === "yellow"}
                bubbleText={hasStarted && currentSpeaker === "yellow" ? currentTypingText : undefined}
              />
              <CandidateCard 
                color="gray" 
                hasMic={hasStarted && currentSpeaker === "gray"}
                isTyping={hasStarted && isTyping && currentSpeaker === "gray"}
                bubbleText={hasStarted && currentSpeaker === "gray" ? currentTypingText : undefined}
              />
            </div>
          </div>

          {/* Contra Side */}
          <div className="arguments-side contra-side">
            <div className="side-title">Contra</div>
            <div className="candidates-row">
              <CandidateCard 
                color="red" 
                hasMic={currentSpeaker === "red"}
                isTyping={isTyping && currentSpeaker === "red"}
                bubbleText={currentSpeaker === "red" ? currentTypingText : undefined}
              />
              <CandidateCard 
                color="green" 
                hasMic={currentSpeaker === "green"}
                isTyping={isTyping && currentSpeaker === "green"}
                bubbleText={currentSpeaker === "green" ? currentTypingText : undefined}
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
            <p className="modal-text">You've shared your opinion. Now let the chatbots respond!</p>
            <button className="start-debate-btn" onClick={handleContinue}>
              Start Debate
            </button>
          </div>
        </div>
      )}
              {/* Zeige normalen Button nur wenn Modal nicht sichtbar ist */}
        {(hasStarted || !hasUserSentOpinion) && (
          <div className="footer-end-row">
            <button 
              className="con-primary-btn" 
              onClick={handleContinue}
              disabled={!hasStarted && !hasUserSentOpinion}
            >
              {!hasStarted ? "Start Debate" : visibleBubbles < argumentBubbles.length ? "Continue" : "Finish Debate"}
            </button>
          </div>
        )}

      {/* Prominenter User Input Bereich */}
      <footer className="debate-input-footer active-input-footer">
        {/* Aufforderung zur Teilnahme */}
        <div className={`participation-prompt ${showUrgentPrompt ? "urgent" : ""}`}>
          {showUrgentPrompt ? (
            <span className="urgent-text">It's your turn! Share your thoughts on the debate:</span>
          ) : (
            <span className="prompt-text">Tell your opinion:</span>
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

export default ActiveDebateScreen;