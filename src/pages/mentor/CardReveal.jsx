import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from '../../contexts/GameContext';
import { PHASES } from '../../utils/constants';
import PageContainer from '../../components/layout/PageContainer';
import RoleCard from '../../components/game/RoleCard';
import Button from '../../components/ui/Button';
import { Smartphone, CheckCircle } from 'lucide-react';

export default function CardReveal() {
  const navigate = useNavigate();
  const { gameState, patchGame } = useGameContext();

  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [isDone, setIsDone] = useState(false);
  const [canProceed, setCanProceed] = useState(false);

  if (!gameState) {
    navigate('/mentor');
    return null;
  }

  const { totalPlayers, word, machinePlayerNumbers } = gameState;
  const isMachine = machinePlayerNumbers.includes(currentPlayer);

  const handleNext = () => {
    if (currentPlayer < totalPlayers) {
      setCurrentPlayer(p => p + 1);
      setCanProceed(false);
    } else {
      setIsDone(true);
      patchGame({ phase: PHASES.ROUND });
    }
  };

  return (
    <PageContainer id="card-reveal" className="bg-gray-50">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {!isDone ? (
          <div className="w-full max-w-md flex flex-col items-center">
            <div className="mb-4 sm:mb-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full mb-2 sm:mb-4">
                <Smartphone className="w-6 h-6 sm:w-8 sm:h-8 text-purple" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Passe o celular para o</h2>
              <h1 className="text-3xl sm:text-4xl font-black text-purple mt-1 sm:mt-2">Aluno {currentPlayer}</h1>
              <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base font-medium">
                Aluno {currentPlayer}, olhe seu cartão em segredo.
              </p>
            </div>

            <RoleCard
              id={`role-card-${currentPlayer}`}
              isMachine={isMachine}
              keyword={word?.keyword}
              hint={word?.hint}
              onRevealComplete={() => setCanProceed(true)}
            />

            <div className="mt-6 sm:mt-12 w-full">
              <Button
                onClick={handleNext}
                className="w-full"
                size="lg"
                id="btn-next-player"
                disabled={!canProceed}
              >
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
            <p className="text-lg text-gray-600 mb-8">
              Passe o celular de volta para o Mentor para acompanhar a rodada.
            </p>
            <Button onClick={() => navigate('/mentor/panel')} className="w-full" size="lg" id="btn-go-panel">
              Ir para o Painel do Mentor
            </Button>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
