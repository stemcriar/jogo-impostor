import React from 'react';
import { useGame } from '../../contexts/GameContext';
import GearAnimation from '../../components/game/GearAnimation';

export default function DashWaiting() {
  const { gameState } = useGame();

  return (
    <div id="dash-waiting" className="min-h-screen bg-white flex flex-col p-8">
      <header className="flex justify-between items-center mb-auto">
        <img src="/stem-criar-logo.png" alt="STEM Criar" className="h-16" />
        <h1 className="text-3xl font-bold text-gray-400 uppercase tracking-widest">{gameState?.name}</h1>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center pb-20">
        <div className="scale-150 mb-16">
          <GearAnimation />
        </div>
        
        <h2 className="text-5xl md:text-6xl font-extrabold text-purple mb-6 tracking-tight text-center">
          Rodada em Andamento
        </h2>
        <p className="text-2xl text-gray-500 font-medium text-center max-w-2xl">
          Prestem atenção nas perguntas e respostas. Tente descobrir quem é a máquina!
        </p>
      </main>
    </div>
  );
}
