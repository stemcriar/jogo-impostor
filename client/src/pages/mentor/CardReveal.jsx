import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame, GameProvider } from '../../contexts/GameContext';
import { ROLES, PHASES } from '../../utils/constants';
import PageContainer from '../../components/layout/PageContainer';
import RoleCard from '../../components/game/RoleCard';
import Button from '../../components/ui/Button';
import { Smartphone, CheckCircle } from 'lucide-react';
import { socket } from '../../services/ws';

function CardRevealContent() {
  const { gameState, gameId } = useGame();
  const navigate = useNavigate();
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [isDone, setIsDone] = useState(false);
  const [canProceed, setCanProceed] = useState(false);

  useEffect(() => {
    if (gameState && gameState.phase === PHASES.SETUP) {
      // Auto-start cards phase when mentor mounts this view
      socket.emit('game:start_cards', { gameId });
    }
  }, [gameState, gameId]);

  if (!gameState) return null;

  const totalPlayers = gameState.totalPlayers;
  const word = gameState.word;
  const machines = gameState.machinePlayerNumbers || [];

  const handleNext = () => {
    if (currentPlayer < totalPlayers) {
      setCurrentPlayer(currentPlayer + 1);
      setCanProceed(false); // reseta para o próximo aluno
    } else {
      setIsDone(true);
      socket.emit('game:cards_done', { gameId });
    }
  };

  const isCurrentMachine = machines.includes(currentPlayer);

  return (
    <PageContainer id="card-reveal" className="bg-gray-50">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {!isDone ? (
          <div className="w-full max-w-md flex flex-col items-center">
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <Smartphone className="w-8 h-8 text-purple" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Passe o celular para o</h2>
              <h1 className="text-4xl font-black text-purple mt-2">Aluno {currentPlayer}</h1>
              <p className="text-gray-500 mt-2 font-medium">Aluno {currentPlayer}, olhe seu cartão em segredo.</p>
            </div>

            <RoleCard 
              id={`role-card-${currentPlayer}`}
              isMachine={isCurrentMachine}
              keyword={word?.keyword}
              hint={word?.hint}
              onRevealComplete={() => setCanProceed(true)}
            />

            <div className="mt-12 w-full">
              <Button onClick={handleNext} className="w-full" size="lg" id="btn-next-player" disabled={!canProceed}>
                {currentPlayer < totalPlayers ? 'Próximo Aluno' : 'Finalizar Distribuição'}
              </Button>
              <div className="text-center mt-4 text-sm font-semibold text-gray-400">
                Progresso: {currentPlayer} de {totalPlayers}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">
            <CheckCircle className="w-20 h-20 text-success mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Distribuição Concluída</h2>
            <p className="text-lg text-gray-600 mb-8">Passe o celular de volta para o Mentor para iniciar a rodada.</p>
            <Button onClick={() => navigate(`/mentor/game/${gameId}/panel`)} className="w-full" size="lg" id="btn-go-panel">
              Ir para o Painel do Mentor
            </Button>
          </div>
        )}
      </div>
    </PageContainer>
  );
}

export default function CardReveal() {
  const { gameId } = useParams();
  return (
    <GameProvider gameId={gameId} role={ROLES.MENTOR}>
      <CardRevealContent />
    </GameProvider>
  );
}
