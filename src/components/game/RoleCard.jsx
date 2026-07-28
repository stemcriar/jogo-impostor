import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function RoleCard({ keyword, hint, isMachine, id, onRevealComplete }) {
  const [isRevealed, setIsRevealed] = useState(false);

  const handlePressStart = (e) => {
    e.preventDefault();
    setIsRevealed(true);
    if (onRevealComplete) onRevealComplete();
  };

  const handlePressEnd = (e) => {
    e.preventDefault();
    setIsRevealed(false);
  };

  return (
    <div
      id={id}
      className="relative w-full max-w-sm aspect-[3/4] mx-auto select-none touch-none cursor-pointer"
      onPointerDown={handlePressStart}
      onPointerUp={handlePressEnd}
      onPointerLeave={handlePressEnd}
      onContextMenu={(e) => e.preventDefault()}
    >
      <motion.div
        className="w-full h-full relative"
        animate={{ rotateY: isRevealed ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front — hidden state */}
        <div
          className="absolute inset-0 w-full h-full bg-white rounded-2xl shadow-md border-2 border-purple-light flex flex-col items-center justify-center p-8 text-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Cartão Secreto</h3>
          <p className="text-gray-500 text-sm">Mantenha pressionado para revelar seu papel</p>
        </div>

        {/* Back — revealed state */}
        <div
          className={`absolute inset-0 w-full h-full bg-white rounded-2xl shadow-md border-4 flex flex-col items-center justify-center p-8 text-center ${isMachine ? 'border-danger' : 'border-success'}`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <h2 className={`text-2xl font-bold mb-8 ${isMachine ? 'text-danger' : 'text-success'}`}>
            {isMachine ? 'Você é a MÁQUINA' : 'Você é HUMANO'}
          </h2>
          <div className="w-full bg-gray-50 rounded-xl p-6 border border-gray-100">
            <p className="text-sm text-gray-500 mb-2 uppercase tracking-wide font-semibold">
              {isMachine ? 'Sua dica:' : 'A Palavra-chave:'}
            </p>
            <p className="text-2xl font-bold text-gray-900 break-words">
              {isMachine ? hint : keyword}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
