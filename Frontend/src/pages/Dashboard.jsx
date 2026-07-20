import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  Briefcase, User, Mail, Shield, LogOut, Settings,
  Lock, Laptop, Globe, Calendar, CheckCircle2, AlertCircle, Camera
} from 'lucide-react';

export default function Dashboard() {
  const { user, logout, logoutAll, updateProfile } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  // Profile update state
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(user?.profileImage || null);
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const fetchSessions = async () => {
    try {
      setSessionsLoading(true);
      const response = await axios.get('http://localhost:4000/api/auth/sessions');
      setSessions(response.data.sessions || []);
    } catch (err) {
      console.error('Failed to fetch sessions', err);
    } finally {
      setSessionsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

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

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setProfileError('');
      setProfileMessage('');
      setProfileLoading(true);

      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await updateProfile(formData);
      setProfileMessage('Profile updated successfully!');
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      setPasswordError('');
      setPasswordMessage('');
      setPasswordLoading(true);

      await axios.post('http://localhost:4000/api/auth/change-password', {
        currentPassword,
        newPassword
      });

      setPasswordMessage('Password changed successfully! Logging out...');
      setTimeout(() => {
        logout();
      }, 2000);
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold tracking-tight text-gray-800">
              Employee Portal
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-gray-300" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-500" />
                </div>
              )}
              <span className="text-sm font-semibold text-gray-700">{user?.username}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1 text-sm font-semibold text-red-500 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Grid */}
      <main className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Profile Card & Settings */}
        <div className="md:col-span-1 space-y-6">
          {/* Profile Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col items-center text-center">
            <div className="relative w-24 h-24 rounded-full border-2 border-pink-500 p-1 mb-4">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-800">{user?.username}</h2>
            <p className="text-sm text-gray-500 mb-4">{user?.email}</p>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span className="capitalize">{user?.role}</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Account Actions</h3>
            <button
              onClick={logoutAll}
              className="w-full py-2.5 px-4 border border-red-200 rounded-md text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout From All Devices
            </button>
          </div>
        </div>

        {/* Right Column: Forms & Sessions */}
        <div className="md:col-span-2 space-y-6">
          {/* Edit Profile Form */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
              <Settings className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-bold text-gray-800">Edit Profile</h3>
            </div>

            {profileError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{profileError}</span>
              </div>
            )}

            {profileMessage && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-md text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{profileMessage}</span>
              </div>
            )}

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-16 h-16 rounded-full border border-gray-300 overflow-hidden bg-gray-50 flex items-center justify-center group">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-gray-400" />
                  )}
                  <label className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <Camera className="w-4 h-4 text-white" />
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">{user?.username}</p>
                  <p className="text-xs text-gray-500">Change profile photo</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Username</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={profileLoading}
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
              >
                {profileLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
              <Lock className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-bold text-gray-800">Change Password</h3>
            </div>

            {passwordError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordMessage && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-md text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{passwordMessage}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
              >
                {passwordLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

          {/* Active Sessions List */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <Laptop className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-bold text-gray-800">Active Sessions</h3>
              </div>
              <button
                onClick={fetchSessions}
                className="text-xs font-semibold text-blue-500 hover:underline"
              >
                Refresh
              </button>
            </div>

            {sessionsLoading ? (
              <div className="text-center py-4 text-sm text-gray-500">Loading sessions...</div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-4 text-sm text-gray-500">No active sessions found.</div>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session._id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-md mt-0.5">
                        <Laptop className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {session.userAgent || 'Unknown Device'}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Globe className="w-3.5 h-3.5" />
                            IP: {session.ip || 'Unknown'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            Created: {new Date(session.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    {session.revoked ? (
                      <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-1 rounded">Revoked</span>
                    ) : (
                      <span className="text-xs font-semibold text-green-500 bg-green-50 px-2 py-1 rounded">Active</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
