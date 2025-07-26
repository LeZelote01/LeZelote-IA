import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockData } from '../data/mockData';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const storedUser = localStorage.getItem('lezelote-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    // Mock login - in real app, this would call the API
    const mockUser = mockData.user;
    if (email === mockUser.email && password === 'password') {
      setUser(mockUser);
      localStorage.setItem('lezelote-user', JSON.stringify(mockUser));
      setLoading(false);
      return { success: true };
    }
    setLoading(false);
    return { success: false, error: 'Invalid credentials' };
  };

  const register = async (userData) => {
    setLoading(true);
    // Mock registration
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      subscription: {
        plan: 'starter',
        status: 'active',
        nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    };
    setUser(newUser);
    localStorage.setItem('lezelote-user', JSON.stringify(newUser));
    setLoading(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lezelote-user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};