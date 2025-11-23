import type { BoardSpace, PlayerState, PropertyState } from "../types";
import { colorGroups } from "../data/board";

type SpecialChoice =
  | { type: "library" | "canteen"; choice: "resource" | "card" }
  | { type: "oratory"; success: boolean };

interface ActionPanelProps {
  currentPlayer?: PlayerState;
  allPlayers: PlayerState[];
  board: BoardSpace[];
  propertyStates: Record<number, PropertyState>;
  pendingPurchase?: number;
  pendingSpecial?: { type: "library" | "canteen" | "oratory"; playerId: string };
  lastDice?: [number, number];
  selectedSpace?: number;
  onRollDice: () => void;
  onEndTurn: () => void;
  onPurchase: () => void;
  onSkipPurchase: () => void;
  onBuild: (spaceId: number) => void;
  onUpgrade: (spaceId: number) => void;
  onConsumeCredit: (spaceId: number) => void;
  onResolveSpecial: (payload: SpecialChoice) => void;
}

const ownsColorSet = (
  player: PlayerState,
  space: BoardSpace,
  propertyStates: Record<number, PropertyState>
) => {
  if (!space.color) return false;
  const group = colorGroups[space.color];
  return (
    !!group &&
    group.every((id) => propertyStates[id]?.ownerId === player.id)
  );
};

export const ActionPanel = ({
  currentPlayer,
  allPlayers,
  board,
  propertyStates,
  pendingPurchase,
  pendingSpecial,
  lastDice,
  selectedSpace,
  onRollDice,
  onEndTurn,
  onPurchase,
  onSkipPurchase,
  onBuild,
  onUpgrade,
  onConsumeCredit,
  onResolveSpecial,
}: ActionPanelProps) => {
  const targetSpace =
    board.find((item) => item.id === (selectedSpace ?? currentPlayer?.position)) ??
    board[0];
  const propertyState = propertyStates[targetSpace.id];
  const ownerName = propertyState?.ownerId
    ? allPlayers.find((p) => p.id === propertyState.ownerId)?.name ?? "其他玩家"
    : undefined;
  const playerProperties =
    currentPlayer?.properties
      .map((id) => board.find((b) => b.id === id))
      .filter((space): space is BoardSpace => Boolean(space)) ?? [];

  return (
    <section className="panel action-panel">
      <header>
        <p className="eyebrow">目前回合</p>
        <h2>{currentPlayer?.name ?? "尚未設定玩家"}</h2>
        {lastDice && (
          <p className="dice-result">
            最近擲骰：{lastDice[0]} + {lastDice[1]}
          </p>
        )}
      </header>

      <div className="action-buttons">
        <button type="button" onClick={onRollDice}>
          擲骰前進
        </button>
        <button type="button" onClick={onEndTurn}>
          結束回合
        </button>
      </div>

      {pendingPurchase && targetSpace.id === pendingPurchase && (
        <div className="notice">
          <p>是否購買 {targetSpace.name}（成本 {targetSpace.cost}）？</p>
          <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.5rem" }}>
            💡 點擊「購買」後需要回答一道語文問題，答對才能購買！
          </p>
          <div className="action-buttons">
            <button type="button" onClick={onPurchase}>
              購買（需答題）
            </button>
            <button type="button" onClick={onSkipPurchase}>
              放棄
            </button>
          </div>
        </div>
      )}

      {pendingSpecial && currentPlayer?.id === pendingSpecial.playerId && (
        <div className="notice special">
          {pendingSpecial.type === "library" && (
            <>
              <p>免費圖書室：選擇領取 50 資源或抽命運卡。</p>
              <div className="action-buttons">
                <button
                  type="button"
                  onClick={() =>
                    onResolveSpecial({ type: "library", choice: "resource" })
                  }
                >
                  領取 50
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onResolveSpecial({ type: "library", choice: "card" })
                  }
                >
                  抽命運卡
                </button>
              </div>
            </>
          )}
          {pendingSpecial.type === "canteen" && (
            <>
              <p>餐膳補給站：領 100 資源或抽補給卡。</p>
              <div className="action-buttons">
                <button
                  type="button"
                  onClick={() =>
                    onResolveSpecial({ type: "canteen", choice: "resource" })
                  }
                >
                  領取 100
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onResolveSpecial({ type: "canteen", choice: "card" })
                  }
                >
                  抽卡
                </button>
              </div>
            </>
          )}
          {pendingSpecial.type === "oratory" && (
            <>
              <p>口語表達廣場：成功 +50，未完成 -30。</p>
              <div className="action-buttons">
                <button
                  type="button"
                  onClick={() =>
                    onResolveSpecial({ type: "oratory", success: true })
                  }
                >
                  成功
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onResolveSpecial({ type: "oratory", success: false })
                  }
                >
                  尚需努力
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <div className="space-details">
        <h3>{targetSpace.name}</h3>
        <p>{targetSpace.description}</p>
        {targetSpace.cost && <p>成本：{targetSpace.cost}</p>}
        {targetSpace.baseRent && <p>基礎租金：{targetSpace.baseRent}</p>}
        {ownerName && <p>擁有者：{ownerName}</p>}
      </div>

      {currentPlayer && (
        <div className="build-controls">
          <h4>建設管理</h4>
          {currentPlayer.upgradeCredits > 0 && (
            <p>免費建屋券：{currentPlayer.upgradeCredits} 張</p>
          )}
          {playerProperties.length === 0 && <p>尚未持有任何地段。</p>}
          {playerProperties.map((property) => {
            const state = propertyStates[property.id];
            if (!state) return null;
            const ownsSet = ownsColorSet(
              currentPlayer,
              property,
              propertyStates
            );
            return (
              <div key={property.id} className="build-row">
                <span>{property.name}</span>
                <div className="row-actions">
                  <button
                    type="button"
                    disabled={!ownsSet || state.houses >= 4 || state.academy}
                    onClick={() => onBuild(property.id)}
                  >
                    建字屋
                  </button>
                  <button
                    type="button"
                    disabled={state.houses < 4 || state.academy}
                    onClick={() => onUpgrade(property.id)}
                  >
                    升級書院
                  </button>
                  <button
                    type="button"
                    disabled={!currentPlayer.upgradeCredits || state.academy}
                    onClick={() => onConsumeCredit(property.id)}
                  >
                    用免費券
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

