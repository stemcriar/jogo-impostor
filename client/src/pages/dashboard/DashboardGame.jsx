import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { GameProvider, useGame } from '../../contexts/GameContext';
import { ROLES, PHASES } from '../../utils/constants';
import DashWaiting from './DashWaiting';
import DashVoting from './DashVoting';
import DashResult from './DashResult';

function DashboardGameContent() {
  const { gameState, isLoading } = useGame();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-yellow border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!gameState) {
    return <Navigate to="/dashboard" replace />;
  }

  switch (gameState.phase) {
    case PHASES.SETUP:
    case PHASES.CARD_REVEAL:
    case PHASES.ROUND:
      return <DashWaiting />;
    case PHASES.VOTING:
      return <DashVoting />;
    case PHASES.RESULT:
      return <DashResult />;
    default:
      return <DashWaiting />;
  }
}

export default function DashboardGame() {
  const { gameId } = useParams();

  return (
    <GameProvider gameId={gameId} role={ROLES.DASHBOARD}>
      <DashboardGameContent />
    </GameProvider>
  );
}
