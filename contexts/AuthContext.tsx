import React, { createContext, useState, useContext, useEffect } from 'react';
import { router } from 'expo-router';
import { UserProfile } from '../types';

// Mock user data
const MOCK_USER: UserProfile = {
  id: 'user123',
  username: 'rashid89',
  displayName: 'Rashid Khan',
  email: 'rashid.k@example.com',
  phone: '+91 9876543210',
  avatarUrl: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg',
  isKycVerified: true,
  walletBalance: 2500,
  createdAt: '2023-05-10T14:30:00Z',
  lastLogin: '2023-06-15T09:45:00Z',
  referralCode: 'RASHID500',
  state: 'Maharashtra',
};

type AuthContextType = {
  user: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: () => {},
  isAuthenticated: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        // In a real app, you would check for an existing token in storage
        // and validate it with your backend

        // For demo purposes, we'll simulate auth after a brief delay
        setTimeout(() => {
          // Uncomment to start with a logged-in user
          // setUser(MOCK_USER);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to check session:', error);
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, you would validate credentials with your backend
      // For demo purposes, we'll simulate a successful login
      setTimeout(() => {
        setUser(MOCK_USER);
        setIsLoading(false);
        router.replace('/(tabs)');
      }, 1000);
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    setIsLoading(true);
    try {
      // In a real app, you would register the user with your backend
      // For demo purposes, we'll simulate a successful registration
      setTimeout(() => {
        const newUser = { ...MOCK_USER, email, username };
        setUser(newUser);
        setIsLoading(false);
        router.replace('/(tabs)');
      }, 1000);
    } catch (error) {
      console.error('Registration failed:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const signOut = () => {
    // Clear user data and navigate to login
    setUser(null);
    router.replace('/auth/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;