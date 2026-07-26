import { useEffect } from 'react';
import { socket, wsService } from '../services/ws';

export function useWebSocket() {
  useEffect(() => {
    wsService.connect();
    
    return () => {
      // We don't disconnect on unmount of a single hook because it's a singleton,
      // but we could handle specific component cleanup here if needed.
    };
  }, []);

  return { socket, wsService };
}
