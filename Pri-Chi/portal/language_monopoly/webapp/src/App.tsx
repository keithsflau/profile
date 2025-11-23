import { useEffect, useState } from "react";
import "./App.css";
import { useGameStore } from "./store/gameStore";
import { Board } from "./components/Board";
import { PlayerTray } from "./components/PlayerTray";
import { ActionPanel } from "./components/ActionPanel";
import { CardDrawer } from "./components/CardDrawer";
import { GameLog } from "./components/GameLog";
import { SetupLobby } from "./components/SetupLobby";
import { QuizModal } from "./components/QuizModal";
import { useRealtimeRoom } from "./services/realtime";

const realtimeEnabled =
  Boolean(import.meta.env.VITE_SUPABASE_URL) &&
  Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY);

function App() {
  const phase = useGameStore((state) => state.phase);
  const board = useGameStore((state) => state.board);
  const players = useGameStore((state) => state.players);
  const propertyStates = useGameStore((state) => state.propertyStates);
  const pendingPurchase = useGameStore((state) => state.pendingPurchase);
  const pendingQuiz = useGameStore((state) => state.pendingQuiz);
  const pendingSpecial = useGameStore((state) => state.pendingSpecial);
  const drawnCard = useGameStore((state) => state.drawnCard);
  const log = useGameStore((state) => state.log);
  const currentPlayerIndex = useGameStore((state) => state.currentPlayerIndex);
  const lastDice = useGameStore((state) => state.lastDice);
  const roomCode = useGameStore((state) => state.roomCode);
  const actions = useGameStore((state) => state.actions);

  const [selectedSpace, setSelectedSpace] = useState<number>(1);
  const currentPlayer = players[currentPlayerIndex];

  useRealtimeRoom(roomCode);

  useEffect(() => {
    if (currentPlayer) {
      setSelectedSpace(currentPlayer.position);
    }
  }, [currentPlayer?.position]);

  if (phase === "lobby") {
    return (
      <SetupLobby
        players={players}
        roomCode={roomCode}
        onRoomCodeChange={actions.setRoomCode}
        onConfigure={actions.configurePlayers}
        onStart={actions.startGame}
        realtimeReady={realtimeEnabled}
      />
    );
  }

  return (
    <div className="app-shell">
      <div className="board-wrapper">
        <Board
          spaces={board}
          players={players}
          propertyStates={propertyStates}
          selectedSpace={selectedSpace}
          onSelectSpace={setSelectedSpace}
        />
      </div>
      <div className="sidebar">
        <ActionPanel
          currentPlayer={currentPlayer}
          allPlayers={players}
          board={board}
          propertyStates={propertyStates}
          pendingPurchase={pendingPurchase}
          pendingSpecial={pendingSpecial}
          lastDice={lastDice}
          selectedSpace={selectedSpace}
          onRollDice={actions.rollDice}
          onEndTurn={actions.endTurn}
          onPurchase={actions.purchaseProperty}
          onSkipPurchase={actions.skipPurchase}
          onBuild={actions.buildHouse}
          onUpgrade={actions.upgradeAcademy}
          onConsumeCredit={actions.consumeUpgradeCredit}
          onResolveSpecial={actions.resolveSpecial}
        />
        <PlayerTray players={players} currentIndex={currentPlayerIndex} />
        <GameLog entries={log} />
      </div>
      <CardDrawer drawnCard={drawnCard} onClose={actions.closeCard} />
      {pendingQuiz && (
        <QuizModal
          question={pendingQuiz.question}
          onAnswer={actions.answerQuiz}
        />
      )}
    </div>
  );
}

export default App;
