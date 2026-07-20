import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Briefcase, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email');
      return;
    }

    try {
      setError('');
      setMessage('');
      setLoading(true);
      const response = await axios.post('http://localhost:4000/api/auth/forgot-password', { email });
      setMessage('Reset token generated successfully!');

      // Redirect to reset password page after 2 seconds, passing the token and email
      setTimeout(() => {
        navigate('/reset-password', { state: { token: response.data.token } });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate reset token');
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

          <h2 className="text-lg font-semibold text-gray-800 mb-2">Trouble Logging In?</h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Enter your email and we'll send you a token to get back into your account.
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
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Sending...' : 'Send Login Link'}
            </button>
          </form>

          <div className="relative flex py-5 items-center w-full">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-xs font-semibold uppercase">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <Link
            to="/register"
            className="text-xs text-gray-900 hover:underline font-semibold"
          >
            Create New Account
          </Link>
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
