import React from 'react';
import { motion } from 'framer-motion';

export default function PlayerButton({ playerNumber, onClick, disabled, id }) {
  return (
    <motion.button
      id={id}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      onClick={() => onClick(playerNumber)}
      disabled={disabled}
      className={`w-full aspect-square flex flex-col items-center justify-center rounded-2xl shadow-sm border-2 transition-colors ${
        disabled 
          ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
          : 'bg-yellow border-yellow-dark text-gray-900 hover:bg-yellow-light focus:ring-4 focus:ring-yellow focus:outline-none'
      }`}
    >
      <span className="text-sm sm:text-base font-semibold uppercase tracking-wider mb-1">Aluno</span>
      <span className="text-3xl sm:text-4xl font-bold">{playerNumber}</span>
    </motion.button>
  );
}
