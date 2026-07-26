import React from 'react';
import { useGame } from '../../contexts/GameContext';
import ResultBanner from '../../components/game/ResultBanner';

export default function DashResult() {
  const { gameState } = useGame();

  if (!gameState || !gameState.result) return null;

  return (
    <div id="dash-result" className="min-h-screen bg-gray-900 flex flex-col p-8">
      <header className="flex justify-center mb-auto pt-4">
        <img src="/stem-criar-logo.png" alt="STEM Criar" className="h-20 brightness-0 invert" />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-5xl mx-auto pb-12">
        <ResultBanner result={gameState.result} id="dash-result-banner" />
      </main>
    </div>
  );
}
