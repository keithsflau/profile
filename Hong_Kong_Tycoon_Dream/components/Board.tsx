
import React from 'react';
import { BoardSpace, Player, SpaceType, ColorGroup, RentPayment } from '../types';

interface Props {
  spaces: BoardSpace[];
  players: Player[];
  rentPayment: RentPayment | null;
}

const getColorClass = (group: ColorGroup) => {
  switch (group) {
    case ColorGroup.BROWN: return 'bg-amber-900 text-white';
    case ColorGroup.LIGHT_BLUE: return 'bg-sky-300 text-black';
    case ColorGroup.PINK: return 'bg-pink-400 text-black';
    case ColorGroup.ORANGE: return 'bg-orange-500 text-white';
    case ColorGroup.RED: return 'bg-red-600 text-white';
    case ColorGroup.YELLOW: return 'bg-yellow-400 text-black';
    case ColorGroup.GREEN: return 'bg-green-600 text-white';
    case ColorGroup.DARK_BLUE: return 'bg-blue-800 text-white';
    default: return 'bg-slate-200 text-slate-900';
  }
};

const RentNotification: React.FC<{ payment: RentPayment; players: Player[] }> = ({ payment, players }) => {
  const payer = players.find(p => p.id === payment.payerId);
  const receiver = players.find(p => p.id === payment.receiverId);

  if (!payer || !receiver) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-xl shadow-2xl flex items-center gap-8 border-4 border-slate-800 min-w-[300px] justify-between relative overflow-hidden">
        
        {/* Payer */}
        <div className="flex flex-col items-center z-10">
          <div className={`w-12 h-12 rounded-full ${payer.color} border-4 border-white shadow-md mb-2`}></div>
          <div className="font-bold text-slate-900">{payer.name}</div>
          <div className="text-red-600 font-mono font-bold text-lg">-${payment.amount}</div>
        </div>

        {/* Moving Money Animation */}
        <div className="flex-1 flex flex-col items-center justify-center relative h-12 w-32">
             <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-4">支付租金 (Rent)</div>
             
             {/* Flying Bills */}
             <div className="absolute animate-[flyRight_1.5s_ease-in-out_infinite] text-2xl text-green-600">💸</div>
             <div className="absolute animate-[flyRight_1.5s_ease-in-out_0.2s_infinite] text-2xl text-green-600 opacity-70" style={{top: '10px'}}>💵</div>
             <div className="absolute animate-[flyRight_1.5s_ease-in-out_0.4s_infinite] text-2xl text-green-600 opacity-50" style={{bottom: '5px'}}>💰</div>
        </div>

        {/* Receiver */}
        <div className="flex flex-col items-center z-10">
          <div className={`w-12 h-12 rounded-full ${receiver.color} border-4 border-white shadow-md mb-2`}></div>
          <div className="font-bold text-slate-900">{receiver.name}</div>
          <div className="text-green-600 font-mono font-bold text-lg">+${payment.amount}</div>
        </div>

      </div>
      
      {/* CSS for custom keyframes just for this component */}
      <style>{`
        @keyframes flyRight {
          0% { transform: translateX(-40px) scale(0.5); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateX(40px) scale(1); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

const Space: React.FC<{ space: BoardSpace; players: Player[] }> = ({ space, players }) => {
  const currentPlayers = players.filter(p => p.position === space.id && !p.bankrupt);
  
  // Special visual handling for corners
  const isCorner = space.id % 10 === 0;

  return (
    <div className={`relative border border-slate-800 flex flex-col items-center justify-between ${isCorner ? 'col-span-1 row-span-1' : ''} h-full w-full bg-white overflow-hidden text-[10px] sm:text-xs select-none z-10`}>
      {/* Color Bar for Properties */}
      {space.type === SpaceType.PROPERTY && (
        <div className={`w-full h-1/4 ${getColorClass(space.group)} border-b border-slate-800 relative`}>
          {/* House/Hotel Indicators */}
          {space.houses > 0 && space.houses < 5 && (
            <div className="absolute inset-0 flex items-center justify-center gap-0.5">
              {[...Array(space.houses)].map((_, i) => (
                <div key={i} className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 border border-white shadow-sm rounded-sm transform rotate-45 translate-y-1"></div>
              ))}
            </div>
          )}
          {space.houses === 5 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-3 sm:w-6 sm:h-4 bg-red-600 border border-white shadow-sm rounded-sm flex items-center justify-center">
                <span className="text-[8px] text-white leading-none font-bold">H</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col items-center justify-center flex-grow p-1 text-center w-full z-10">
        <span className="font-bold leading-tight text-slate-900 drop-shadow-sm">{space.name}</span>
        {space.price && <span className="text-slate-700 font-semibold mt-0.5">${space.price}</span>}
        
        {/* Owner Indicator */}
        {space.ownerId !== undefined && (
             <div className={`w-3 h-3 rounded-full mt-1 border border-slate-400 ${players.find(p => p.id === space.ownerId)?.color || 'bg-gray-500'}`} title={`Owned by Player ${space.ownerId}`} />
        )}
        
        {/* Icons for special spaces */}
        {space.type === SpaceType.CHANCE && <span className="text-2xl text-red-600 font-black">?</span>}
        {space.type === SpaceType.COMMUNITY && <span className="text-2xl text-blue-600 font-black">📦</span>}
        {space.type === SpaceType.STATION && <span className="text-xl">🚂</span>}
        {space.type === SpaceType.UTILITY && <span className="text-xl">⚡</span>}
      </div>

      {/* Players on space */}
      <div className="absolute bottom-1 left-0 w-full flex justify-center space-x-1 p-1 z-20">
        {currentPlayers.map(p => (
          <div key={p.id} className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white shadow-lg ${p.color}`} title={p.name}></div>
        ))}
      </div>
    </div>
  );
};

