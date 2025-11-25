import React, { useMemo } from 'react';
import { SimulationState } from '../types';
import { TestTube } from './TestTube';

interface SimulationProps {
  time: number;
  simState: SimulationState;
}

export const Simulation: React.FC<SimulationProps> = ({ time, simState }) => {
  
  // Calculate Sky Color based on time
  const getSkyGradient = () => {
    // Night
    if (time < 5 || time > 20) return 'bg-slate-900';
    // Dawn/Dusk transitions could be complex, but let's do a simple interpolation logic or predefined classes
    // We will use inline styles for smooth interpolation
    
    // Simple logic:
    // Midnight (0): Dark Blue/Black
    // Noon (12): Bright Blue
    
    // Normalized distance from noon (0 to 12)
    const distFromNoon = Math.abs(12 - time);
    const darkness = Math.min(1, distFromNoon / 8); // 0 at noon, 1 at +/- 8 hours from noon
    
    // Interpolate roughly between #0f172a (Slate 900) and #38bdf8 (Sky 400)
    // Using HSL for easier math: Sky 400 is roughly 200deg, 98%, 60%. Slate 900 is 222deg, 47%, 11%.
    
    const h = 200 + (22 * darkness);
    const s = 98 - (51 * darkness);
    const l = 60 - (49 * darkness);
    
    return `hsl(${h}, ${s}%, ${l}%)`;
  };

  const skyStyle = { backgroundColor: getSkyGradient(), transition: 'background-color 0.5s linear' };

  // Sun / Moon Position
  // Path: Semi-circle or full circle. Let's do a simple arc.
  // 06:00 -> Left Horizon. 12:00 -> Top Center. 18:00 -> Right Horizon.
  // Moon opposite.
  
  const getCelestialPosition = (offset: number) => {
    // Current rotation in degrees. 0 = Midnight (Bottom), 180 = Noon (Top)
    // Actually let's just map 0-24 to 0-360 degrees
    const deg = ((time + offset) / 24) * 360 + 90; // +90 to start at bottom for 00:00?
    // Let's use simple CSS rotation for the orbit container
    return deg;
  };

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden" style={skyStyle}>
      {/* Stars (Only visible when dark) */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{ opacity: time > 6 && time < 18 ? 0 : 1 }}
      >
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              opacity: Math.random()
            }}
          />
        ))}
      </div>

      {/* Celestial Container - Rotates around center bottom of the viewport roughly, or center screen */}
      <div 
        className="absolute top-[50%] left-[50%] w-[80vw] h-[80vw] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ 
          transform: `translate(-50%, 50%) rotate(${((time - 6) / 24) * 360}deg)`,
          transition: 'transform 0.1s linear'
        }}
      >
        {/* Sun */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
           <div className="w-16 h-16 md:w-24 md:h-24 bg-yellow-400 rounded-full blur-xl absolute opacity-50"></div>
           <div className="w-16 h-16 md:w-24 md:h-24 bg-yellow-300 rounded-full shadow-2xl relative flex items-center justify-center">
              <span className="text-yellow-600 font-bold opacity-0">Sun</span>
           </div>
        </div>

        {/* Moon (Opposite side) */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-180">
           <div className="w-12 h-12 md:w-20 md:h-20 bg-slate-200 rounded-full shadow-[inset_-10px_0px_20px_rgba(0,0,0,0.2)] relative">
           </div>
        </div>
      </div>

      {/* Foreground / Lab Bench */}
      <div className="absolute bottom-0 w-full h-24 bg-slate-800 border-t border-slate-700 flex items-center justify-center z-10">
         <div className="text-slate-500 text-sm font-mono tracking-widest uppercase">Laboratory Simulation Environment</div>
      </div>

      {/* Main Subject: Test Tube */}
      <div className="absolute inset-0 flex items-end justify-center pb-12 z-20">
        <TestTube simState={simState} />
      </div>

    </div>
  );
};
