import React, { useState } from 'react';
import { Calendar, Mail, Lock, ArrowRight } from 'lucide-react';

interface LoginProps {
  onSuccess: () => void;
  onRegisterClick: () => void;
}

function Login({ onSuccess, onRegisterClick }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual login logic
    onSuccess();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-lg w-full max-w-md rounded-2xl shadow-2xl p-8 space-y-8 relative overflow-hidden">
        {/* Decorative gradient border */}
        <div className="absolute inset-0 border-2 border-transparent rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" style={{ padding: '2px', margin: '-2px', maskImage: 'linear-gradient(white, white)', WebkitMaskComposite: 'destination-out', maskComposite: 'exclude' }}></div>
        
        <div className="text-center relative">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-[3px] mb-4">
            <div className="bg-white rounded-full p-4 w-full h-full flex items-center justify-center">
              <Calendar className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">Welcome back</h2>
          <p className="mt-2 text-gray-600">Please sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-indigo-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-indigo-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <button type="button" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-medium transition-all duration-300 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Sign in
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center relative">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={onRegisterClick}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;