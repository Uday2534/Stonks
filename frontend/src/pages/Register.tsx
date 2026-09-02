import { useState } from 'react';
import type { FormEvent } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { register } from '../apis/auth';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const handleSubmit = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const data =
        await register(
          {email,
          password
        });

      login(
        data.token,
        data.user
      );

      navigate('/dashboard');
    } catch {
      setError(
        'Registration failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-8"
      >
        <h1 className="mb-6 text-3xl font-bold text-white">
          Create Account
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"
        />

        {error && (
          <p className="mb-4 text-red-500">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-green-600 p-3 font-semibold text-white"
        >
          {loading
            ? 'Creating Account...'
            : 'Register'}
        </button>
        <p className="mt-4 text-center text-slate-400">
            Already have an account?{' '}
            <Link
                to="/"
                className="text-green-500"
            >
                Login
            </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;