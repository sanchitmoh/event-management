import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Calendar, User } from 'lucide-react';
import AuthService from '../services/auth.service';
import type { SignupRequest } from '../services/AuthService';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [formData, setFormData] = useState<SignupRequest>({
    username: '',
    email: '',
    password: '',
    fullName: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'confirmPassword') {
      setConfirmPassword(value);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await AuthService.register(formData);
      await login(formData.username, formData.password);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Calendar className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            sign in to your account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 p-4 rounded-md text-red-800 text-sm">
              {error}
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {[
              { label: 'Username', name: 'username', icon: User, type: 'text', autoComplete: 'username' },
              { label: 'Full Name', name: 'fullName', icon: User, type: 'text', autoComplete: 'name' },
              { label: 'Email address', name: 'email', icon: Mail, type: 'email', autoComplete: 'email' },
              { label: 'Password', name: 'password', icon: Lock, type: 'password', autoComplete: 'new-password' },
              { label: 'Confirm Password', name: 'confirmPassword', icon: Lock, type: 'password', autoComplete: 'new-password' }
            ].map(({ label, name, icon: Icon, ...rest }) => (
              <div key={name}>
                <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                  {label}
                </label>
                <div className="mt-1 relative">
                  <input
                    id={name}
                    name={name}
                    value={name === 'confirmPassword' ? confirmPassword : formData[name as keyof SignupRequest]}
                    onChange={handleChange}
                    required
                    minLength={name.includes('password') ? 6 : undefined}
                    className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    {...rest}
                  />
                  <Icon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
                {name === 'password' && (
                  <p className="mt-1 text-xs text-gray-500">Password must be at least 6 characters</p>
                )}
              </div>
            ))}

            <div>
              <button
                type="submit"
                disabled={loading}
                aria-label="Create account"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
