import { useState, useEffect } from 'react';
import { getDeviceId } from '../utils/device-id';

export function useVoterDevice(gameId, currentPhase) {
  const [hasVoted, setHasVoted] = useState(false);
  const deviceId = getDeviceId();

  useEffect(() => {
    // Reset vote state when phase changes back to voting or round
    if (currentPhase !== 'voting') {
      setHasVoted(false);
    }
  }, [currentPhase, gameId]);

  const markAsVoted = () => setHasVoted(true);

  return { deviceId, hasVoted, markAsVoted };
}
