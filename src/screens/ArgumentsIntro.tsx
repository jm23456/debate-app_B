import React, { useState } from "react";
import CandidateCard from "../components/CandidateCard";
import "../App.css";    


interface ArgumentsIntroProps {
  topicTitle: string;
  onContinue: () => void;
  onExit: () => void;
  introTime: string;
  activeBot: number;
  setActiveBot: (i: number) => void;
  totalBots: number;
  onFinalContinue: () => void;
  hasStarted: boolean;
  onStart: () => void;
}

const ArgumentsIntro: React.FC<ArgumentsIntroProps> = ({
  onContinue,
  onExit,
  introTime,
  activeBot,
  setActiveBot,
  totalBots,
  onFinalContinue,
  hasStarted,
  onStart,
}) => {
  const [spokenBots, setSpokenBots] = useState<number[]>([0]); // Der erste Bot hat schon gesprochen

  const handleNext = () => {
    // Füge den aktuellen Bot zu spokenBots hinzu
    if (!hasStarted) {
      onStart();
      return;
    }
    if (!spokenBots.includes(activeBot)) {
      setSpokenBots([...spokenBots, activeBot]);
    }
    
    if (activeBot < totalBots - 1) {
      setActiveBot(activeBot + 1);   
      onContinue();                  
    } else {
      onFinalContinue();
      setActiveBot(0);          
    }
  };

  const proBots = [
    { color: "yellow", label: "Pro 1" },
    { color: "gray", label: "Pro 2" },
  ];

  const contraBots = [
    { color: "red", label: "Con 1" },
    { color: "green", label: "Con 2" },
  ];


  return (
    <div className="screen">
      <div className="top-exit-row">
        <span className="timer-display">{introTime}</span>
        <button className="exit-btn" onClick={onExit}>
          Exit
        </button>
      </div>


      <header className="screen-header">
        <p className="subtitleArgu">Each side now gets 1 min to tell their main arguments</p>
      </header>

      <section className="screen-body">
        <div className="arguments-stage">
          {/* Pro Side */}
          <div className="arguments-side pro-side">
            <div className="side-title">Pro</div>
            <div className="candidates-row">
              {proBots.map((bot, i) => {
                const seq = 0 + i;
                return (
                  <CandidateCard
                    key={i}
                    color={bot.color as "yellow" | "gray" | "red" | "green"}
                    hasMic={hasStarted && activeBot === seq}
                    showBubble={hasStarted && (activeBot === seq || spokenBots.includes(seq))}
                    bubbleLabel={bot.label}
                  />
                );
              })}
            </div>
          </div>

          {/* Contra Side */}
          <div className="arguments-side contra-side">
            <div className="side-title">Contra</div>
            <div className="candidates-row">
              {contraBots.map((bot, i) => {
                const seq = proBots.length + i;
                return (
                  <CandidateCard
                    key={i}
                    color={bot.color as "yellow" | "gray" | "red" | "green"}
                    hasMic={hasStarted && activeBot === seq}
                    showBubble={hasStarted && (activeBot === seq || spokenBots.includes(seq))}
                    bubbleLabel={hasStarted ? bot.label : ""}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </section>
      <footer className="footer-end-row">
        <button className="con-primary-btn" onClick={handleNext}>
          {!hasStarted ? "Start" :activeBot < totalBots -1 ? "Next Speaker" : "Continue"}
        </button>
      </footer>
    </div>
  );
};

export default ArgumentsIntro;