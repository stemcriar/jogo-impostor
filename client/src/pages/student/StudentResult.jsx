import React from 'react';
import { useGame } from '../../contexts/GameContext';
import PageContainer from '../../components/layout/PageContainer';
import Header from '../../components/layout/Header';
import ResultBanner from '../../components/game/ResultBanner';

export default function StudentResult() {
  const { gameState } = useGame();
  
  if (!gameState || !gameState.result) return null;

  return (
    <PageContainer id="student-result">
      <Header title="Resultado Final" />
      
      <div className="flex-1 flex flex-col items-center justify-center mt-6">
        <ResultBanner result={gameState.result} id="student-result-banner" />
      </div>
    </PageContainer>
  );
}
