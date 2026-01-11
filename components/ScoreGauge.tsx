import React from 'react';

interface ScoreGaugeProps {
  score: number;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score }) => {
  // Config - reduced size for Tweet Card embed
  const size = 90;
  const strokeWidth = 8;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate offset based on score (0-100)
  const offset = circumference - (score / 100) * circumference;

  let color = '#00ba7c'; // X Green
  let labelColor = 'text-[#00ba7c]';
  
  if (score < 50) {
    color = '#f91880'; // X Red/Pink
    labelColor = 'text-[#f91880]';
  } else if (score < 80) {
    color = '#ffd400'; // X Yellow
    labelColor = 'text-[#ffd400]';
  }

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#2f3336"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-2xl font-bold ${labelColor}`}>{score}</span>
      </div>
    </div>
  );
};