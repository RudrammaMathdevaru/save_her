/**
 * File: src/context/AuthContext.jsx
 * Updated: 2026-03-18
 *
 * Purpose:
 * - Global authentication state management
 * - Provides user data and auth methods to all components
 * - Handles login, logout, registration
 *
 * Changes:
 * - Created AuthContext with provider
 * - Integrated with auth service
 * - Added loading states
 *
 * Connected Modules:
 * - Used by App.jsx and all components needing auth
 * - Depends on auth.service.js
 *
 * Dependencies:
 * - react: createContext, useContext, useReducer
 */

import React, { createContext, useContext, useEffect, useReducer } from 'react';
import * as authService from '../services/auth.service.js';
import { useToast } from '../hooks/useToast.js';

// Initial state
const initialState = {
  user: authService.getStoredUser(),
  isAuthenticated: authService.isAuthenticated(),
  isLoading: true,
  error: null,
};

// Action types
const ACTIONS = {
  SET_USER: 'SET_USER',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  LOGOUT: 'LOGOUT',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
        error: null,
      };
    case ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext(null);

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const toast = useToast();

  // Verify token on mount
  useEffect(() => {
    const verifyAuth = async () => {
      if (state.isAuthenticated) {
        try {
          const user = await authService.getCurrentUser();
          dispatch({ type: ACTIONS.SET_USER, payload: user });
        } catch (error) {
          // Token invalid - logout
          await authService.logout();
          dispatch({ type: ACTIONS.LOGOUT });
        }
      } else {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    };

    verifyAuth();
  }, []);

  // Login handler
  const login = async (email, password, rememberMe) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    
    try {
      const response = await authService.login(email, password, rememberMe);
      dispatch({ type: ACTIONS.SET_USER, payload: response.user });
      toast.success('Login successful!');
      return response;
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Register handler
  const register = async (userData) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    
    try {
      const response = await authService.register(userData);
      dispatch({ type: ACTIONS.SET_USER, payload: response.user });
      toast.success('Registration successful!');
      return response;
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      toast.error(error.message || 'Registration failed');
      throw error;
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Logout handler
  const logout = async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    
    try {
      await authService.logout();
      dispatch({ type: ACTIONS.LOGOUT });
      toast.info('Logged out successfully');
    } catch (error) {
      // Still logout locally
      await authService.logout();
      dispatch({ type: ACTIONS.LOGOUT });
      toast.error('Error during logout, but you are logged out');
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Update user data
  const updateUser = (userData) => {
    dispatch({ type: ACTIONS.SET_USER, payload: userData });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};