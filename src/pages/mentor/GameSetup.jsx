import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGameContext } from '../../contexts/GameContext';
import { storage } from '../../services/storage';
import { pickWord, createGameState } from '../../services/gameLogic';
import PageContainer from '../../components/layout/PageContainer';
import Header from '../../components/layout/Header';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { ArrowLeft, Users, Bot, Lock } from 'lucide-react';

export default function GameSetup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { gameState, setGame } = useGameContext();

  // When replaying, pre-fill from URL params
  const editName       = searchParams.get('name')      || '';
  const editPlayers    = searchParams.get('players')   ? parseInt(searchParams.get('players'), 10) : 5;
  const editImpostors  = searchParams.get('impostors') ? parseInt(searchParams.get('impostors'), 10) : 1;
  const isReplay       = !!searchParams.get('name');

  const [words, setWords] = useState([]);
  const [formData, setFormData] = useState({
    name:         editName,
    totalPlayers: editPlayers,
    impostorCount: editImpostors,
    wordId: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setWords(storage.getWords());
  }, []);

  const set = (key, val) => setFormData(f => ({ ...f, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (formData.totalPlayers < formData.impostorCount + 2) {
      setError('O número de alunos deve ser pelo menos 2 a mais que o número de máquinas.');
      return;
    }
    if (words.length === 0) {
      setError('Nenhuma palavra cadastrada. Adicione palavras antes de criar uma partida.');
      return;
    }

    setIsLoading(true);

    const usedIds = isReplay ? (gameState?.usedWordIds ?? []) : [];
    const chosenWord = formData.wordId
      ? words.find(w => w.id === parseInt(formData.wordId, 10))
      : pickWord(words, usedIds);

    const newState = createGameState({
      name:          formData.name,
      totalPlayers:  formData.totalPlayers,
      impostorCount: formData.impostorCount,
      word:          chosenWord,
      usedWordIds:   usedIds,
    });

    setGame(newState);
    navigate('/mentor/cards');
  };

  return (
    <PageContainer id="game-setup">
      <Header
        title={isReplay ? 'Jogar Novamente' : 'Nova Partida'}
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

            {/* Room name */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                Nome da Turma / Partida
                {isReplay && <Lock className="w-3 h-3 ml-2 text-gray-400" />}
              </label>
              <Input
                value={formData.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="Ex: Turma A - Manhã"
                required
                disabled={isReplay}
                id="setup-name"
              />
            </div>

            {/* Steppers */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Users className="w-4 h-4 mr-1 text-purple" />
                  Total de Alunos
                </label>
                <div className="flex items-center border border-gray-300 rounded-xl bg-white overflow-hidden h-11">
                  <button type="button" onClick={() => set('totalPlayers', Math.max(3, formData.totalPlayers - 1))} className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-purple font-black border-r border-gray-300 text-lg transition-colors flex-1">-</button>
                  <div className="w-16 text-center font-bold text-gray-900" id="setup-total">{formData.totalPlayers}</div>
                  <button type="button" onClick={() => set('totalPlayers', Math.min(30, formData.totalPlayers + 1))} className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-purple font-black border-l border-gray-300 text-lg transition-colors flex-1">+</button>
                </div>
              </div>

              <div className="flex flex-col">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Bot className="w-4 h-4 mr-1 text-danger" />
                  Máquinas
                </label>
                <div className="flex items-center border border-gray-300 rounded-xl bg-white overflow-hidden h-11">
                  <button type="button" onClick={() => set('impostorCount', Math.max(1, formData.impostorCount - 1))} className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-danger font-black border-r border-gray-300 text-lg transition-colors flex-1">-</button>
                  <div className="w-16 text-center font-bold text-gray-900" id="setup-impostors">{formData.impostorCount}</div>
                  <button type="button" onClick={() => set('impostorCount', Math.min(Math.max(1, formData.totalPlayers - 2), formData.impostorCount + 1))} className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-danger font-black border-l border-gray-300 text-lg transition-colors flex-1">+</button>
                </div>
              </div>
            </div>

            {/* Word picker */}
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Palavra-chave da rodada
              </label>
              <select
                value={formData.wordId}
                onChange={(e) => set('wordId', e.target.value)}
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
