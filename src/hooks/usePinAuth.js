import { useState, useEffect } from 'react';
import { storage } from '../services/storage';

const MENTOR_PIN = '87654321';

export function usePinAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = storage.getAuth();
    setIsAuthenticated(stored === 'mentor');
    setIsLoading(false);
  }, []);

  const login = (pin) => {
    if (pin === MENTOR_PIN) {
      storage.setAuth('mentor');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    storage.clearAuth();
    setIsAuthenticated(false);
  };

  return { isAuthenticated, isLoading, login, logout };
}
