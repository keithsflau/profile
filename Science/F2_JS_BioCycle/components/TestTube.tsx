import React from 'react';
import { SimulationState } from '../types';

interface TestTubeProps {
  simState: SimulationState;
}

export const TestTube: React.FC<TestTubeProps> = ({ simState }) => {
  const { indicatorColor, netExchange } = simState;

  // Determine Bubble Animation Mode
  // Net > 5: Photosynthesis Dominant. Release O2 (Blue). Take in CO2 (Grey).
  // Net < -5: Respiration Dominant. Release CO2 (Grey). Take in O2 (Blue).
  // Else: None.

  // Simplified for Visual Clarity:
  // If Photo > Resp: Show Blue Bubbles Rising (Production). Show Grey Bubbles Sinking (Intake).
  // If Resp > Photo: Show Grey Bubbles Rising (Production). Show Blue Bubbles Sinking (Intake).

  const isPhotoDominant = netExchange > 5;
  const isRespDominant = netExchange < -5;

  return (
    <div className="relative w-48 h-80 md:w-64 md:h-96">
      {/* Test Tube Glass Container */}
      <div className="absolute inset-0 w-full h-full rounded-b-full border-4 border-slate-300/50 bg-slate-800/10 backdrop-blur-sm overflow-hidden z-10 shadow-xl border-t-0">
        
        {/* Liquid Layer */}
        <div 
          className="absolute bottom-0 w-full h-[90%] transition-colors duration-1000 ease-in-out opacity-80"
          style={{ backgroundColor: indicatorColor }}
        >
          {/* Bubbles Layer */}
          <div className="absolute inset-0 overflow-hidden">
             {/* O2 Bubbles (Blue) - Rising if Photo Dominant, Sinking if Resp Dominant (Intake) */}
             {isPhotoDominant && [...Array(8)].map((_, i) => (
               <div 
                 key={`o2-rise-${i}`} 
                 className="absolute w-3 h-3 rounded-full bg-cyan-200 border border-white/50 shadow-sm animate-rise"
                 style={{ 
                   left: `${20 + Math.random() * 60}%`, 
                   bottom: '20%',
                   animationDelay: `${Math.random() * 2}s`,
                   animationDuration: `${3 + Math.random()}s`
                 }}
               />
             ))}
             {isRespDominant && [...Array(5)].map((_, i) => (
                <div 
                key={`o2-sink-${i}`} 
                className="absolute w-3 h-3 rounded-full bg-cyan-200 border border-white/50 shadow-sm animate-sink"
                style={{ 
                  left: `${10 + Math.random() * 80}%`, 
                  top: '0%',
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${4 + Math.random()}s`
                }}
              />
             ))}

             {/* CO2 Bubbles (Grey) - Sinking if Photo Dominant (Intake), Rising if Resp Dominant */}
             {isPhotoDominant && [...Array(5)].map((_, i) => (
               <div 
                 key={`co2-sink-${i}`} 
                 className="absolute w-2 h-2 rounded-full bg-gray-600 border border-gray-400 animate-sink"
                 style={{ 
                   left: `${10 + Math.random() * 80}%`, 
                   top: '0%',
                   animationDelay: `${Math.random() * 2}s` 
                 }}
               />
             ))}
             {isRespDominant && [...Array(8)].map((_, i) => (
               <div 
                 key={`co2-rise-${i}`} 
                 className="absolute w-2 h-2 rounded-full bg-gray-600 border border-gray-400 animate-rise"
                 style={{ 
                    left: `${20 + Math.random() * 60}%`, 
                    bottom: '20%',
                    animationDelay: `${Math.random() * 2}s` 
                 }}
               />
             ))}
          </div>
        </div>

        {/* Aquatic Plant SVG */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-48 opacity-90">
             <svg viewBox="0 0 100 150" fill="none" stroke="currentColor" className="text-green-800 w-full h-full drop-shadow-lg">
                <path d="M50 140 Q 60 100 50 80 Q 40 60 50 40" strokeWidth="4" strokeLinecap="round" />
                <path d="M50 120 Q 20 100 30 70" strokeWidth="3" strokeLinecap="round" />
                <path d="M50 100 Q 80 80 70 50" strokeWidth="3" strokeLinecap="round" />
                <path d="M50 60 Q 30 40 40 20" strokeWidth="2" strokeLinecap="round" />
                
                {/* Leaves */}
                <ellipse cx="30" cy="70" rx="10" ry="5" fill="#15803d" stroke="none" transform="rotate(-30 30 70)" />
                <ellipse cx="70" cy="50" rx="10" ry="5" fill="#16a34a" stroke="none" transform="rotate(30 70 50)" />
                <ellipse cx="40" cy="20" rx="8" ry="4" fill="#22c55e" stroke="none" transform="rotate(-45 40 20)" />
                <ellipse cx="50" cy="40" rx="8" ry="4" fill="#15803d" stroke="none" />
             </svg>
        </div>

        {/* Shine / Reflection on Glass */}
        <div className="absolute top-0 left-4 w-4 h-full bg-gradient-to-b from-white/20 to-transparent rounded-full blur-[2px]"></div>

      </div>
      
      {/* Test Tube Rim */}
      <div className="absolute top-0 w-full h-8 border-4 border-slate-300 bg-slate-200/20 rounded-full -translate-y-1/2 z-20 shadow-sm"></div>
    </div>
  );
};
