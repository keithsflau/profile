import { useState } from "react";
import type { FormEvent } from "react";
import type { PlayerState } from "../types";

interface SetupLobbyProps {
  players: PlayerState[];
  roomCode: string;
  onRoomCodeChange: (code: string) => void;
  onConfigure: (names: string[]) => void;
  onStart: () => void;
  realtimeReady: boolean;
}

const MAX_PLAYERS = 4;

export const SetupLobby = ({
  players,
  roomCode,
  onRoomCodeChange,
  onConfigure,
  onStart,
  realtimeReady,
}: SetupLobbyProps) => {
  const [names, setNames] = useState<string[]>(
    Array.from({ length: MAX_PLAYERS }, (_, index) => players[index]?.name ?? "")
  );
  const canStart = players.length >= 2;
  const realtimeHint = realtimeReady
    ? roomCode
      ? `已輸入房間代碼 ${roomCode}，將透過 Supabase 同步。`
      : "輸入房間代碼即可啟用即時同步（Supabase）。"
    : "未設定 Supabase 環境變數，暫以本機遊玩。";

  const handleSave = (event: FormEvent) => {
    event.preventDefault();
    onConfigure(names);
  };

  const generateRoomCode = () => {
    const code = Math.random().toString(36).slice(2, 7).toUpperCase();
    onRoomCodeChange(code);
  };

  return (
    <div className="setup-stage">
      <div className="setup-card">
        <p className="eyebrow">中國語文版大富翁</p>
        <h1>建立語文冒險房間</h1>
        <p>
          請輸入 2-4 名玩家名稱，並設定房間代碼（可選）以便與同學同步遊玩。
        </p>
        <form onSubmit={handleSave} className="player-form">
          {names.map((value, index) => (
            <label key={index}>
              玩家 {index + 1}
              <input
                type="text"
                value={value}
                placeholder={`輸入第 ${index + 1} 位玩家`}
                onChange={(event) => {
                  const updated = [...names];
                  updated[index] = event.target.value;
                  setNames(updated);
                }}
              />
            </label>
          ))}
          <button type="submit">儲存玩家名單</button>
        </form>

        <div className="room-settings">
          <label>
            房間代碼
            <input
              type="text"
              value={roomCode}
              placeholder="可分享給其他玩家"
              onChange={(event) => onRoomCodeChange(event.target.value.toUpperCase())}
            />
          </label>
          <button type="button" onClick={generateRoomCode}>
            隨機代碼
          </button>
          <small>{realtimeHint}</small>
        </div>

        <div className="setup-actions">
          <button type="button" disabled={!players.length} onClick={onStart}>
            開始冒險（至少 2 名玩家）
          </button>
          {!canStart && (
            <p className="warning">
              需要至少兩位玩家才能開始；可透過房間代碼讓 2-4 人連線。
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

