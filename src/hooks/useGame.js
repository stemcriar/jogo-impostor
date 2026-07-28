import { useState, useCallback } from 'react';
import { storage } from '../services/storage';

/**
 * Hook que expõe o estado do jogo ativo e mutações síncronas via LocalStorage.
 * Substitui completamente o antigo useGameState que dependia de WebSocket.
 */
export function useGame() {
  const [gameState, setGameState] = useState(() => storage.getActiveGame());

  const saveAndSet = useCallback((newState) => {
    storage.saveGame(newState);
    setGameState(newState);
  }, []);

  const patchAndSet = useCallback((patch) => {
    setGameState(prev => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      storage.saveGame(next);
      return next;
    });
  }, []);

  const clearAndReset = useCallback(() => {
    storage.clearGame();
    setGameState(null);
  }, []);

  return {
    gameState,
    setGame: saveAndSet,
    patchGame: patchAndSet,
    clearGame: clearAndReset,
  };
}
