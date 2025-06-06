import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegLog() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [user_name, setName] = useState(''); //OnLY for reg
  const [email, setEmail] = useState('');
  const [passcode, setPasscode] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const url = isSignUp
        ? `${API_BASE}/api/auth/signup`
        : `${API_BASE}/api/auth/login`;

      const payload = isSignUp
        ? { user_name, email, passcode }
        : { email, passcode };

      const res = await axios.post(url, payload);
      localStorage.setItem('token', res.data.token);
      console.log(localStorage.setItem('token', res.data.token));

      navigate('/jobBoard'); // Redirect on successful login or signup
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = (err.response?.data as { msg?: string })?.msg;
        setError(message || 'Authentication failed');
      } else {
        setError('Something went wrong');
      }
    }
  };
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus on the first input when form mode changes
    firstInputRef.current?.focus();
  }, []);

  const validatePassword = (pwd: string) => {
    const strongPattern =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (strongPattern.test(pwd)) {
      setPasswordStrength('Strong password');
    } else {
      setPasswordStrength('Use 8+ chars, uppercase, number & symbol');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded p-8">
        <h2 className="mb-6 text-center text-2xl font-semibold text-green-900">
          {isSignUp ? 'Sign Up' : 'Login'}
        </h2>

        {error && (
          <p className="mb-4 text-center text-sm text-red-500">{error}</p>
        )}

        {isSignUp && (
          <input
            type="text"
            placeholder="Username"
            className="mb-4 w-full rounded bg-gray-200 p-2 outline-none"
            value={user_name}
            onChange={(e) => setName(e.target.value)}
            ref={isSignUp ? firstInputRef : null}
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className="mb-4 w-full rounded bg-gray-200 p-2 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          ref={!isSignUp ? firstInputRef : null}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="mb-2 w-full rounded bg-gray-200 p-2 outline-none"
          value={passcode}
          onChange={(e) => {
            setPasscode(e.target.value);
            validatePassword(e.target.value);
          }}
          required
        />
        {isSignUp && passcode && (
          <p
            className={`mb-4 text-sm ${passwordStrength === 'Strong password' ? 'text-green-600' : 'text-yellow-600'}`}
          >
            {passwordStrength}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded bg-emerald-500 py-2 text-white hover:bg-emerald-600"
        >
          {isSignUp ? 'Create Account' : 'Sign In'}
        </button>

        <p className="mt-4 text-center text-sm">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="ml-1 text-emerald-500 hover:underline"
          >
            {isSignUp ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </form>
    </div>
  );
}
