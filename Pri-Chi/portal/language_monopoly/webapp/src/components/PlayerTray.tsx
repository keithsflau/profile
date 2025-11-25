import clsx from "classnames";
import type { PlayerState } from "../types";

interface PlayerTrayProps {
  players: PlayerState[];
  currentIndex: number;
}

export const PlayerTray = ({ players, currentIndex }: PlayerTrayProps) => (
  <section className="panel player-tray">
    <h3>玩家狀態</h3>
    <div className="player-list">
      {players.map((player, index) => (
        <div
          key={player.id}
          className={clsx("player-card", { active: index === currentIndex })}
        >
          <div className="player-header">
            <span
              className="player-dot"
              style={{ backgroundColor: player.color }}
            />
            <strong>{player.name}</strong>
          </div>
          <div className="player-stats">
            <span>資源：{player.resources}</span>
            <span>位置：{player.position}</span>
            {player.rentShield && <span className="badge">免租盾</span>}
            {player.upgradeCredits > 0 && (
              <span className="badge">免費建屋 x{player.upgradeCredits}</span>
            )}
            {player.skipTurns > 0 && (
              <span className="badge warning">停留 {player.skipTurns}</span>
            )}
          </div>
        </div>
      ))}
      {!players.length && <p>請先於上方輸入玩家名稱。</p>}
    </div>
  </section>
);

