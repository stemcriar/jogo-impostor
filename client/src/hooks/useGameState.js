import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket, wsService } from '../services/ws';

export function useGameState(gameId, role) {
  const [gameState, setGameState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!gameId || !role) return;

    wsService.connect();
    wsService.joinGame(gameId, role);
    wsService.requestSync(gameId, role);

    // sync:state receives the full sanitized game state directly
    const handleSync = (state) => {
      setGameState(state);
      setIsLoading(false);
    };

    const handlePhaseChanged = (data) => {
      setGameState((prev) => prev ? { ...prev, ...data } : data);
    };

    const handleVoteUpdate = (data) => {
      setGameState((prev) => prev ? { ...prev, votes: data.votes, totalVotes: data.totalVotes } : prev);
    };

    const handleGameResult = (result) => {
      setGameState((prev) => prev ? { ...prev, result, phase: 'result' } : prev);
    };

    const handleGameDeleted = () => {
      if (role === 'mentor') navigate('/mentor');
      else if (role === 'dashboard') navigate('/dashboard');
      else navigate('/');
    };

    socket.on('sync:state', handleSync);
    socket.on('game:phase_changed', handlePhaseChanged);
    socket.on('vote:update', handleVoteUpdate);
    socket.on('game:result', handleGameResult);
    socket.on('game:deleted', handleGameDeleted);

    return () => {
      socket.off('sync:state', handleSync);
      socket.off('game:phase_changed', handlePhaseChanged);
      socket.off('vote:update', handleVoteUpdate);
      socket.off('game:result', handleGameResult);
      socket.off('game:deleted', handleGameDeleted);
    };
  }, [gameId, role]);

  return { gameState, isLoading };
}
