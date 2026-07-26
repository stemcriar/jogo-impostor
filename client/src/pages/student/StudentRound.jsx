import React from 'react';
import { useGame } from '../../contexts/GameContext';
import PageContainer from '../../components/layout/PageContainer';
import Header from '../../components/layout/Header';
import GearAnimation from '../../components/game/GearAnimation';
import Card from '../../components/ui/Card';

export default function StudentRound() {
  const { gameState } = useGame();
  
  return (
    <PageContainer id="student-round">
      <Header title={gameState?.name} />
      
      <div className="flex-1 flex flex-col items-center justify-center pb-12 mt-6">
        <div className="scale-125 mb-12">
          <GearAnimation />
        </div>
        
        <h2 className="text-4xl md:text-5xl font-extrabold text-purple mb-6 tracking-tight text-center">
          Rodada em Andamento
        </h2>
        <p className="text-xl md:text-2xl text-gray-500 font-medium text-center max-w-lg px-4">
          Prestem atenção nas perguntas e respostas. Tente descobrir quem é a máquina!
        </p>
      </div>
    </PageContainer>
  );
}
