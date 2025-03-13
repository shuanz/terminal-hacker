import React from 'react';

interface StatusBarProps {
  level: number;
  experience: number;
  money: number;
  detection: number;
  isStealthMode: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  level,
  experience,
  money,
  detection,
  isStealthMode,
}) => {
  const experienceNeeded = level * 1000;

  return (
    <div className="status-bar">
      <div className="level">
        Level {level}
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{
              width: `${(experience / experienceNeeded) * 100}%`,
            }}
          >
            <span className="progress-bar-text">
              {experience}/{experienceNeeded} XP
            </span>
          </div>
        </div>
      </div>
      <div className={`detection ${detection > 50 ? 'warning' : ''}`}>
        Detection: {detection}%
      </div>
      <div className="money">${money}</div>
      <div className={`stealth ${isStealthMode ? 'active' : ''}`}>
        {isStealthMode ? 'Stealth Mode' : 'Normal Mode'}
      </div>
    </div>
  );
}; 