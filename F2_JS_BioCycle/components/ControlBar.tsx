import React from 'react';
import { Play, Pause, Sun, Moon } from 'lucide-react';

interface ControlBarProps {
  time: number;
  setTime: (t: number) => void;
  isPlaying: boolean;
  setIsPlaying: (p: boolean) => void;
}

export const ControlBar: React.FC<ControlBarProps> = ({ time, setTime, isPlaying, setIsPlaying }) => {
  const formatTime = (t: number) => {
    const hours = Math.floor(t);
    const minutes = Math.floor((t - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-white hidden sm:block">BioCycle</h1>
        <div className="bg-slate-700 px-3 py-1 rounded-md font-mono text-cyan-300 font-bold border border-slate-600">
          {formatTime(time)}
        </div>
      </div>

      <div className="flex items-center gap-4 flex-1 max-w-xl mx-8">
        <Moon className="w-5 h-5 text-slate-400" />
        <input
          type="range"
          min="0"
          max="24"
          step="0.1"
          value={time}
          onChange={(e) => {
            setIsPlaying(false);
            setTime(parseFloat(e.target.value));
          }}
          className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300 transition-all"
        />
        <Sun className="w-5 h-5 text-yellow-400" />
      </div>

      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg active:scale-95"
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Auto Cycle'}</span>
      </button>
    </div>
  );
};
