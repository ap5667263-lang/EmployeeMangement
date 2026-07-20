import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Key, AlertCircle } from 'lucide-react';

export default function VerifyOtp() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [localError, setLocalError] = useState('');
  const [loading, setLoading] = useState(false);
  const { verifyOtp } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !otp) {
      setLocalError('Please enter both email and OTP');
      return;
    }

    try {
      setLocalError('');
      setLoading(true);
      await verifyOtp(email, otp);
      navigate('/'); // Go to dashboard/home
    } catch (err) {
      setLocalError(err.message || 'Invalid or expired OTP');
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

          <h2 className="text-lg font-semibold text-gray-800 mb-2">Enter Security Code</h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            We sent a 6-digit security code to <span className="font-semibold text-gray-700">{email || 'your email'}</span>.
          </p>

          {localError && (
            <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{localError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {!location.state?.email && (
              <div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Confirm your email"
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="6-digit OTP"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-sm tracking-widest font-semibold text-center placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        </div>

        <div className="bg-white border border-gray-300 rounded-sm p-6 text-center shadow-sm">
          <p className="text-sm text-gray-600">
            Didn't get the code?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-500 font-semibold hover:underline focus:outline-none"
            >
              Go back to Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
