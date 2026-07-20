import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, User, Mail, Lock, Camera, AlertCircle } from 'lucide-react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [localError, setLocalError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setLocalError('Please fill in all required fields');
      return;
    }

    try {
      setLocalError('');
      setLoading(true);

      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('role', role);
      if (imageFile) {
        formData.append('profileImage', imageFile);
      }

      await register(formData);
      navigate('/'); // Go to dashboard/home
    } catch (err) {
      setLocalError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Main Register Card */}
        <div className="bg-white border border-gray-300 rounded-sm p-10 flex flex-col items-center mb-4 shadow-sm">
          {/* Employee Management Logo Text */}
          <div className="flex items-center gap-2 mb-4 mt-2">
            <Briefcase className="w-10 h-10 text-blue-600" />
            <span className="text-2xl font-bold tracking-tight text-gray-800">
              Employee Portal
            </span>
          </div>

          <p className="text-gray-500 font-semibold text-center text-sm mb-6">
            Register a new employee account to access the portal.
          </p>

          {localError && (
            <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{localError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center justify-center mb-4">
              <div className="relative w-24 h-24 rounded-full border-2 border-gray-300 overflow-hidden bg-gray-100 flex items-center justify-center group">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
                <label className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              <span className="text-xs text-gray-500 mt-2">Upload Profile Picture</span>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

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

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>
        </div>

        {/* Log In Card */}
        <div className="bg-white border border-gray-300 rounded-sm p-6 text-center shadow-sm">
          <p className="text-sm text-gray-600">
            Have an account?{' '}
            <Link to="/login" className="text-blue-500 font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
