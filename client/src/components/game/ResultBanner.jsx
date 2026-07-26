import React from 'react';
import { motion } from 'framer-motion';
import { RESULT_TYPES } from '../../utils/constants';
import { Bot, Users } from 'lucide-react';

export default function ResultBanner({ result, id }) {
  if (!result) return null;
  
  const { winner, mostVoted, word, hint, machines } = result;
  const isHumanWin = winner === RESULT_TYPES.HUMANS_WIN;
  const bgColor = isHumanWin ? 'bg-success' : 'bg-danger';
  const title = isHumanWin ? 'Humanos Vencem!' : 'A Máquina Venceu!';
  const Icon = isHumanWin ? Users : Bot;
  
  const machinesText = machines && machines.length > 1 
    ? `As máquinas eram os Alunos: ${machines.join(', ')}`
    : `A máquina era o Aluno: ${machines?.[0]}`;

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className={`w-full text-white overflow-hidden rounded-2xl shadow-lg ${bgColor}`}
    >
      <div className="p-8 text-center border-b border-white/20">
        <Icon className="w-16 h-16 mx-auto mb-4 text-white/90" />
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 uppercase tracking-wider drop-shadow-md">
          {title}
        </h2>
        {mostVoted && (
          <p className="text-xl md:text-2xl font-medium text-white/90">
            O Aluno {mostVoted} recebeu mais votos e {isHumanWin ? 'ERA a máquina!' : 'NÃO era a máquina.'}
          </p>
        )}
      </div>
      
      <div className="p-6 bg-black/10 flex flex-col items-center gap-6">
        <div className="text-lg md:text-xl font-bold px-6 py-3 bg-white/20 rounded-full">
          {machinesText}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
          <div className="flex-1 bg-white/20 p-4 rounded-xl text-center">
            <span className="block text-sm uppercase tracking-wide mb-1 opacity-80">Palavra-chave</span>
            <span className="block text-2xl font-bold">{word}</span>
          </div>
          <div className="flex-1 bg-white/20 p-4 rounded-xl text-center">
            <span className="block text-sm uppercase tracking-wide mb-1 opacity-80">Dica da Máquina</span>
            <span className="block text-2xl font-bold">{hint}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
