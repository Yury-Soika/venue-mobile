import { useState, useEffect, useCallback } from 'react';
import { api, LoginResponse } from '../lib/api';
import { storage } from '../lib/storage';

const SESSION_KEY = 'venue_mock_session';

export function useAuth() {
  const [user, setUser] = useState<LoginResponse['user'] | null>(null);
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storage.getToken().then(async (token) => {
      if (token) {
        try {
          const data = await api.me(token);
          setUser({ id: data.id, email: data.email, name: data.name, role: data.role });
          setRules((data as any).rules ?? []);
        } catch {
          await storage.deleteToken();
        }
      }
      setLoading(false);
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.login(email, password);
    await storage.setToken(res.access_token);
    setUser(res.user);
    setRules(res.rules ?? []);
    return res.user;
  }, []);

  const logout = useCallback(async () => {
    await storage.deleteToken();
    setUser(null);
    setRules([]);
  }, []);

  return { user, rules, loading, login, logout };
}
