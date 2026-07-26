import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/layout/PageContainer';
import Header from '../../components/layout/Header';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { usePinAuth } from '../../hooks/usePinAuth';
import { LogOut, BookOpen, Play, Settings } from 'lucide-react';

export default function MentorHome() {
  const navigate = useNavigate();
  const { logout } = usePinAuth('mentor');

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

      <div className="flex-1 mt-8 max-w-3xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">O que você deseja fazer?</h2>
        
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
    </PageContainer>
  );
}
