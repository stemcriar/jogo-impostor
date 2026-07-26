import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame, GameProvider } from '../../contexts/GameContext';
import { ROLES, PHASES, getPhaseLabel } from '../../utils/constants';
import PageContainer from '../../components/layout/PageContainer';
import Header from '../../components/layout/Header';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { socket, wsService } from '../../services/ws';
import { Settings, Play, Square, Users, Bot, ArrowLeft, Eye, EyeOff, RotateCcw, Trash2 } from 'lucide-react';

function MentorPanelContent() {
  const { gameState, gameId } = useGame();
  const navigate = useNavigate();
  const [isSecretVisible, setIsSecretVisible] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (gameState?.phase === PHASES.CARD_REVEAL) {
      navigate(`/mentor/game/${gameId}/cards`);
    }
  }, [gameState?.phase, navigate, gameId]);

  useEffect(() => {
    // Força re-sincronização do mentor ao montar o painel
    wsService.joinGame(gameId, 'mentor');
    wsService.requestSync(gameId, 'mentor');
  }, [gameId]);

  if (!gameState) return null;

  const { phase, totalPlayers, machinePlayerNumbers, word, firstSpeaker, votes, totalVotes, name } = gameState;

  const handleOpenVoting = () => socket.emit('game:action', { gameId, action: 'open_voting' });
  const handleCloseVoting = () => socket.emit('game:action', { gameId, action: 'close_voting' });
  const handleNewRound = () => navigate('/mentor/setup');
  const handleRestartCards = () => socket.emit('game:action', { gameId, action: 'restart_cards' });
  
  const handleDeleteGame = () => {
    socket.emit('game:action', { gameId, action: 'delete_game' });
    setIsDeleteModalOpen(false);
  };

  const machinesText = machinePlayerNumbers?.length > 1 ? 'Máquinas' : 'Máquina';
  const machinesList = machinePlayerNumbers?.map(n => `Aluno ${n}`).join(', ');

  return (
    <PageContainer id="mentor-panel">
      <header className="flex flex-col sm:flex-row items-center sm:justify-between mb-6 gap-4 w-full">
        <div className="flex items-center gap-4 w-full sm:w-auto overflow-hidden">
          <img src="/stem-criar-logo.png" alt="STEM Criar" className="h-10 shrink-0" />
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate" title={name}>{name}</h1>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate('/mentor')} className="text-gray-500 hover:bg-gray-100 shrink-0 sm:ml-auto w-full sm:w-auto">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </header>

      <div className="flex-1 mt-2 grid md:grid-cols-2 gap-6">
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
              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                <span className="block text-sm text-yellow-dark font-medium mb-1">Inicia as Perguntas</span>
                <span className="text-2xl font-bold text-gray-900">Aluno {firstSpeaker}</span>
              </div>
            </div>
          </Card>

          <Card padding="p-0" className="overflow-hidden">
            <div className="p-6 bg-purple-50 border-b border-purple-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-purple-dark flex items-center">
                Informação Confidencial
              </h2>
              <button 
                onClick={() => setIsSecretVisible(!isSecretVisible)}
                className="p-2 text-purple bg-white rounded-full hover:bg-purple-100 transition-colors shadow-sm"
              >
                {isSecretVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                <span className="block text-sm text-danger font-medium mb-1 flex items-center">
                  <Bot className="w-4 h-4 mr-1" /> {machinesText}
                </span>
                <span className="text-lg font-bold text-danger">
                  {isSecretVisible ? machinesList : '••••••••'}
                </span>
              </div>
              
              <div>
                <span className="block text-sm text-gray-500 font-medium mb-1">Palavra-chave (Humanos)</span>
                <div className="text-lg font-bold text-gray-900 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                  {isSecretVisible ? word?.keyword : '••••••••'}
                </div>
              </div>
              <div>
                <span className="block text-sm text-gray-500 font-medium mb-1">Dica (Máquinas)</span>
                <div className="text-lg font-bold text-gray-900 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                  {isSecretVisible ? word?.hint : '••••••••'}
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
                variant={phase === PHASES.RESULT ? 'primary' : 'secondary'}
                className={`w-full justify-start ${phase === PHASES.RESULT ? 'bg-purple hover:bg-purple-dark text-white border-transparent' : 'text-purple border-purple-200 hover:bg-purple-50'}`}
                size="lg"
                onClick={handleNewRound}
                disabled={phase !== PHASES.RESULT}
                id="btn-new-round"
              >
                <Users className="w-5 h-5 mr-3" />
                Configurar Nova Rodada
              </Button>

              <Button 
                variant="secondary" 
                className="w-full justify-start text-gray-600 border-gray-200 hover:bg-gray-50" 
                size="lg"
                onClick={handleRestartCards}
                id="btn-restart-cards"
              >
                <RotateCcw className="w-5 h-5 mr-3" />
                Passar Cartas Novamente
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start text-danger hover:bg-red-50" 
                size="lg"
                onClick={() => setIsDeleteModalOpen(true)}
                id="btn-delete-game"
              >
                <Trash2 className="w-5 h-5 mr-3" />
                Excluir Jogo
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
      
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Excluir Jogo">
        <p className="text-gray-600 mb-6">
          Tem certeza que deseja excluir esta partida? Todos os alunos serão desconectados. Esta ação não pode ser desfeita.
        </p>
        <div className="flex gap-4">
          <Button variant="secondary" className="flex-1" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</Button>
          <Button variant="danger" className="flex-1" onClick={handleDeleteGame}>Excluir Partida</Button>
        </div>
      </Modal>
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
