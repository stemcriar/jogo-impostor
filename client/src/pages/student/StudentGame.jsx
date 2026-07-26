import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { GameProvider, useGame } from '../../contexts/GameContext';
import { ROLES, PHASES } from '../../utils/constants';
import StudentRound from './StudentRound';
import StudentVote from './StudentVote';
import StudentResult from './StudentResult';
import PageContainer from '../../components/layout/PageContainer';
import Header from '../../components/layout/Header';
import { Loader2 } from 'lucide-react';

function StudentGameContent() {
  const { gameState, isLoading } = useGame();

  if (isLoading) {
    return (
      <PageContainer id="student-game-loading">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-purple animate-spin mb-4" />
          <p className="text-gray-500 font-medium text-lg">Conectando à partida...</p>
        </div>
      </PageContainer>
    );
  }

  if (!gameState) {
    return <Navigate to="/" replace />;
  }

  const { phase } = gameState;

  switch (phase) {
    case PHASES.SETUP:
    case PHASES.CARD_REVEAL:
    case PHASES.ROUND:
      return <StudentRound />;
    case PHASES.VOTING:
      return <StudentVote />;
    case PHASES.RESULT:
      return <StudentResult />;
    default:
      return <StudentRound />;
  }
}

export default function StudentGame() {
  const { gameId } = useParams();

  return (
    <GameProvider gameId={gameId} role={ROLES.STUDENT}>
      <StudentGameContent />
    </GameProvider>
  );
}
