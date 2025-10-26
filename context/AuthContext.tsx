import React, { createContext, useContext, ReactNode } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => User | null;
  signup: (email: string, password?: string, role?: 'customer' | 'seller') => User | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample users pre-loaded for demonstration purposes.
const sampleUsers: User[] = [
    { email: 'customer@shopsphere.com', password: 'password', role: 'customer' },
    { email: 'seller@shopsphere.com', password: 'password', role: 'seller' },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useLocalStorage<User[]>('users', sampleUsers);
  const [user, setUser] = useLocalStorage<User | null>('user', null);

  const login = (email: string, password?: string): User | null => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      return foundUser;
    }
    return null;
  };

  const signup = (email: string, password?: string, role: 'customer' | 'seller' = 'customer'): User | null => {
    const userExists = users.find(u => u.email === email);
    if (userExists) {
      return null; // User already exists
    }
    const newUser: User = { email, password, role };
    setUsers([...users, newUser]);
    setUser(newUser); // Automatically log in new user
    return newUser;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};