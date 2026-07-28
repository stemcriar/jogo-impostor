import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from '../../contexts/GameContext';
import { PHASES, getPhaseLabel } from '../../utils/constants';
import PageContainer from '../../components/layout/PageContainer';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { ArrowLeft, Users, Bot, Eye, EyeOff, RotateCcw, Flag, Settings, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MentorPanel() {
  const navigate = useNavigate();
  const { gameState, patchGame, clearGame } = useGameContext();

  const [isSecretVisible, setIsSecretVisible] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isEndModalOpen, setIsEndModalOpen]   = useState(false);

  if (!gameState) {
    navigate('/mentor');
    return null;
  }

  const { phase, totalPlayers, machinePlayerNumbers, word, firstSpeaker, speakingOrder, name, impostorCount } = gameState;

  const machinesText = machinePlayerNumbers?.length > 1 ? 'Máquinas' : 'Máquina';
  const machinesList = machinePlayerNumbers?.map(n => `Aluno ${n}`).join(', ');

  const handleFinish = () => {
    patchGame({ phase: PHASES.RESULT });
    setIsEndModalOpen(false);
    setIsResultModalOpen(true);
  };

  const handleNewRound = () => {
    setIsResultModalOpen(false);
    navigate(`/mentor/setup?name=${encodeURIComponent(name)}&players=${totalPlayers}&impostors=${impostorCount}`);
  };

  const handleRestartCards = () => {
    patchGame({ phase: PHASES.CARD_REVEAL });
    navigate('/mentor/cards');
  };

  const handleDeleteGame = () => {
    clearGame();
    navigate('/mentor');
  };

  return (
    <PageContainer id="mentor-panel">
      <header className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between mb-6 gap-4 w-full relative">
        <Button variant="ghost" size="sm" onClick={() => navigate('/mentor')} className="text-gray-500 hover:bg-gray-100 shrink-0 self-start sm:self-auto sm:order-last sm:ml-auto">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div className="flex items-center gap-4 w-full sm:w-auto overflow-hidden sm:order-first">
          <Link to="/mentor" className="shrink-0">
            <img src="/jogo-impostor/stem-criar-logo.png" alt="STEM Criar" className="h-10 rounded-[10px]" />
          </Link>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate" title={name}>{name}</h1>
        </div>
      </header>

      <div className="flex-1 mt-2 grid md:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          {/* Status */}
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

          {/* Confidential */}
          <Card padding="p-0" className="overflow-hidden">
            <div className="p-6 bg-purple-50 border-b border-purple-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-purple-dark">Informação Confidencial</h2>
              <button
                onClick={() => setIsSecretVisible(v => !v)}
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

        {/* Right column — controls */}
        <div className="flex flex-col gap-6">
          <Card padding="p-6" className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-purple" />
              Controles
            </h2>

            <div className="space-y-4">
              {/* Finalizar Partida */}
              {phase !== PHASES.RESULT && (
                <Button
                  variant="danger"
                  className="w-full justify-start"
                  size="lg"
                  onClick={() => setIsEndModalOpen(true)}
                  id="btn-finish-game"
                >
                  <Flag className="w-5 h-5 mr-3" />
                  Finalizar Partida
                </Button>
              )}

              {/* Ver Resultado */}
              {phase === PHASES.RESULT && (
                <Button
                  variant="secondary"
                  className="w-full justify-start text-purple border-purple-200 hover:bg-purple-50"
                  size="lg"
                  onClick={() => setIsResultModalOpen(true)}
                  id="btn-view-result"
                >
                  <Eye className="w-5 h-5 mr-3" />
                  Ver Resultado
                </Button>
              )}

              <hr className="my-2 border-gray-100" />

              {/* Jogar Novamente */}
              <Button
                variant={phase === PHASES.RESULT ? 'purple' : 'secondary'}
                className="w-full justify-start"
                size="lg"
                onClick={handleNewRound}
                disabled={phase !== PHASES.RESULT}
                id="btn-new-round"
              >
                <RotateCcw className="w-5 h-5 mr-3" />
                Jogar Novamente
              </Button>

              {/* Passar Cartas Novamente */}
              <Button
                variant="secondary"
                className="w-full justify-start text-gray-600 border-gray-200 hover:bg-gray-50"
                size="lg"
                onClick={handleRestartCards}
                disabled={phase !== PHASES.CARD_REVEAL && phase !== PHASES.ROUND}
                id="btn-restart-cards"
              >
                <Users className="w-5 h-5 mr-3" />
                Passar Cartas Novamente
              </Button>

              {/* Encerrar Jogo */}
              <Button
                variant="ghost"
                className="w-full justify-start text-danger hover:bg-red-50"
                size="lg"
                onClick={handleDeleteGame}
                id="btn-delete-game"
              >
                <Trash2 className="w-5 h-5 mr-3" />
                Apagar Jogo
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Modal: Confirmar Finalizar */}
      <Modal isOpen={isEndModalOpen} onClose={() => setIsEndModalOpen(false)} title="Finalizar Partida">
        <p className="text-gray-600 mb-6">
          Deseja encerrar a rodada agora? O resultado será revelado para o Mentor.
        </p>
        <div className="flex gap-4">
          <Button variant="secondary" className="flex-1" onClick={() => setIsEndModalOpen(false)}>Cancelar</Button>
          <Button variant="danger"    className="flex-1" onClick={handleFinish} id="btn-confirm-finish">Finalizar</Button>
        </div>
      </Modal>

      {/* Modal: Resultado */}
      <Modal isOpen={isResultModalOpen} onClose={() => setIsResultModalOpen(false)} title="Resultado da Rodada">
        <div className="space-y-6">
          <div className="bg-red-50 rounded-2xl p-6 border border-red-200 text-center">
            <Bot className="w-12 h-12 text-danger mx-auto mb-3" />
            <p className="text-sm text-danger font-semibold uppercase tracking-wide mb-1">
              {machinesText} {machinePlayerNumbers.length > 1 ? 'eram' : 'era'}
            </p>
            <p className="text-3xl font-black text-danger">{machinesList}</p>
          </div>

          <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100 text-center">
            <p className="text-sm text-purple font-semibold uppercase tracking-wide mb-1">Palavra-chave</p>
            <p className="text-2xl font-bold text-purple-dark">{word?.keyword}</p>
            <p className="text-sm text-purple-light mt-1">Dica: {word?.hint}</p>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setIsResultModalOpen(false)}>Fechar</Button>
            <Button variant="purple"    className="flex-1" onClick={handleNewRound} id="btn-play-again">
              <RotateCcw className="w-4 h-4 mr-2" />
              Jogar Novamente
            </Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
}
