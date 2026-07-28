import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePinAuth } from '../hooks/usePinAuth';
import { motion } from 'framer-motion';
import PinInput from '../components/ui/PinInput';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Lock } from 'lucide-react';

export default function Login() {
  const { login } = usePinAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePinComplete = (pin) => {
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const ok = login(pin);
      if (ok) {
        navigate('/mentor');
      } else {
        setError('PIN incorreto. Tente novamente.');
        setIsLoading(false);
      }
    }, 300);
  };

  return (
    <div id="login-page" className="min-h-screen bg-purple flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <img
            src="/jogo-impostor/stem-criar-logo.png"
            alt="STEM Criar"
            className="h-16 mx-auto mb-6 rounded-[10px] cursor-pointer"
            onClick={() => navigate('/')}
          />
          <h1 className="text-3xl font-bold text-white mb-2">PIN de Acesso</h1>
          <p className="text-purple-200">Insira o PIN de 8 dígitos para continuar</p>
        </div>

        <Card padding="p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-purple" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Acesso Restrito</h2>
          </div>

          <PinInput length={8} onComplete={handlePinComplete} id="login-pin-input" />

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
