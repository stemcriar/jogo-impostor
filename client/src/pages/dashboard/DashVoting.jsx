import React from 'react';
import { useGame } from '../../contexts/GameContext';
import VoteChart from '../../components/game/VoteChart';

export default function DashVoting() {
  const { gameState } = useGame();
  
  if (!gameState) return null;

  return (
    <div id="dash-voting" className="flex-1 bg-white flex flex-col rounded-3xl p-8 mb-4">
      <main className="flex-1 flex flex-col items-center">
        <div className="flex items-center gap-4 bg-purple-50 px-6 py-3 rounded-2xl border border-purple-100 mb-6">
          <span className="text-xl font-bold text-purple-dark uppercase tracking-wide">Total de Votos</span>
          <span className="text-3xl font-black text-purple">{gameState.totalVotes || 0}</span>
        </div>

        <h2 className="text-5xl font-extrabold text-gray-900 mb-2">
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
