import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePinAuth } from '../../hooks/usePinAuth';
import { useGameContext } from '../../contexts/GameContext';
import { storage } from '../../services/storage';
import { getPhaseLabel } from '../../utils/constants';
import PageContainer from '../../components/layout/PageContainer';
import Header from '../../components/layout/Header';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { LogOut, BookOpen, Play, Settings, Users, MonitorPlay } from 'lucide-react';

export default function MentorHome() {
  const navigate = useNavigate();
  const { logout } = usePinAuth();
  const { gameState } = useGameContext();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const words = storage.getWords();

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
        {/* Continuar partida ativa */}
        {gameState && gameState.phase !== 'result' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 px-2 flex items-center">
              <MonitorPlay className="w-5 h-5 mr-2 text-purple" />
              Partida em Andamento
            </h2>
            <Card className="border border-purple-200 bg-purple-50/30">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="font-bold text-purple text-lg">{gameState.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge variant="purple">{getPhaseLabel(gameState.phase)}</Badge>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {gameState.totalPlayers} Alunos
                    </span>
                  </div>
                </div>
                <Button
                  variant="purple"
                  onClick={() => navigate(
                    gameState.phase === 'card_reveal' ? '/mentor/cards' : '/mentor/panel'
                  )}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Continuar
                </Button>
              </div>
            </Card>
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
                <p className="text-gray-500 mb-6 flex-1">
                  Configure o número de alunos, escolha a palavra e inicie uma nova sessão.
                </p>
                <Button className="w-full">
                  <Play className="w-5 h-5 mr-2" />
                  Iniciar Partida
                </Button>
              </div>
            </Card>

            <Card id="card-manage-words" className="hover:border-purple transition-colors group cursor-pointer" padding="p-8">
              <div onClick={() => navigate('/mentor/words')} className="flex flex-col items-center text-center h-full">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-8 h-8 text-purple" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Gerenciar Palavras</h3>
                <p className="text-gray-500 mb-6 flex-1">
                  Adicione, edite ou remova as palavras-chave e dicas usadas no jogo.
                </p>
                <Button variant="secondary" className="w-full">
                  Acessar Banco ({words.length})
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
