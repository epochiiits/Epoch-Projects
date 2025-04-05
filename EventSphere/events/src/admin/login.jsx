import React, { useEffect, useState } from 'react';
import { Lock, Mail } from 'lucide-react';
import { Apis } from '../apiserveices/api'
import useAuth from '../hooks/useAuth'
import Cookie from 'js-cookie'
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
useAuth({ 'userType': 'admin'})
const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Reset error message before making the request

    try {
      const response = await Apis.adminlogin({ email, password });

      if (response.ok) {
        // Assume the response contains { success: true, data: { id, userType }}
        const data = await response.json();
        
        // Set the admin cookie with data.id and userType
        Cookie.set('admin', data.id);
        // You can call `useAuth` to manage the redirection based on the `userType`
      } else {
        // Handle login failure
        throw new Error('Login failed');
      }
    } catch (err) {
      setError('Login failed. Please check your credentials');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="animate-float absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 300}px`,
              height: `${Math.random() * 300}px`,
              background: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
                Math.random() * 255
              }, 0.1)`,
              animation: `float ${10 + Math.random() * 20}s linear infinite`,
              animationDelay: `${-Math.random() * 20}s`,
            }}
          />
        ))}
      </div>

      {/* Login form */}
      <div className="relative z-10 w-full max-w-md p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
          <p className="text-gray-300">Enter your credentials to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 text-white placeholder-gray-400 transition-colors"
                placeholder="Email address"
                required
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 text-white placeholder-gray-400 transition-colors"
                placeholder="Password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}