import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API_URL = 'http://localhost:4000/api/auth';

// Configure axios defaults
axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/me`);
      setUser(response.data.user);
      setError(null);
    } catch (err) {
      setUser(null);
      // If unauthorized, try to refresh token
      if (err.response && err.response.status === 401) {
        try {
          const refreshRes = await axios.post(`${API_URL}/refresh`);
          if (refreshRes.data.accessToken) {
            // Retry fetching user
            const retryRes = await axios.get(`${API_URL}/me`);
            setUser(retryRes.data.user);
            return;
          }
        } catch (refreshErr) {
          console.error("Session expired");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const register = async (formData) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Registration failed';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/login`, { email, password });
      return response.data; // Will indicate OTP sent
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login failed';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/verify-otp`, { email, otp });
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'OTP verification failed';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/logout`);
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      setUser(null);
    }
  };

  const logoutAll = async () => {
    try {
      await axios.post(`${API_URL}/logout-all`);
    } catch (err) {
      console.error('Logout all error', err);
    } finally {
      setUser(null);
    }
  };

  const updateProfile = async (formData) => {
    try {
      setError(null);
      const response = await axios.put(`${API_URL}/profile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Profile update failed';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      register,
      login,
      verifyOtp,
      logout,
      logoutAll,
      updateProfile,
      fetchCurrentUser,
      setError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
