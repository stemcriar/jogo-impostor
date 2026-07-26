import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket, wsService } from '../../services/ws';
import { getPhaseLabel } from '../../utils/constants';
import { MonitorPlay, Users } from 'lucide-react';
import Card from '../../components/ui/Card';
import { usePinAuth } from '../../hooks/usePinAuth';
import Button from '../../components/ui/Button';

export default function DashboardLobby() {
  const [games, setGames] = useState([]);
  const navigate = useNavigate();
  const { logout } = usePinAuth('dashboard');

  useEffect(() => {
    wsService.connect();
    wsService.requestGamesList();

    const handleGamesActive = (activeGames) => {
      setGames(activeGames);
    };

    socket.on('games:active', handleGamesActive);

    const interval = setInterval(() => {
      wsService.requestGamesList();
    }, 5000);

    return () => {
      socket.off('games:active', handleGamesActive);
      clearInterval(interval);
    };
  }, []);

  return (
    <div id="dash-lobby" className="min-h-screen bg-gray-900 p-8 flex flex-col">
      <header className="flex flex-col sm:flex-row items-center sm:justify-between mb-12 gap-4 w-full">
        <div className="flex items-center">
          <img src="/stem-criar-logo.png" alt="STEM Criar" className="h-12" />
        </div>
        <div className="flex items-center gap-6">
          <h1 className="text-xl sm:text-3xl font-bold text-white tracking-wide">Painel de Projeção</h1>
          <Button variant="ghost" onClick={() => { logout(); navigate('/dashboard/pin'); }} className="text-gray-400 hover:text-white shrink-0">
            Sair
          </Button>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center max-w-6xl w-full mx-auto">
        {games.length === 0 ? (
          <div className="text-center">
            <MonitorPlay className="w-24 h-24 text-gray-700 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-gray-400 mb-2">Aguardando Partida</h2>
            <p className="text-xl text-gray-600">O mentor precisa iniciar uma partida para projetar.</p>
          </div>
        ) : (
          <div className="w-full">
            <h2 className="text-2xl font-bold text-white mb-8 text-center uppercase tracking-widest text-gray-400">
              Selecione a Partida para Projetar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map(game => (
                <Card 
                  key={game.id} 
                  id={`dash-game-${game.id}`}
                  className="cursor-pointer hover:border-yellow bg-gray-800 border-gray-700 group transition-all"
                  padding="p-8"
                >
                  <div 
                    onClick={() => navigate(`/dashboard/game/${game.id}`)}
                    className="flex flex-col h-full"
                  >
                    <h3 className="text-2xl font-bold text-purple mb-4 group-hover:text-yellow transition-colors truncate">
                      {game.name}
                    </h3>
                    <div className="inline-flex px-3 py-1 bg-purple-900/50 text-purple-200 rounded-full text-sm font-medium w-fit mb-6">
                      {getPhaseLabel(game.phase)}
                    </div>
                    
                    <div className="mt-auto flex items-center justify-between text-gray-400">
                      <div className="flex items-center gap-2">
                        <Users className="w-6 h-6" />
                        <span className="text-lg font-medium">{game.totalPlayers} Alunos</span>
                      </div>
                      <MonitorPlay className="w-8 h-8 text-gray-600 group-hover:text-yellow transition-colors" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
