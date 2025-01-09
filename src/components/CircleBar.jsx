'use client'
import React, { useState, useEffect } from 'react';

const colors = [
  'text-red-500',
  'text-yellow-500',
  'text-green-500',
  'text-blue-500',
  'text-purple-500',
];

const CircleProgressBar = () => {
  const [progress, setProgress] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 10;
        if (newProgress > 100) {
          return 0; // Reinicia si llega a 100
        }
        return newProgress;
      });
      setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const strokeDasharray = `${(progress / 100) * 283} 283`;

  return (
    <div className="flex justify-center items-center h-screen">
      <svg className={`w-40 h-40 ${colors[colorIndex]}`} viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="10"
          fill="transparent"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="10"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          transform="rotate(-90 50 50)"
          strokeLinecap="round"
        />
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dy="0.3em"
          className="text-2xl fill-current"
        >
          {progress}%
        </text>
      </svg>
    </div>
  );
};

export default CircleProgressBar;
