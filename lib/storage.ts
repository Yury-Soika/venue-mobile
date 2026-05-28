import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'venue_token';
const LOCK_KEY = 'venue_lock_time';

export const storage = {
  getToken: () => SecureStore.getItemAsync(TOKEN_KEY),
  setToken: (token: string) => SecureStore.setItemAsync(TOKEN_KEY, token),
  deleteToken: () => SecureStore.deleteItemAsync(TOKEN_KEY),

  getLockTime: async () => {
    const val = await SecureStore.getItemAsync(LOCK_KEY);
    return val ? parseInt(val, 10) : null;
  },
  setLockTime: (ts: number) => SecureStore.setItemAsync(LOCK_KEY, String(ts)),
};
