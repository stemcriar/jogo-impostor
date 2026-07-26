import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import PageContainer from '../../components/layout/PageContainer';
import Header from '../../components/layout/Header';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { Pencil, Trash2, Plus, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WordManager() {
  const [words, setWords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentWord, setCurrentWord] = useState({ keyword: '', hint: '' });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadWords();
  }, []);

  const loadWords = async () => {
    try {
      const data = await api.getWords();
      setWords(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentWord.keyword || !currentWord.hint) return;

    try {
      if (isEditing) {
        await api.updateWord(currentWord.id, currentWord);
      } else {
        await api.createWord(currentWord);
      }
      setIsModalOpen(false);
      loadWords();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta palavra?')) {
      try {
        await api.deleteWord(id);
        loadWords();
      } catch (err) {
        alert(err.message || 'Erro ao excluir a palavra.');
        console.error(err);
      }
    }
  };

  const openAddModal = () => {
    setCurrentWord({ keyword: '', hint: '' });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (word) => {
    setCurrentWord(word);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  return (
    <PageContainer id="word-manager">
      <Header 
        title="Gerenciar Palavras" 
        rightContent={
          <Button variant="ghost" size="sm" onClick={() => navigate('/mentor')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        }
      />

      <div className="flex-1 mt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Banco de Palavras</h2>
          <Button onClick={openAddModal} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Nova Palavra
          </Button>
        </div>

        <Card padding="p-0">
          {isLoading ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="w-8 h-8 text-purple animate-spin" />
            </div>
          ) : words.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              Nenhuma palavra cadastrada ainda.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="p-4 font-semibold text-gray-600">Palavra-chave (Humano)</th>
                    <th className="p-4 font-semibold text-gray-600">Dica (Máquina)</th>
                    <th className="p-4 font-semibold text-gray-600 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {words.map((word) => (
                    <tr key={word.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="p-4 font-medium text-gray-900">{word.keyword}</td>
                      <td className="p-4 text-gray-600">{word.hint}</td>
                      <td className="p-4 flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditModal(word)} className="text-purple p-2">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(word.id)} className="text-danger p-2">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={isEditing ? 'Editar Palavra' : 'Nova Palavra'}
        id="word-modal"
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <Input 
            label="Palavra-chave (Para os Humanos)" 
            value={currentWord.keyword}
            onChange={(e) => setCurrentWord({...currentWord, keyword: e.target.value})}
            placeholder="Ex: Inteligência Artificial"
            required
            id="input-keyword"
          />
          <Input 
            label="Dica (Para a Máquina)" 
            value={currentWord.hint}
            onChange={(e) => setCurrentWord({...currentWord, hint: e.target.value})}
            placeholder="Ex: É uma tecnologia que simula raciocínio"
            required
            id="input-hint"
          />
          <div className="flex justify-end gap-3 mt-4">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
}
