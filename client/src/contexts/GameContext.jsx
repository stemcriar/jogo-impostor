import React, { createContext, useContext } from 'react';
import { useGameState } from '../hooks/useGameState';

const GameContext = createContext(null);

export function GameProvider({ children, gameId, role }) {
  const { gameState, isLoading } = useGameState(gameId, role);

  return (
    <GameContext.Provider value={{ gameState, isLoading, gameId, role }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
