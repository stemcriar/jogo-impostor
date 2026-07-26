import React from 'react';
import { useGame } from '../../contexts/GameContext';
import ResultBanner from '../../components/game/ResultBanner';

export default function DashResult() {
  const { gameState } = useGame();

  if (!gameState || !gameState.result) return null;

  return (
    <div id="dash-result" className="flex-1 flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-5xl mx-auto pb-12">
        <ResultBanner result={gameState.result} id="dash-result-banner" />
      </main>
    </div>
  );
}
