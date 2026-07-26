import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/layout/PageContainer';
import Header from '../../components/layout/Header';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { usePinAuth } from '../../hooks/usePinAuth';
import { socket, wsService } from '../../services/ws';
import { getPhaseLabel } from '../../utils/constants';
import { LogOut, BookOpen, Play, Settings, Users, MonitorPlay } from 'lucide-react';
import Badge from '../../components/ui/Badge';

export default function MentorHome() {
  const navigate = useNavigate();
  const { logout } = usePinAuth('mentor');
  const [activeGames, setActiveGames] = useState([]);

  useEffect(() => {
    wsService.connect();
    wsService.requestGamesList();

    const handleGamesActive = (games) => {
      setActiveGames(games);
    };

    socket.on('games:active', handleGamesActive);
    const interval = setInterval(() => wsService.requestGamesList(), 5000);

    return () => {
      socket.off('games:active', handleGamesActive);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/mentor/pin');
  };

  return (
    <PageContainer id="mentor-home">
      <Header 
        title="Painel do Mentor" 
        rightContent={
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-500">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        }
      />

      <div className="flex-1 mt-8 max-w-4xl mx-auto w-full flex flex-col gap-8">
        {activeGames.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 px-2 flex items-center">
              <MonitorPlay className="w-5 h-5 mr-2 text-purple" />
              Salas em Andamento
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {activeGames.map(game => (
                <Card key={game.id} className="flex flex-col p-5 border border-purple-100 hover:border-purple transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-purple truncate text-lg pr-2">{game.name}</h3>
                    <Badge variant="purple" className="shrink-0 text-xs py-0.5">{getPhaseLabel(game.phase)}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Users className="w-4 h-4" />
                    <span>{game.totalPlayers} Alunos</span>
                  </div>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="w-full mt-auto"
                    onClick={() => navigate(`/mentor/game/${game.id}/panel`)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Gerenciar
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 px-2">Opções</h2>
          <div className="grid md:grid-cols-2 gap-6">
          <Card id="card-new-game" className="hover:border-yellow transition-colors group cursor-pointer" padding="p-8">
            <div onClick={() => navigate('/mentor/setup')} className="flex flex-col items-center text-center h-full">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-yellow-dark" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Nova Partida</h3>
              <p className="text-gray-500 mb-6 flex-1">Configure o número de alunos, escolha a palavra e inicie uma nova sessão.</p>
              <Button className="w-full">Iniciar Configuração</Button>
            </div>
          </Card>

          <Card id="card-manage-words" className="hover:border-purple transition-colors group cursor-pointer" padding="p-8">
            <div onClick={() => navigate('/mentor/words')} className="flex flex-col items-center text-center h-full">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-8 h-8 text-purple" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Gerenciar Palavras</h3>
              <p className="text-gray-500 mb-6 flex-1">Adicione, edite ou remova as palavras-chave e dicas usadas no jogo.</p>
              <Button variant="secondary" className="w-full">Acessar Banco</Button>
            </div>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
