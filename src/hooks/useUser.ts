import { useState, useEffect } from 'react';
import { useTelegramApp } from './useTelegramApp';

interface User {
  id: string;
  telegram_id: number;
  username?: string;
  first_name: string;
  last_name?: string;
  phone?: string;
  email?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export function useUser() {
  const { webApp, isReady, getUser } = useTelegramApp();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady || !webApp) {
      setLoading(false);
      return;
    }

    const registerOrGetUser = async () => {
      try {
        setLoading(true);
        setError(null);

        const telegramUser = getUser();
        
        if (!telegramUser) {
          throw new Error('Telegram user not available');
        }
        
        // Try to register/get user
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            telegram_id: telegramUser.id,
            username: telegramUser.username,
            first_name: telegramUser.first_name,
            last_name: telegramUser.last_name,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to register user');
        }

        setUser(data.user);
      } catch (error) {
        console.error('Error registering user:', error);
        setError(error instanceof Error ? error.message : 'Failed to register user');
      } finally {
        setLoading(false);
      }
    };

    registerOrGetUser();
  }, [isReady, webApp, getUser]);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
  };
} 