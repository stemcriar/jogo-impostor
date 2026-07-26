import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { GameProvider, useGame } from '../../contexts/GameContext';
import { ROLES, PHASES } from '../../utils/constants';
import DashWaiting from './DashWaiting';
import DashVoting from './DashVoting';
import DashResult from './DashResult';
import Button from '../../components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  return (
    <GameProvider gameId={gameId} role={ROLES.DASHBOARD}>
      <div className="min-h-screen bg-gray-900 flex flex-col p-8">
        <header className="flex flex-col sm:flex-row items-center sm:justify-between mb-8 relative gap-4 w-full">
          <div className="flex items-center gap-4 z-10 w-full sm:w-auto">
            <img src="/stem-criar-logo.png" alt="STEM Criar" className="h-10 shrink-0" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide truncate">Painel de Projeção</h1>
          </div>
          <div className="flex items-center z-10 w-full sm:w-auto mt-4 sm:mt-0">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white sm:ml-auto w-full sm:w-auto shrink-0">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar
            </Button>
          </div>
        </header>
        <DashboardGameContent />
      </div>
    </GameProvider>
  );
}
