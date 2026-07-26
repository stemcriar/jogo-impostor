import React from 'react';
import { useGame } from '../../contexts/GameContext';
import VoteChart from '../../components/game/VoteChart';

export default function DashVoting() {
  const { gameState } = useGame();
  
  if (!gameState) return null;

  return (
    <div id="dash-voting" className="min-h-screen bg-white flex flex-col p-8">
      <header className="flex justify-between items-center mb-8">
        <img src="/stem-criar-logo.png" alt="STEM Criar" className="h-16" />
        <div className="flex items-center gap-4 bg-purple-50 px-6 py-3 rounded-2xl border border-purple-100">
          <span className="text-xl font-bold text-purple-dark uppercase tracking-wide">Votos</span>
          <span className="text-3xl font-black text-purple">{gameState.totalVotes || 0} / {gameState.totalPlayers}</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center">
        <h2 className="text-5xl font-extrabold text-gray-900 mb-2 mt-4">
          Votação em Andamento
        </h2>
        <p className="text-2xl text-gray-500 mb-12">
          Quem você acha que é a máquina?
        </p>
        
        <div className="w-full max-w-6xl mx-auto flex-1 bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-inner flex items-end">
          <VoteChart 
            totalPlayers={gameState.totalPlayers} 
            votes={gameState.votes} 
            totalVotes={gameState.totalVotes} 
            id="dash-vote-chart"
          />
        </div>
      </main>
    </div>
  );
}
