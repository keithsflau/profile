import clsx from "classnames";
import { useEffect, useState } from "react";
import type { BoardSpace, PlayerState, PropertyState } from "../types";

const GRID_SIZE = 11;

const colorSwatches: Record<string, string> = {
  "草綠（字詞入門）": "#a3d977",
  "淺黃（語法運用）": "#ffe066",
  "淺藍（寓言詩詞）": "#7bdff2",
  "粉紅（部首挑戰）": "#ff6f91",
  "橙色（寫作練習）": "#ff9f1c",
  "紫色（文化傳承）": "#b084cc",
  "紅色（技巧提升）": "#ef476f",
  "深藍（高階語文）": "#26547c",
};

const chineseAncientIcons = [
  "👨‍🏫", // 老師
  "🎓",   // 學士帽
  "📜",   // 卷軸
  "🖋️",   // 毛筆
  "📚",   // 書籍
  "🏛️",   // 古典建築
  "🎭",   // 戲劇面具
  "⚱️",   // 古董
];

const getGridPosition = (index: number) => {
  const idx = index;
  if (idx <= 10) {
    return { row: GRID_SIZE, col: GRID_SIZE - idx };
  }
  if (idx <= 20) {
    return { row: GRID_SIZE - (idx - 10), col: 1 };
  }
  if (idx <= 30) {
    return { row: 1, col: idx - 20 + 1 };
  }
  return { row: idx - 30 + 1, col: GRID_SIZE };
};

interface BoardProps {
  spaces: BoardSpace[];
  players: PlayerState[];
  propertyStates: Record<number, PropertyState>;
  selectedSpace?: number;
  onSelectSpace: (spaceId: number) => void;
  lastDice?: [number, number];
  currentPlayerIndex?: number;
}

export const Board = ({
  spaces,
  players,
  propertyStates,
  selectedSpace,
  onSelectSpace,
  lastDice,
  currentPlayerIndex,
}: BoardProps) => {
  const [animatingPlayers, setAnimatingPlayers] = useState<Record<string, { from: number; to: number; progress: number }>>({});
  const [previousPositions, setPreviousPositions] = useState<Record<string, number>>({});

  // 檢測玩家位置變化並觸發動畫
  useEffect(() => {
    if (lastDice && currentPlayerIndex !== undefined && players.length > 0) {
      const currentPlayer = players[currentPlayerIndex];
      if (currentPlayer) {
        const prevPos = previousPositions[currentPlayer.id] ?? currentPlayer.position;
        if (prevPos !== currentPlayer.position) {
          // 計算實際步數（處理環形棋盤）
          let steps = currentPlayer.position - prevPos;
          if (steps < 0) {
            steps = spaces.length + steps; // 繞了一圈
          }
          
          // 開始動畫
          setAnimatingPlayers(prev => ({
            ...prev,
            [currentPlayer.id]: {
              from: prevPos,
              to: currentPlayer.position,
              progress: 0,
            },
          }));

          // 播放移動音效
          import("../utils/sound").then(({ playMoveSound, playLandSound }) => {
            playMoveSound();
            
            // 計算動畫時間（每步約80ms，最多2秒）
            const duration = Math.min(steps * 80, 2000);
            
            // 動畫進度更新
            const startTime = Date.now();
            const animate = () => {
              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / duration, 1);
              
              setAnimatingPlayers(prev => ({
                ...prev,
                [currentPlayer.id]: {
                  from: prevPos,
                  to: currentPlayer.position,
                  progress,
                },
              }));

              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                // 動畫完成，播放落地音效
                setTimeout(() => {
                  playLandSound();
                }, 50);
                setAnimatingPlayers(prev => {
                  const next = { ...prev };
                  delete next[currentPlayer.id];
                  return next;
                });
              }
            };
            
            requestAnimationFrame(animate);
          });
        }
        setPreviousPositions(prev => ({
          ...prev,
          [currentPlayer.id]: currentPlayer.position,
        }));
      }
    }
  }, [players, lastDice, currentPlayerIndex, spaces.length]);

  const tokensBySpace = players.reduce<Record<number, PlayerState[]>>(
    (acc, player) => {
      const animating = animatingPlayers[player.id];
      const displayPosition = animating 
        ? Math.round(animating.from + (animating.to - animating.from) * animating.progress)
        : player.position;
      
      if (!acc[displayPosition]) acc[displayPosition] = [];
      acc[displayPosition].push(player);
      return acc;
    },
    {}
  );

  return (
    <div className="board-grid">
      {spaces.map((space, idx) => {
        const pos = getGridPosition(idx);
        const occupants = tokensBySpace[space.id] ?? [];
        const state = propertyStates[space.id];
        return (
          <button
            key={space.id}
            className={clsx("board-tile", `tile-${space.type}`, {
              selected: selectedSpace === space.id,
            })}
            style={{
              gridRow: pos.row,
              gridColumn: pos.col,
              borderColor: space.color ? colorSwatches[space.color] : undefined,
            }}
            onClick={() => onSelectSpace(space.id)}
          >
            <span className="tile-name">{space.name}</span>
            {space.color && (
              <span
                className="tile-color"
                style={{ backgroundColor: colorSwatches[space.color] }}
              />
            )}
            {state && (state.houses > 0 || state.academy) && (
              <div className="tile-buildings">
                {state.academy ? (
                  <span className="academy">書院</span>
                ) : (
                  Array.from({ length: state.houses }).map((_, i) => (
                    <span key={i} className="house" />
                  ))
                )}
              </div>
            )}
            <div className="tile-players">
              {occupants.map((p) => {
                const playerIndex = players.findIndex(pl => pl.id === p.id);
                const icon = chineseAncientIcons[playerIndex % chineseAncientIcons.length];
                const isAnimating = animatingPlayers[p.id] !== undefined;
                return (
                  <span
                    key={p.id}
                    className={clsx("player-token", {
                      "player-moving": isAnimating,
                    })}
                    style={{ 
                      backgroundColor: p.color,
                      borderColor: p.color,
                    }}
                    title={p.name}
                  >
                    <span className="player-icon">{icon}</span>
                  </span>
                );
              })}
            </div>
          </button>
        );
      })}
      <div className="board-center">
        <h2>小學語文冒險家</h2>
        <p>點擊棋格可查看詳細資訊。</p>
        <p>擲骰、抽卡、建屋皆於右側面板操作。</p>
      </div>
    </div>
  );
};

