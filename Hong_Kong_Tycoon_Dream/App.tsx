
import React from 'react';
import { useGame } from './hooks/useGame';
import { Board } from './components/Board';
import { Controls } from './components/Controls';

export default function App() {
  const { 
    state, 
    nextTurn, 
    rollDice, 
    handleBuyProperty, 
    handleUpgradeProperty,
    handlePayRent,
    handlePayTax,
    handleJailDecision,
    drawCard,
    addLog,
    startGame
  } = useGame();

  // Setup Screen Component
  if (state.gamePhase === 'SETUP') {
      return (
          <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center space-y-8">
                  <div>
                      <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-red-600 mb-2">
                          香江富豪夢
                      </h1>
                      <p className="text-slate-500 text-sm tracking-widest uppercase">Hong Kong Tycoon Dream</p>
                  </div>
                  
                  <div className="space-y-4">
                      <p className="text-slate-700 font-bold text-lg">請選擇玩家人數</p>
                      <div className="grid grid-cols-1 gap-3">
                          {[2, 3, 4].map(num => (
                              <button 
                                  key={num}
                                  onClick={() => startGame(num)}
                                  className="w-full py-4 rounded-lg border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all font-bold text-slate-700 text-xl flex items-center justify-center gap-2 group"
                              >
                                  <span className="group-hover:scale-110 transition-transform">{num} 人遊戲</span>
                                  <span className="text-sm text-slate-400 font-normal">({num} Players)</span>
                              </button>
                          ))}
                      </div>
                  </div>
                  
                  <div className="text-xs text-slate-400 mt-8">
                      準備好成為香港首富了嗎？
                  </div>
              </div>
          </div>
      );
  }

  // Handle the "Pass" action for buying property
  const handlePass = () => {
      addLog(`${state.players[state.currentPlayerIndex].name} 決定不購買此物業。`);
      nextTurn(); 
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row items-center justify-center p-2 lg:p-8 gap-8">
      
      {/* Game Board Area */}
      <div className="w-full max-w-[85vh] aspect-square flex-shrink-0 shadow-2xl rounded-sm overflow-hidden border-8 border-slate-800 relative">
        <Board spaces={state.spaces} players={state.players} rentPayment={state.rentPayment} />
      </div>

      {/* Sidebar Controls */}
      <div className="w-full lg:w-96 flex flex-col gap-4 h-full max-h-[85vh]">
        <div className="hidden lg:block text-center lg:text-left mb-2 flex-shrink-0">
            <h1 className="text-3xl font-black text-white">
            香江富豪夢
            </h1>
            <p className="text-slate-400 text-xs tracking-wider">
            HONG KONG TYCOON DREAM
            </p>
        </div>

        <Controls 
            state={state}
            onRoll={rollDice}
            onEndTurn={nextTurn}
            onBuy={handleBuyProperty}
            onUpgrade={handleUpgradeProperty}
            onPay={() => {
                if (state.pendingAction?.type === 'PAY_RENT') handlePayRent();
                if (state.pendingAction?.type === 'PAY_TAX') handlePayTax();
            }}
            onDraw={drawCard}
            onPass={handlePass}
            onJailAction={handleJailDecision}
        />
        
        {/* Player List Stats */}
        <div className="bg-slate-900 rounded-lg p-4 mt-auto border border-slate-800 shadow-xl flex-shrink-0">
            <h3 className="text-slate-400 text-xs font-bold mb-3 uppercase tracking-wider border-b border-slate-800 pb-2">富豪榜 (Leaderboard)</h3>
            <div className="space-y-2">
                {state.players.map(p => (
                    <div key={p.id} className={`flex justify-between items-center p-3 rounded-lg transition-all ${p.id === state.currentPlayerIndex ? 'bg-slate-800 border border-slate-600 ring-1 ring-slate-500' : 'hover:bg-slate-800/50'} ${p.bankrupt ? 'opacity-30 grayscale' : ''}`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full ${p.color} ring-2 ring-slate-900`}></div>
                            <div>
                                <div className="text-sm font-bold text-slate-200 leading-none">{p.name}</div>
                                <div className="text-[10px] text-slate-500 mt-1">
                                    {p.isJailed ? '坐監中' : p.bankrupt ? '已破產' : '活躍中'}
                                </div>
                            </div>
                        </div>
                        <span className="font-mono text-yellow-500 font-bold">${p.money}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
