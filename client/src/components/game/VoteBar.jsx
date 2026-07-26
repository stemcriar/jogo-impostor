import React from 'react';
import { motion } from 'framer-motion';

export default function VoteBar({ playerNumber, votes, totalVotes, id }) {
  const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
  
  return (
    <div id={id} className="flex flex-col items-center justify-end h-full w-full max-w-[60px] mx-auto gap-2">
      <div className="text-sm font-bold text-purple">{votes}</div>
      <div className="relative w-full h-48 bg-gray-100 rounded-t-lg overflow-hidden flex items-end">
        <motion.div
          layout
          initial={{ height: 0 }}
          animate={{ height: `${percentage}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="w-full bg-purple rounded-t-lg"
        />
      </div>
      <div className="text-xs font-semibold text-gray-600 mt-2 text-center break-words w-full">
        Aluno {playerNumber}
      </div>
    </div>
  );
}
