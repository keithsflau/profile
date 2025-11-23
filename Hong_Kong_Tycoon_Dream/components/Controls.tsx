
import React, { useState } from 'react';
import { GameState, SpaceType, ColorGroup } from '../types';
import { JAIL_FINE } from '../constants';

interface Props {
  state: GameState;
  onRoll: () => void;
  onEndTurn: () => void;
  onBuy: () => void;
  onPay: () => void;
  onDraw: () => void;
  onPass: () => void;
  onUpgrade: (spaceId: number) => void;
  onJailAction: (action: 'PAY' | 'CARD') => void;
}

export const Controls: React.FC<Props> = ({ state, onRoll, onEndTurn, onBuy, onPay, onDraw, onPass, onUpgrade, onJailAction }) => {
  const currentPlayer = state.players[state.currentPlayerIndex];
  const space = state.spaces[currentPlayer.position];
  const [showProperties, setShowProperties] = useState(false);

  // Filter properties owned by current player and group them
  const ownedProperties = state.spaces.filter(s => s.ownerId === currentPlayer.id && s.type === SpaceType.PROPERTY);
  
  // Identify groups where player owns all properties
  const completeGroups = Object.values(ColorGroup).filter(group => {
     if (group === ColorGroup.NONE) return false;
     const groupSpaces = state.spaces.filter(s => s.group === group);
     return groupSpaces.length > 0 && groupSpaces.every(s => s.ownerId === currentPlayer.id);
  });

  const canUpgrade = (s: typeof state.spaces[0]) => {
     // Logic repeated from hook for UI state, ideally should be shared or simpler
     if (!completeGroups.includes(s.group)) return false;
     if (s.houses >= 5) return false;
     if (currentPlayer.money < (s.houseCost || 0)) return false;
     
     const groupSpaces = state.spaces.filter(gs => gs.group === s.group);
     
     // Cannot build if any property in the group is mortgaged
     if (groupSpaces.some(gs => gs.isMortgaged)) return false;

     const minHouses = Math.min(...groupSpaces.map(gs => gs.houses));
     return s.houses <= minHouses; // Allow building if it maintains evenness (equal to min)
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-slate-800 rounded-lg shadow-xl text-white w-full max-w-md mx-auto mt-4 md:mt-0 border border-slate-700 h-full overflow-hidden">
      {/* Status Header */}
      <div className="flex justify-between items-center border-b border-slate-600 pb-3 flex-shrink-0">
        <div>
          <div className="text-xs uppercase tracking-widest text-slate-300 mb-1">當前回合 (Current Turn)</div>
          <div className={`font-bold text-2xl flex items-center gap-2 text-white`}>
            <span className={`w-4 h-4 rounded-full ${currentPlayer.color} border border-white`}></span>
            {currentPlayer.name}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-widest text-slate-300 mb-1">現金 (Cash)</div>
          <div className="font-mono text-2xl text-yellow-400 font-bold">${currentPlayer.money}</div>
        </div>
      </div>

      {/* Dice Display */}
      <div className="flex justify-center gap-4 py-2 flex-shrink-0">
        <div className="w-14 h-14 bg-slate-100 text-slate-900 rounded-lg flex items-center justify-center text-3xl font-black shadow-lg border-b-4 border-slate-300">
          {state.dice[0]}
        </div>
        <div className="w-14 h-14 bg-slate-100 text-slate-900 rounded-lg flex items-center justify-center text-3xl font-black shadow-lg border-b-4 border-slate-300">
          {state.dice[1]}
        </div>
      </div>
      {state.isDoubles && <div className="text-center text-yellow-300 font-bold text-sm animate-pulse flex-shrink-0">✨ 孖寶! (Doubles) ✨</div>}

      {/* Scrollable Content Area */}
      <div className="flex-grow overflow-y-auto pr-1 space-y-3 min-h-0">
          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            {state.gamePhase === 'ROLL' && (
              <button 
                onClick={onRoll}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg font-bold text-white shadow-lg hover:from-emerald-400 hover:to-green-500 transform transition hover:-translate-y-0.5"
              >
                擲骰子 (Roll)
              </button>
            )}

            {state.gamePhase === 'ACTION' && state.pendingAction?.type === 'JAIL_DECISION' && (
              <div className="space-y-2">
                <div className="text-center text-orange-400 font-bold text-sm">你在赤柱監獄中，請選擇：</div>
                <button 
                  onClick={onRoll}
                  className="w-full py-3 bg-blue-600 rounded-lg font-bold hover:bg-blue-500 shadow-md"
                >
                  嘗試擲孖寶 (剩餘 {3 - currentPlayer.jailTurns} 次)
                </button>
                
                <button 
                  onClick={() => onJailAction('PAY')}
                  disabled={currentPlayer.money < JAIL_FINE}
                  className="w-full py-3 bg-red-600 rounded-lg font-bold hover:bg-red-500 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  支付罰金 ${JAIL_FINE}
                </button>
                
                <button 
                  onClick={() => onJailAction('CARD')}
                  disabled={currentPlayer.getOutOfJailFreeCards <= 0}
                  className="w-full py-3 bg-purple-600 rounded-lg font-bold hover:bg-purple-500 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  使用保釋卡 ({currentPlayer.getOutOfJailFreeCards})
                </button>
              </div>
            )}

            {state.gamePhase === 'ACTION' && state.pendingAction?.type === 'BUY_PROPERTY' && (
              <div className="flex gap-3">
                  <button onClick={onBuy} className="flex-1 py-3 bg-blue-600 rounded-lg font-bold hover:bg-blue-500 shadow-md">
                    購買 (${space.price})
                  </button>
                  <button onClick={onPass} className="flex-1 py-3 bg-slate-600 rounded-lg font-bold hover:bg-slate-500 shadow-md">
                    放棄
                  </button>
              </div>
            )}

            {state.gamePhase === 'ACTION' && state.pendingAction?.type === 'PAY_RENT' && (
              <button onClick={onPay} className="w-full py-3 bg-red-600 rounded-lg font-bold animate-pulse hover:bg-red-500 shadow-md">
                支付租金 ${state.pendingAction.data.amount}
              </button>
            )}

            {state.gamePhase === 'ACTION' && state.pendingAction?.type === 'PAY_TAX' && (
              <button onClick={onPay} className="w-full py-3 bg-orange-600 rounded-lg font-bold hover:bg-orange-500 shadow-md">
                繳交稅款 ${state.pendingAction.data.amount}
              </button>
            )}

            {state.gamePhase === 'ACTION' && state.pendingAction?.type === 'CARD_EFFECT' && (
              <button onClick={onDraw} className="w-full py-3 bg-purple-600 rounded-lg font-bold hover:bg-purple-500 shadow-md">
                抽取卡牌
              </button>
            )}

            {state.gamePhase === 'END_TURN' && (
              <button 
                onClick={onEndTurn}
                className="w-full py-3 bg-slate-600 rounded-lg font-bold hover:bg-slate-500 shadow-md text-slate-100"
              >
                結束回合 (End Turn)
              </button>
            )}
          </div>

          {/* Property Management - Only visible on own turn */}
          {ownedProperties.length > 0 && (
              <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                  <button 
                    onClick={() => setShowProperties(!showProperties)}
                    className="w-full flex justify-between items-center text-sm font-bold text-slate-300 hover:text-white mb-2"
                  >
                      <span>物業管理 ({ownedProperties.length})</span>
                      <span>{showProperties ? '▼' : '▶'}</span>
                  </button>
                  
                  {showProperties && (
                      <div className="space-y-2 max-h-40 overflow-y-auto text-xs">
                          {ownedProperties.map(prop => {
                              const upgradeable = canUpgrade(prop);
                              return (
                                  <div key={prop.id} className="flex justify-between items-center bg-slate-800 p-2 rounded border border-slate-700">
                                      <div className="flex items-center gap-2">
                                          <div className={`w-3 h-3 rounded-sm ${getBgColor(prop.group)}`}></div>
                                          <span className="truncate max-w-[100px]">{prop.name}</span>
                                          {prop.houses > 0 && (
                                              <span className="bg-green-900 text-green-300 px-1.5 rounded text-[10px]">
                                                  {prop.houses === 5 ? 'Hotel' : `🏠 ${prop.houses}`}
                                              </span>
                                          )}
                                      </div>
                                      {upgradeable && (
                                          <button 
                                              onClick={() => onUpgrade(prop.id)}
                                              className="bg-green-600 hover:bg-green-500 text-white px-2 py-1 rounded text-[10px] font-bold"
                                          >
                                              +🏠 ${prop.houseCost}
                                          </button>
                                      )}
                                  </div>
                              );
                          })}
                      </div>
                  )}
              </div>
          )}

          {/* Game Log */}
          <div className="bg-slate-950 p-3 rounded-lg h-32 overflow-y-auto text-xs font-mono space-y-2 border border-slate-700 shadow-inner flex-shrink-0">
            {state.log.map((entry, i) => (
              <div key={i} className="border-b border-slate-800 pb-1 text-slate-300 last:border-0">{entry}</div>
            ))}
          </div>
      </div>
    </div>
  );
};

function getBgColor(group: ColorGroup) {
  switch (group) {
    case ColorGroup.BROWN: return 'bg-amber-900';
    case ColorGroup.LIGHT_BLUE: return 'bg-sky-300';
    case ColorGroup.PINK: return 'bg-pink-400';
    case ColorGroup.ORANGE: return 'bg-orange-500';
    case ColorGroup.RED: return 'bg-red-600';
    case ColorGroup.YELLOW: return 'bg-yellow-400';
    case ColorGroup.GREEN: return 'bg-green-600';
    case ColorGroup.DARK_BLUE: return 'bg-blue-800';
    default: return 'bg-gray-500';
  }
}
