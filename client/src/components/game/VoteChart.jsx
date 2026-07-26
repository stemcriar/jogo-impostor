import React from 'react';
import VoteBar from './VoteBar';

export default function VoteChart({ totalPlayers, votes, totalVotes, id }) {
  // Generate array of players 1 to N
  const players = Array.from({ length: totalPlayers }, (_, i) => i + 1);

  return (
    <div id={id} className="w-full h-full p-4 flex items-end justify-center gap-2 sm:gap-4 overflow-x-auto min-h-[300px]">
      {players.map((playerNum) => {
        const playerVotes = votes?.[playerNum] || 0;
        return (
          <VoteBar 
            key={playerNum} 
            playerNumber={playerNum} 
            votes={playerVotes} 
            totalVotes={totalVotes || 0} 
            id={`votebar-${playerNum}`}
          />
        );
      })}
    </div>
  );
}
