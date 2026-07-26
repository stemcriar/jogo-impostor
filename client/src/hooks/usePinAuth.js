import { useState, useEffect } from 'react';

export function usePinAuth(type) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authStatus = sessionStorage.getItem(`auth_${type}`);
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [type]);

  const login = () => {
    sessionStorage.setItem(`auth_${type}`, 'true');
    setIsAuthenticated(true);
  };

  const logout = () => {
    sessionStorage.removeItem(`auth_${type}`);
    setIsAuthenticated(false);
  };

  return { isAuthenticated, isLoading, login, logout };
}
