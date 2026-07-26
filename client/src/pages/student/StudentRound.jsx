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
      
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full px-4">
        <Card className="w-full text-center flex flex-col items-center py-12">
          <GearAnimation className="mb-8" />
          
          <h2 className="text-2xl md:text-3xl font-bold text-purple mb-4">
            Preste Atenção!
          </h2>
          <p className="text-lg text-gray-600">
            A rodada de perguntas está em andamento. Observe as respostas de todos!
          </p>
        </Card>
      </div>
    </PageContainer>
  );
}
