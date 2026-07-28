import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../../services/storage';
import PageContainer from '../../components/layout/PageContainer';
import Header from '../../components/layout/Header';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { Pencil, Trash2, Plus, ArrowLeft } from 'lucide-react';

export default function WordManager() {
  const navigate = useNavigate();
  const [words, setWords] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentWord, setCurrentWord] = useState({ id: null, keyword: '', hint: '' });
  const [isEditing, setIsEditing] = useState(false);

  const loadWords = () => setWords(storage.getWords());

  useEffect(() => { loadWords(); }, []);

  const handleSave = (e) => {
    e.preventDefault();
    if (!currentWord.keyword.trim() || !currentWord.hint.trim()) return;

    if (isEditing) {
      storage.updateWord(currentWord.id, currentWord.keyword, currentWord.hint);
    } else {
      storage.addWord(currentWord.keyword, currentWord.hint);
    }

    setIsModalOpen(false);
    loadWords();
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta palavra?')) {
      storage.deleteWord(id);
      loadWords();
    }
  };

  const openAdd = () => {
    setCurrentWord({ id: null, keyword: '', hint: '' });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEdit = (word) => {
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
          <Button onClick={openAdd} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Nova Palavra
          </Button>
        </div>

        <Card padding="p-0">
          {words.length === 0 ? (
            <div className="p-12 text-center text-gray-500">Nenhuma palavra cadastrada ainda.</div>
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
                  {words.map(word => (
                    <tr key={word.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="p-4 font-medium text-gray-900">{word.keyword}</td>
                      <td className="p-4 text-gray-600">{word.hint}</td>
                      <td className="p-4 flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(word)} className="text-purple p-2">
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
            onChange={(e) => setCurrentWord({ ...currentWord, keyword: e.target.value })}
            placeholder="Ex: Inteligência Artificial"
            required
            id="input-keyword"
          />
          <Input
            label="Dica (Para a Máquina)"
            value={currentWord.hint}
            onChange={(e) => setCurrentWord({ ...currentWord, hint: e.target.value })}
            placeholder="Ex: Tecnologia que simula raciocínio"
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
