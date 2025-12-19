import React, { useEffect, useRef, useState } from "react";
import CandidateCard from "../components/CandidateCard";
import type { Role, DebateMessage, ChatMessage } from "../types/types";
import "../App.css";

interface DebateScreenProps {
  topicTitle: string;
  role: Role;
  messages: DebateMessage[];
  timeLeft: string;
  inputText: string;
  setInputText: (value: string) => void;
  onSend: () => void;
  onExit: () => void;
  hasStarted: boolean;
  onStart: () => void;
}

const DebateScreen: React.FC<DebateScreenProps> = ({
  timeLeft,
  inputText,
  setInputText,
  onSend,
  onExit,
  hasStarted,
  onStart,
}) => {
  const [visibleBubbles, setVisibleBubbles] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState<string>("yellow");
  const [currentTypingText, setCurrentTypingText] = useState<string | undefined>(undefined);
  const hasStartedRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll zur neuesten Nachricht
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Die 5 Argument-Bubbles mit Chatbot-Farben
  const argumentBubbles = [
    { color: "yellow", text: "This is my first argument for the Pro side.", side: "pro" },
    { color: "red", text: "I disagree! Here is my counterargument.", side: "contra" },
    { color: "gray", text: "Adding to the Pro position with more evidence.", side: "pro" },
    { color: "green", text: "But consider this opposing viewpoint!", side: "contra" },
    { color:"yellow", text: "Let me conclude with a final Pro argument.", side: "pro" },
  ];

  // Chat-History - startet leer
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // Typewriter-Effekt: Text Wort für Wort in der Chatbot-Bubble aufbauen
  const typewriterEffect = (text: string, color: string, side: string) => {
    const words = text.split(" ");
    let wordCount = 0;
    
    // Start mit leerem Text in der Bubble
    setCurrentTypingText("");
    
    const interval = setInterval(() => {
      wordCount++;
      
      if (wordCount <= words.length) {
        // Text aus den ersten wordCount Wörtern
        const newText = words.slice(0, wordCount).join(" ");
        setCurrentTypingText(newText);
      } else {
        clearInterval(interval);
        // Fertig! Füge zur Chat-History hinzu und lösche Bubble-Text
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
      }
    }, 150); // 150ms pro Wort
  };

  // Starte automatisch die erste Nachricht beim Laden
  useEffect(() => {
    if(!hasStarted) return;
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

  // Auto-scroll wenn sich chatHistory oder isTyping ändert
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

    const handleContinue = () => {
    if (!hasStarted) {
      onStart();
      return;
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
  }


  // User-Nachricht senden und in Chat-History einfügen
  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    setChatHistory(prev => [...prev, {
      id: Date.now(),
      type: "user",
      text: inputText.trim(),
      isComplete: true
    }]);
    
    onSend();
  };

  return (
    <div className="screen debate-screen">
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
        
        {/* Auto-scroll Anker */}
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

      {/* Input area */}
      <footer className="debate-input-footer">
        <div className="custom-topic-row">
          <input
            className="text-input flex-1"
            placeholder="Type your question/input/comment here..."
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
            className={"send-btn" + (inputText.trim() ? " active" : "")}
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
          >
            Send
          </button>
        </div>
        <div className="footer-end-row">
          <button className="con-primary-btn" onClick={handleContinue}>
            {!hasStarted ? "Start Debate" : visibleBubbles < argumentBubbles.length ? "Continue" : "Finish Debate"}
          </button>
        </div>
      </footer>
    </div>
  );
};


export default DebateScreen;