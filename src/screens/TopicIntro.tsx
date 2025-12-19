import React from 'react';
import "../App.css";

interface TopicIntroProps {
  topicTitle: string;
  onNext: () => void;
  onExit: () => void;
}

const TopicIntro: React.FC<TopicIntroProps> = ({ topicTitle, onNext, onExit }) => {
  return (
    <div className="screen">
      <div className="top-exit-row">
        <button className="exit-btn" onClick={onExit}>
          Exit
        </button>
      </div>
      <header className="screen-header">
        <p className="subtitle">{topicTitle}</p>
        <h2>Introduction to the topic</h2>
      </header>
      <section className="screen-body scrollable">
        <p>
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
          nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
          erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
          et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
          Lorem ipsum dolor sit amet.
        </p>
        <p>
          Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse
          molestie consequat, vel illum dolore eu feugiat nulla facilisis at
          vero eros et accumsan et iusto odio dignissim qui blandit praesent
          luptatum zzril delenit augue duis dolore te feugait nulla facilisi.
        </p>
      </section>
      <footer className="footer-end-row">
        <button className="con-primary-btn" onClick={onNext}>
          Next
        </button>
      </footer>
    </div>
  );
};

export default TopicIntro;