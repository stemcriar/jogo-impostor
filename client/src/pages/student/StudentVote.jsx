import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { useVoterDevice } from '../../hooks/useVoterDevice';
import { wsService } from '../../services/ws';
import PageContainer from '../../components/layout/PageContainer';
import Header from '../../components/layout/Header';
import PlayerButton from '../../components/game/PlayerButton';
import Card from '../../components/ui/Card';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudentVote() {
  const { gameState, gameId } = useGame();
  const { totalPlayers, phase } = gameState || {};
  const { deviceId, hasVoted, markAsVoted } = useVoterDevice(gameId, phase);

  const handleVote = (playerNumber) => {
    if (!hasVoted) {
      wsService.castVote(gameId, deviceId, playerNumber);
      markAsVoted();
    }
  };

  const players = Array.from({ length: totalPlayers || 0 }, (_, i) => i + 1);

  return (
    <PageContainer id="student-vote">
      <Header title="Hora de Votar!" />
      
      <div className="flex-1 flex flex-col mt-6 w-full max-w-2xl mx-auto">
        {hasVoted ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center"
          >
            <Card className="text-center p-8 w-full">
              <CheckCircle2 className="w-20 h-20 text-success mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Voto Registrado!</h2>
              <p className="text-gray-500 text-lg">Aguarde o encerramento da votação.</p>
            </Card>
          </motion.div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Quem é a máquina?</h2>
              <p className="text-gray-500">Selecione o número do aluno que você suspeita.</p>
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4 pb-8">
              {players.map((num) => (
                <PlayerButton 
                  key={num} 
                  id={`vote-btn-${num}`}
                  playerNumber={num} 
                  onClick={handleVote}
                  disabled={hasVoted}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </PageContainer>
  );
}
