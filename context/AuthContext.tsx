import { createContext, useContext, ReactNode } from 'react';
import { createMongoAbility, MongoAbility } from '@casl/ability';
import { useAuth } from '../hooks/useAuth';
import { LoginResponse } from '../lib/api';

export type Action = 'manage' | 'read' | 'create' | 'update' | 'delete';
export type Subject = 'Booking' | 'Event' | 'Guest' | 'Staff' | 'Table' | 'Analytics' | 'all';
export type AppAbility = MongoAbility<[Action, Subject]>;

type AuthContextValue = {
  user: LoginResponse['user'] | null;
  ability: AppAbility;
  loading: boolean;
  login: (email: string, password: string) => Promise<LoginResponse['user']>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, rules, loading, login, logout } = useAuth();
  const ability = createMongoAbility<[Action, Subject]>(rules);

  return (
    <AuthContext.Provider value={{ user, ability, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
