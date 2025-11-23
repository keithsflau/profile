import React, { useState, useEffect } from 'react';
import { Simulation } from './components/Simulation';
import { Dashboard } from './components/Dashboard';
import { ControlBar } from './components/ControlBar';
import { calculateRates } from './utils/biology';
import { SimulationState } from './types';

const App: React.FC = () => {
  // Time in hours (0-24)
  const [time, setTime] = useState<number>(12);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [simState, setSimState] = useState<SimulationState>(calculateRates(12));

  // Update simulation state whenever time changes
  useEffect(() => {
    setSimState(calculateRates(time));
  }, [time]);

  // Auto-play loop
  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setTime((prev) => {
          const next = prev + 0.1;
          return next >= 24 ? 0 : next;
        });
      }, 100); // Speed of simulation
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="h-screen w-full flex flex-col bg-slate-900 text-white overflow-hidden">
      {/* Top Header & Controls */}
      <header className="flex-none z-20 bg-slate-800 border-b border-slate-700 shadow-md">
        <ControlBar time={time} setTime={setTime} isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:flex-row relative overflow-hidden">
        
        {/* Left/Top: Visual Simulation */}
        <section className="relative flex-1 h-[50vh] md:h-auto min-h-[400px]">
          <Simulation time={time} simState={simState} />
        </section>

        {/* Right/Bottom: Dashboard Data */}
        <aside className="flex-none md:w-[400px] bg-slate-800/90 backdrop-blur-md border-t md:border-t-0 md:border-l border-slate-700 p-6 overflow-y-auto z-10 h-[50vh] md:h-auto">
          <Dashboard time={time} simState={simState} />
        </aside>

      </main>
    </div>
  );
};

export default App;