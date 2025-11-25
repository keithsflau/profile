import React from 'react';
import { SimulationState } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { calculateRates } from '../utils/biology';

interface DashboardProps {
  time: number;
  simState: SimulationState;
}

export const Dashboard: React.FC<DashboardProps> = ({ time, simState }) => {
  const { photosynthesisRate, respirationRate, netExchange, indicatorColor, statusMessage } = simState;

  // Generate data for the chart (0 to 24 hours)
  const chartData = React.useMemo(() => {
    const data = [];
    for (let t = 0; t <= 24; t += 1) {
      const rates = calculateRates(t);
      data.push({
        time: t,
        photosynthesis: rates.photosynthesisRate,
        respiration: rates.respirationRate,
        net: rates.netExchange
      });
    }
    return data;
  }, []);

  return (
    <div className="space-y-8 text-slate-200">
      
      {/* Status Card */}
      <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600 shadow-sm">
        <h2 className="text-sm uppercase tracking-wider text-slate-400 font-semibold mb-2">Current Status</h2>
        <div className="flex items-center gap-4">
           <div 
             className="w-12 h-12 rounded-full border-4 border-slate-600 shadow-inner shrink-0" 
             style={{ backgroundColor: indicatorColor, transition: 'background-color 0.5s' }} 
           />
           <div>
              <div className="text-lg font-bold leading-tight">{statusMessage}</div>
              <div className="text-xs text-slate-400 mt-1">Indicator Color reflects CO₂ concentration</div>
           </div>
        </div>
      </div>

      {/* Gauges */}
      <div className="grid grid-cols-1 gap-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-green-400 font-medium">Photosynthesis Rate</span>
            <span className="font-mono">{Math.round(photosynthesisRate)} a.u.</span>
          </div>
          <div className="h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
            <div 
              className="h-full bg-green-500 transition-all duration-300" 
              style={{ width: `${photosynthesisRate}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-orange-400 font-medium">Respiration Rate</span>
            <span className="font-mono">{Math.round(respirationRate)} a.u.</span>
          </div>
          <div className="h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
            <div 
              className="h-full bg-orange-500 transition-all duration-300" 
              style={{ width: `${(respirationRate / 100) * 100}%` }} // Scaling respiration to chart max
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-cyan-400 font-medium">Net Gas Exchange</span>
            <span className="font-mono">{Math.round(netExchange)} a.u.</span>
          </div>
           {/* Bi-directional Bar for Net Exchange */}
          <div className="relative h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
            {/* Center Marker */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/20 z-10"></div>
            {/* Bar */}
            <div 
              className={`absolute top-0 bottom-0 transition-all duration-300 ${netExchange > 0 ? 'bg-cyan-500 left-1/2' : 'bg-yellow-500 right-1/2'}`}
              style={{ 
                width: `${Math.abs(netExchange) / 1.5}%`, // Scale factor for visual fit
                left: netExchange > 0 ? '50%' : 'auto',
                right: netExchange < 0 ? '50%' : 'auto'
              }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>Net Output (CO₂)</span>
            <span>Net Uptake (CO₂)</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-48 w-full bg-slate-900/50 rounded-xl p-2 border border-slate-700/50">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPhoto" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickFormatter={(val) => `${val}h`} />
            <YAxis stroke="#64748b" fontSize={10} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
              itemStyle={{ fontSize: '12px' }}
              labelFormatter={(label) => `Time: ${label}:00`}
            />
            <Area 
              type="monotone" 
              dataKey="photosynthesis" 
              name="Photosynthesis"
              stroke="#22c55e" 
              fillOpacity={1} 
              fill="url(#colorPhoto)" 
            />
            <Area 
              type="monotone" 
              dataKey="respiration" 
              name="Respiration"
              stroke="#f97316" 
              fill="none" 
              strokeDasharray="5 5"
            />
            <ReferenceLine x={time} stroke="#38bdf8" strokeDasharray="3 3" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-2 text-xs text-center border-t border-slate-700 pt-4">
         <div className="flex flex-col items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
            <span className="text-slate-400">High CO₂<br/>(Acidic)</span>
         </div>
         <div className="flex flex-col items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="text-slate-400">Normal CO₂<br/>(Neutral)</span>
         </div>
         <div className="flex flex-col items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-purple-500"></div>
            <span className="text-slate-400">Low CO₂<br/>(Alkaline)</span>
         </div>
      </div>

    </div>
  );
};
