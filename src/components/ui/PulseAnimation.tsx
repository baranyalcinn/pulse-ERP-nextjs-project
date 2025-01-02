import React from 'react';

export const PulseAnimation = () => {
  return (
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 opacity-30">
        {/* Nabız çizgisi */}
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="pulse-path"
            d="M0,100 L300,100 L340,20 L360,160 L380,30 L400,140 L420,60 L440,120 L600,100 L1200,100"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
        </svg>
      </div>
      
      {/* Arka plan efekti */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 pulse-ring opacity-10"></div>
        <div className="absolute inset-0 pulse-ring opacity-10 animation-delay-1000"></div>
        <div className="absolute inset-0 pulse-ring opacity-10 animation-delay-2000"></div>
      </div>
    </div>
  );
}; 