export const Board: React.FC<Props> = ({ spaces, players, rentPayment }) => {
  // We need to map the linear array of 40 spaces to a grid
  // Grid is 11x11.
  // Bottom: 10 -> 0 (Left to Right in grid is 0->10, so reverse the slice)
  // Left: 19 -> 11
  // Top: 20 -> 30
  // Right: 31 -> 39
  
  const bottomRow = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
  const leftCol = [19, 18, 17, 16, 15, 14, 13, 12, 11];
  const topRow = [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
  const rightCol = [31, 32, 33, 34, 35, 36, 37, 38, 39];

  return (
    <div className="relative w-full h-full">
      {/* Rent Payment Overlay */}
      {rentPayment && <RentNotification payment={rentPayment} players={players} />}

      <div className="grid grid-cols-11 grid-rows-11 gap-0 w-full h-full aspect-square border-4 border-slate-900 bg-slate-100 shadow-2xl relative">
        {/* Center Logo Overlay - Absolutely positioned to cover the 9x9 inner area */}
        <div className="absolute top-[9.09%] left-[9.09%] right-[9.09%] bottom-[9.09%] flex items-center justify-center bg-emerald-50/30 pointer-events-none z-0 overflow-hidden">
            <div className="transform -rotate-45 flex flex-col items-center justify-center leading-none opacity-20">
              <span className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 whitespace-nowrap select-none">香江</span>
              <span className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 whitespace-nowrap select-none">富豪夢</span>
            </div>
        </div>

        {/* Top Row */}
        {topRow.map((id) => <Space key={id} space={spaces[id]} players={players} />)}

        {/* Middle Section */}
        {/* We render 9 rows. In each row: Left Col cell, 9 empty cells (center), Right Col cell */}
        {leftCol.map((leftId, index) => {
          const rightId = rightCol[index];
          return (
              <React.Fragment key={`row-${index}`}>
                  <Space space={spaces[leftId]} players={players} />
                  <div className="col-span-9"></div> {/* Transparent filler to maintain grid layout, background is handled by absolute div */}
                  <Space space={spaces[rightId]} players={players} />
              </React.Fragment>
          );
        })}

        {/* Bottom Row */}
        {bottomRow.map((id) => <Space key={id} space={spaces[id]} players={players} />)}
      </div>
    </div>
  );
};
