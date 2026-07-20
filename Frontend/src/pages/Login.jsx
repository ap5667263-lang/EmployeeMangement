import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Lock, Mail, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }
    try {
      setLocalError('');
      setLoading(true);
      const res = await login(email, password);
      // If successful, navigate to OTP verification page
      navigate('/verify-otp', { state: { email } });
    } catch (err) {
      setLocalError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Employee Management Logo Text */}
        <div className="brand-header">
          <Briefcase className="brand-icon" />
          <span className="brand-title">Employee Portal</span>
        </div>

        <p className="brand-subtitle">
          Log in to access your employee dashboard and manage your account.
        </p>

        {localError && (
          <div className="alert alert-error">
            <AlertCircle className="alert-icon" />
            <span>{localError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Sending OTP...' : 'Log In'}
          </button>
        </form>

        <div className="divider">
          <div className="divider-line"></div>
          <span className="divider-text">OR</span>
          <div className="divider-line"></div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link to="/forgot-password" className="link link-sm">
            Forgot password?
          </Link>
        </div>
      </div>

      {/* Sign Up Card */}
      <div className="auth-footer-card">
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" className="link">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
