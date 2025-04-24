import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Calendar, Github, Facebook } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { jwtDecode } from 'jwt-decode';
import { storeTokenAndSetAxiosHeader, removeToken } from '../config/authUtils';

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded: { exp: number } = jwtDecode(token);
        if (Date.now() > decoded.exp * 1000) {
          removeToken();
          navigate('/login');
        } else {
          storeTokenAndSetAxiosHeader(token);
        }
      } catch {
        removeToken();
      }
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await login(formData.username, formData.password);
      const token = response.token;
      storeTokenAndSetAxiosHeader(token);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'github') => {
    let authProvider;
    switch (provider) {
      case 'google':
        authProvider = new GoogleAuthProvider();
        break;
      case 'facebook':
        authProvider = new FacebookAuthProvider();
        break;
      case 'github':
        authProvider = new GithubAuthProvider();
        break;
    }

    try {
      const result = await signInWithPopup(auth, authProvider);
      const token = await result.user.getIdToken();
      storeTokenAndSetAxiosHeader(token);
      navigate('/');
    } catch (err) {
      console.error(`Error during ${provider} login`, err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Calendar className="mx-auto h-12 w-12 text-indigo-600" />
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Welcome back</h2>
        <p className="mt-2 text-sm text-gray-600">
          Or{' '}
          <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <InputWithIcon
              id="username"
              label="Username"
              type="text"
              icon={<Mail />}
              value={formData.username}
              onChange={handleChange}
            />
            <InputWithIcon
              id="password"
              label="Password"
              type="password"
              icon={<Lock />}
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              <SocialButton icon="google" onClick={() => handleSocialLogin('google')} />
              <SocialButton icon="facebook" onClick={() => handleSocialLogin('facebook')} />
              <SocialButton icon="github" onClick={() => handleSocialLogin('github')} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputWithIcon({
  id,
  label,
  type,
  icon,
  value,
  onChange,
}: {
  id: string;
  label: string;
  type: string;
  icon: JSX.Element;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 relative">
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          required
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
        <span className="absolute left-3 top-2.5 text-gray-400">{icon}</span>
      </div>
    </div>
  );
}

function SocialButton({ icon, onClick }: { icon: string; onClick: () => void }) {
  const iconMap: Record<string, JSX.Element> = {
    google: <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-5 w-5" />,
    facebook: <Facebook className="h-5 w-5 text-blue-600" />,
    github: <Github className="h-5 w-5" />,
  };
  return (
    <button
      onClick={onClick}
      className="w-full flex justify-center p-2 border rounded-md hover:bg-gray-50"
    >
      {iconMap[icon]}
    </button>
  );
}
