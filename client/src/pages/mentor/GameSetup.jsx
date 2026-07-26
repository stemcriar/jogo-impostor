import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import { socket } from '../../services/ws';
import PageContainer from '../../components/layout/PageContainer';
import Header from '../../components/layout/Header';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { ArrowLeft, Users, Bot } from 'lucide-react';

export default function GameSetup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editGameId = searchParams.get('gameId');
  const editGameName = searchParams.get('name');
  const editTotalPlayers = searchParams.get('players') ? parseInt(searchParams.get('players'), 10) : 5;
  const editImpostors = searchParams.get('impostors') ? parseInt(searchParams.get('impostors'), 10) : 1;

  const [words, setWords] = useState([]);
  const [formData, setFormData] = useState({
    name: editGameName || '',
    totalPlayers: editTotalPlayers,
    impostorCount: editImpostors,
    wordId: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getWords().then(setWords).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.totalPlayers < formData.impostorCount + 2) {
      setError('O número de alunos deve ser pelo menos 2 a mais que o número de máquinas.');
      return;
    }

    setIsLoading(true);
    try {
      const dataToSubmit = { ...formData };
      if (!dataToSubmit.wordId) {
        delete dataToSubmit.wordId; // Let server pick random
      }

      if (editGameId) {
        socket.emit('game:action', { 
          gameId: editGameId, 
          action: 'new_round',
          totalPlayers: dataToSubmit.totalPlayers,
          impostorCount: dataToSubmit.impostorCount,
          wordId: dataToSubmit.wordId
        });
        navigate(`/mentor/game/${editGameId}/cards`);
      } else {
        const newGame = await api.createGame(dataToSubmit);
        navigate(`/mentor/game/${newGame.id}/cards`);
      }
    } catch (err) {
      setError('Erro ao criar partida. Verifique os dados.');
      setIsLoading(false);
    }
  };

  return (
    <PageContainer id="game-setup">
      <Header 
        title="Nova Partida" 
        rightContent={
          <Button variant="ghost" size="sm" onClick={() => navigate('/mentor')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        }
      />

      <div className="flex-1 flex justify-center mt-6">
        <Card className="w-full max-w-xl h-fit">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Configurações da Partida</h2>
              <p className="text-gray-500 text-sm">Defina as regras para a nova rodada.</p>
            </div>

            <Input 
              label="Nome da Turma / Partida" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Ex: Turma A - Manhã"
              required
              disabled={!!editGameId}
              id="setup-name"
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Users className="w-4 h-4 mr-1 text-purple" />
                  Total de Alunos (N)
                </label>
                <div className="flex items-center border border-gray-300 rounded-xl bg-white overflow-hidden h-11">
                  <button type="button" onClick={() => setFormData({...formData, totalPlayers: Math.max(3, formData.totalPlayers - 1)})} className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-purple font-black border-r border-gray-300 text-lg transition-colors flex-1">-</button>
                  <div className="w-16 text-center font-bold text-gray-900" id="setup-total">{formData.totalPlayers}</div>
                  <button type="button" onClick={() => setFormData({...formData, totalPlayers: Math.min(30, formData.totalPlayers + 1)})} className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-purple font-black border-l border-gray-300 text-lg transition-colors flex-1">+</button>
                </div>
              </div>
              <div className="flex flex-col">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Bot className="w-4 h-4 mr-1 text-danger" />
                  Máquinas (K)
                </label>
                <div className="flex items-center border border-gray-300 rounded-xl bg-white overflow-hidden h-11">
                  <button type="button" onClick={() => setFormData({...formData, impostorCount: Math.max(1, formData.impostorCount - 1)})} className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-danger font-black border-r border-gray-300 text-lg transition-colors flex-1">-</button>
                  <div className="w-16 text-center font-bold text-gray-900" id="setup-impostors">{formData.impostorCount}</div>
                  <button type="button" onClick={() => setFormData({...formData, impostorCount: Math.min(Math.max(1, formData.totalPlayers - 2), formData.impostorCount + 1)})} className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-danger font-black border-l border-gray-300 text-lg transition-colors flex-1">+</button>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Palavra-chave da rodada
              </label>
              <select
                value={formData.wordId}
                onChange={(e) => setFormData({...formData, wordId: e.target.value})}
                className="px-4 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple focus:outline-none appearance-none"
                id="setup-word"
              >
                <option value="">Aleatória (Sorteada pelo sistema)</option>
                {words.map(w => (
                  <option key={w.id} value={w.id}>{w.keyword} / {w.hint}</option>
                ))}
              </select>
            </div>

            {error && <p className="text-danger text-sm font-medium p-3 bg-red-50 rounded-lg">{error}</p>}

            <div className="mt-4">
              <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                Iniciar Partida
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </PageContainer>
  );
}
