import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Briefcase, Lock, Key, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ResetPassword() {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.token) {
      setToken(location.state.token);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token || !newPassword) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      setMessage('');
      setLoading(true);
      await axios.post('http://localhost:4000/api/auth/reset-password', { token, newPassword });
      setMessage('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-300 rounded-sm p-10 flex flex-col items-center mb-4 shadow-sm">
          <div className="flex items-center gap-2 mb-6 mt-2">
            <Briefcase className="w-10 h-10 text-blue-600" />
            <span className="text-2xl font-bold tracking-tight text-gray-800">
              Employee Portal
            </span>
          </div>

          <h2 className="text-lg font-semibold text-gray-800 mb-2">Reset Your Password</h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Enter your reset token and choose a strong new password.
          </p>

          {error && (
            <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="w-full mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-md text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Reset Token"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>

        <div className="bg-white border border-gray-300 rounded-sm p-6 text-center shadow-sm">
          <Link to="/login" className="text-sm text-blue-500 font-semibold hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
