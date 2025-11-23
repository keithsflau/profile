import clsx from "classnames";
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
}

export const Board = ({
  spaces,
  players,
  propertyStates,
  selectedSpace,
  onSelectSpace,
}: BoardProps) => {
  const tokensBySpace = players.reduce<Record<number, PlayerState[]>>(
    (acc, player) => {
      if (!acc[player.position]) acc[player.position] = [];
      acc[player.position].push(player);
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
                return (
                  <span
                    key={p.id}
                    className="player-token"
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

