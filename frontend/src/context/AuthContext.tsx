import {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';
import type { ReactNode } from 'react';

type User = {
  id: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;

  login: (
    token: string,
    user: User
  ) => void;

  logout: () => void;
};

const AuthContext =
  createContext<AuthContextType | null>(
    null
  );

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({
  children,
}: Props) => {
  const [token, setToken] =
    useState<string | null>(null);

  const [user, setUser] =
    useState<User | null>(null);

  useEffect(() => {
    const storedToken =
      localStorage.getItem('token');

    const storedUser =
      localStorage.getItem('user');

    if (
      storedToken &&
      storedUser
    ) {
      setToken(storedToken);

      setUser(
        JSON.parse(storedUser)
      );
    }
  }, []);

  const login = (
    token: string,
    user: User
  ) => {
    localStorage.setItem(
      'token',
      token
    );

    localStorage.setItem(
      'user',
      JSON.stringify(user)
    );

    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem(
      'token'
    );

    localStorage.removeItem(
      'user'
    );

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within AuthProvider'
    );
  }

  return context;
};