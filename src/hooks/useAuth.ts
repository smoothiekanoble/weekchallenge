import { useState, useEffect } from 'react';
import { AuthSession } from '../types';

const SESSION_KEY = 'paw_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const sessionStr = localStorage.getItem(SESSION_KEY);
      if (!sessionStr) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      const session: AuthSession = JSON.parse(sessionStr);
      if (Date.now() > session.expiresAt) {
        localStorage.removeItem(SESSION_KEY);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      setIsAuthenticated(true);
      setIsLoading(false);
    } catch (error) {
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  const login = (password: string): boolean => {
    const correctPassword = import.meta.env.VITE_APP_PASSWORD || 'default';
    
    if (password === correctPassword) {
      const session: AuthSession = {
        token: btoa(`${Date.now()}-${Math.random()}`),
        expiresAt: Date.now() + SESSION_DURATION,
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      setIsAuthenticated(true);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
};

