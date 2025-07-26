import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

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
    // Check for existing session
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('lezelote-user');
      const token = localStorage.getItem('authToken');
      
      if (storedUser && token) {
        try {
          // Verify token is still valid
          const currentUser = await authAPI.getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          // Token invalid, clear storage
          localStorage.removeItem('lezelote-user');
          localStorage.removeItem('authToken');
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authAPI.login(email, password);
      const { access_token } = response;
      
      // Store token
      localStorage.setItem('authToken', access_token);
      
      // Get user info
      const currentUser = await authAPI.getCurrentUser();
      setUser(currentUser);
      localStorage.setItem('lezelote-user', JSON.stringify(currentUser));
      
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Échec de connexion' 
      };
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const newUser = await authAPI.register(userData);
      
      // Auto-login after registration
      const loginResult = await login(userData.email, userData.password);
      
      setLoading(false);
      return loginResult;
    } catch (error) {
      setLoading(false);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Échec d\'inscription' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lezelote-user');
    localStorage.removeItem('authToken');
  };

  const updateUser = async (userData) => {
    try {
      const updatedUser = await authAPI.updateCurrentUser(userData);
      setUser(updatedUser);
      localStorage.setItem('lezelote-user', JSON.stringify(updatedUser));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Échec de mise à jour' 
      };
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};