import React from 'react';

export default function FlowingBubble({ className = "" }) {
  return (
    <div className={`relative ${className}`} style={{ width: '300px', height: '300px' }}>
      {/* Main bubble container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full">
          {/* Animated gradient layers */}
          <div className="flowing-bubble absolute inset-0 rounded-full" />
          <div className="flowing-bubble-2 absolute inset-0 rounded-full" />
          <div className="flowing-bubble-3 absolute inset-0 rounded-full" />
          
          {/* Glass effect overlay */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
          
          {/* Inner glow */}
          <div className="absolute inset-4 rounded-full bg-gradient-radial from-white/10 to-transparent blur-xl" />
          
          {/* Icon container - centered */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="40" 
              height="40" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="white" 
              opacity={0.7}
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 19v3"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <rect x="9" y="2" width="6" height="13" rx="3"/>
            </svg>
          </div>
        </div>
        
        {/* Outer glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-pink-500/30 blur-2xl animate-pulse" />
      </div>

      <style jsx>{`
        @keyframes flow {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          }
          25% {
            transform: scale(1.05) rotate(90deg);
            border-radius: 30% 60% 70% 40% / 50% 60% 40% 50%;
          }
          50% {
            transform: scale(0.95) rotate(180deg);
            border-radius: 50% 50% 30% 70% / 30% 70% 70% 30%;
          }
          75% {
            transform: scale(1.02) rotate(270deg);
            border-radius: 70% 30% 50% 50% / 40% 50% 60% 50%;
          }
        }

        @keyframes flow2 {
          0%, 100% {
            transform: scale(1) rotate(180deg);
            border-radius: 40% 60% 60% 40% / 70% 30% 30% 70%;
          }
          33% {
            transform: scale(1.03) rotate(300deg);
            border-radius: 60% 40% 50% 50% / 40% 70% 60% 30%;
          }
          66% {
            transform: scale(0.97) rotate(60deg);
            border-radius: 50% 50% 40% 60% / 60% 40% 70% 30%;
          }
        }

        @keyframes flow3 {
          0%, 100% {
            transform: scale(1) rotate(90deg);
            border-radius: 55% 45% 45% 55% / 60% 50% 50% 40%;
          }
          40% {
            transform: scale(1.04) rotate(210deg);
            border-radius: 45% 55% 60% 40% / 50% 65% 35% 50%;
          }
          80% {
            transform: scale(0.96) rotate(330deg);
            border-radius: 65% 35% 50% 50% / 45% 55% 60% 40%;
          }
        }

        .flowing-bubble {
          background: linear-gradient(135deg, 
            rgba(168, 85, 247, 0.8) 0%,
            rgba(59, 130, 246, 0.8) 33%,
            rgba(147, 51, 234, 0.8) 66%,
            rgba(236, 72, 153, 0.8) 100%
          );
          animation: flow 8s ease-in-out infinite;
          filter: blur(1px);
        }

        .flowing-bubble-2 {
          background: linear-gradient(225deg,
            rgba(59, 130, 246, 0.6) 0%,
            rgba(147, 51, 234, 0.6) 33%,
            rgba(236, 72, 153, 0.6) 66%,
            rgba(168, 85, 247, 0.6) 100%
          );
          animation: flow2 10s ease-in-out infinite;
          filter: blur(2px);
          mix-blend-mode: screen;
        }

        .flowing-bubble-3 {
          background: linear-gradient(315deg,
            rgba(236, 72, 153, 0.5) 0%,
            rgba(168, 85, 247, 0.5) 33%,
            rgba(59, 130, 246, 0.5) 66%,
            rgba(147, 51, 234, 0.5) 100%
          );
          animation: flow3 12s ease-in-out infinite;
          filter: blur(3px);
          mix-blend-mode: overlay;
        }
      `}</style>
    </div>
  );
}