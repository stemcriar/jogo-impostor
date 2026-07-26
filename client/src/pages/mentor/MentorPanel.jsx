import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame, GameProvider } from '../../contexts/GameContext';
import { ROLES, PHASES, getPhaseLabel } from '../../utils/constants';
import PageContainer from '../../components/layout/PageContainer';
import Header from '../../components/layout/Header';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { socket } from '../../services/ws';
import { Settings, Play, Square, Users, Bot } from 'lucide-react';

function MentorPanelContent() {
  const { gameState, gameId } = useGame();
  const navigate = useNavigate();

  if (!gameState) return null;

  const { phase, totalPlayers, machinePlayerNumbers, word, firstSpeaker, votes, totalVotes } = gameState;

  const handleOpenVoting = () => socket.emit('game:action', { gameId, action: 'open_voting' });
  const handleCloseVoting = () => socket.emit('game:action', { gameId, action: 'close_voting' });
  const handleNewRound = () => navigate('/mentor/setup');

  return (
    <PageContainer id="mentor-panel">
      <Header 
        title="Painel de Controle" 
        rightContent={
          <Button variant="ghost" size="sm" onClick={() => navigate('/mentor')} className="text-gray-500">
            Sair
          </Button>
        }
      />

      <div className="flex-1 mt-6 grid md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <Card padding="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Status da Partida</h2>
              <Badge variant="purple">{getPhaseLabel(phase)}</Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                <span className="block text-sm text-gray-500 font-medium mb-1 flex items-center">
                  <Users className="w-4 h-4 mr-1" /> Total
                </span>
                <span className="text-2xl font-bold text-gray-900">{totalPlayers} Alunos</span>
              </div>
              <div className="bg-red-50 p-4 rounded-xl">
                <span className="block text-sm text-danger font-medium mb-1 flex items-center">
                  <Bot className="w-4 h-4 mr-1" /> Máquinas
                </span>
                <span className="text-2xl font-bold text-danger">Alunos {machinePlayerNumbers?.join(', ')}</span>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 mb-6">
              <span className="block text-sm text-yellow-dark font-medium mb-1">Inicia as Perguntas</span>
              <span className="text-xl font-bold text-gray-900">Aluno {firstSpeaker}</span>
            </div>
          </Card>

          <Card padding="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Informação Secreta</h2>
            <div className="space-y-4">
              <div>
                <span className="block text-sm text-gray-500 font-medium mb-1">Palavra-chave (Humanos)</span>
                <div className="text-lg font-bold text-gray-900 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                  {word?.keyword}
                </div>
              </div>
              <div>
                <span className="block text-sm text-gray-500 font-medium mb-1">Dica (Máquinas)</span>
                <div className="text-lg font-bold text-gray-900 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                  {word?.hint}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card padding="p-6" className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-purple" />
              Controles
            </h2>

            <div className="space-y-4">
              <Button 
                className="w-full justify-start" 
                size="lg"
                disabled={phase !== PHASES.ROUND}
                onClick={handleOpenVoting}
                id="btn-open-voting"
              >
                <Play className="w-5 h-5 mr-3" />
                Abrir Votação
              </Button>
              
              <Button 
                variant="danger" 
                className="w-full justify-start" 
                size="lg"
                disabled={phase !== PHASES.VOTING}
                onClick={handleCloseVoting}
                id="btn-close-voting"
              >
                <Square className="w-5 h-5 mr-3" />
                Encerrar Votação e Ver Resultado
              </Button>

              <hr className="my-6 border-gray-100" />

              <Button 
                variant="secondary" 
                className="w-full justify-start text-purple" 
                size="lg"
                onClick={handleNewRound}
                id="btn-new-round"
              >
                <Users className="w-5 h-5 mr-3" />
                Configurar Nova Rodada
              </Button>
            </div>

            {phase === PHASES.VOTING && (
              <div className="mt-8 p-4 bg-purple-50 rounded-xl border border-purple-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-purple-dark">Votos Recebidos</span>
                  <span className="text-xl font-bold text-purple">{totalVotes || 0} / {totalPlayers}</span>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-2.5">
                  <div className="bg-purple h-2.5 rounded-full transition-all" style={{ width: `${((totalVotes || 0) / totalPlayers) * 100}%` }}></div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

export default function MentorPanel() {
  const { gameId } = useParams();
  return (
    <GameProvider gameId={gameId} role={ROLES.MENTOR}>
      <MentorPanelContent />
    </GameProvider>
  );
}
