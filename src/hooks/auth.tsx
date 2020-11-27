import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

interface AuthState {
  user: object;
  token: string;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextInterface {
  user: object;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextInterface>(
  {} as AuthContextInterface,
);

export function useAuth(): AuthContextInterface {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState);

  useEffect(() => {
    async function loadStoragedData(): Promise<void> {
      const [token, user] = await AsyncStorage.multiGet([
        '@Gobarber:token',
        '@Gobarber:user',
      ]);

      if (token[1] && user[1]) {
        setData({ token: token[1], user: JSON.parse(user[1]) });
      }
    }
    loadStoragedData();
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    const { user, token } = response.data;

    await AsyncStorage.multiSet([
      ['@Gobarber:token', token],
      ['@Gobarber:user', JSON.stringify(user)],
    ]);

    setData({ user, token });
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove(['@Gobarber:token', '@Gobarber:user']);
    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
