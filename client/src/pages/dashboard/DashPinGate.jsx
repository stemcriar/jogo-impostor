import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePinAuth } from '../../hooks/usePinAuth';
import { api } from '../../services/api';
import PinInput from '../../components/ui/PinInput';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { Monitor } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashPinGate() {
  const { login } = usePinAuth('dashboard');
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePinComplete = async (pin) => {
    setIsLoading(true);
    setError('');
    
    try {
      const res = await api.verifyPin(pin, 'dashboard');
      if (res.valid) {
        login();
        navigate('/dashboard');
      } else {
        setError('PIN incorreto. Tente novamente.');
      }
    } catch (err) {
      setError('Erro ao verificar PIN. Verifique sua conexão.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="dash-pin-gate" className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <img src="/stem-criar-logo.png" alt="STEM Criar" className="h-16 mx-auto mb-6 brightness-0 invert" />
          <h1 className="text-3xl font-bold text-white mb-2">Painel de Projeção</h1>
          <p className="text-gray-400">Insira o PIN de acesso à tela principal</p>
        </div>

        <Card padding="p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Monitor className="w-6 h-6 text-gray-700" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">PIN do Dashboard</h2>
          </div>

          <PinInput length={8} onComplete={handlePinComplete} id="dash-pin-input" />
          
          <div className="min-h-[24px] mt-4 text-center">
            {error && <p className="text-danger text-sm font-medium">{error}</p>}
          </div>

          {isLoading && (
            <div className="mt-4 flex justify-center">
              <Button disabled isLoading variant="ghost">Verificando...</Button>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
