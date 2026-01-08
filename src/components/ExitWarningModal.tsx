import React from 'react';
import "../App.css";

interface ExitWarningModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ExitWarningModal: React.FC<ExitWarningModalProps> = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="exit-warning-modal-overlay">
      <div className="exit-warning-modal">
        <h3>Bist du sicher, dass du die Debatte verlassen möchtest?</h3>
        <div className="exit-modal-buttons">
          <button className="exit-cancel-btn" onClick={onCancel}>
            Abbrechen
          </button>
          <button className="exit-confirm-btn" onClick={onConfirm}>
            Ja, verlassen
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExitWarningModal;
