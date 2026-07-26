import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/layout/PageContainer';
import Header from '../../components/layout/Header';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { socket, wsService } from '../../services/ws';
import { getPhaseLabel } from '../../utils/constants';
import { PlayCircle, Users } from 'lucide-react';

export default function StudentLobby() {
  const [games, setGames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    wsService.connect();
    wsService.requestGamesList();

    const handleGamesActive = (activeGames) => {
      setGames(activeGames);
    };

    socket.on('games:active', handleGamesActive);

    // Refresh every 5 seconds
    const interval = setInterval(() => {
      wsService.requestGamesList();
    }, 5000);

    return () => {
      socket.off('games:active', handleGamesActive);
      clearInterval(interval);
    };
  }, []);

  return (
    <PageContainer id="student-lobby" className="bg-gray-50">
      <Header title="Lobby dos Alunos" />
      
      <div className="flex-1 mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Partidas Disponíveis</h2>
        
        {games.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">Nenhuma partida ativa no momento.</p>
            <p className="text-gray-400 text-sm mt-2">Aguarde o mentor iniciar uma nova partida.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {games.map(game => (
              <Card 
                key={game.id} 
                id={`game-card-${game.id}`}
                className="cursor-pointer hover:shadow-md transition-shadow group"
              >
                <div 
                  onClick={() => navigate(`/game/${game.id}`)}
                  className="flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-purple truncate pr-2">{game.name}</h3>
                    <Badge variant="purple" className="shrink-0">{getPhaseLabel(game.phase)}</Badge>
                  </div>
                  
                  <div className="mt-auto flex items-center justify-between text-gray-600">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-gray-400" />
                      <span className="font-medium">{game.totalPlayers} Alunos</span>
                    </div>
                    <PlayCircle className="w-8 h-8 text-yellow group-hover:text-yellow-dark transition-colors" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
