import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegLog() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [user_name, setName] = useState(''); //OnLY for reg
  const [email, setEmail] = useState('');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    setError(null);
    try {
      const url = isSignUp
        ? `${API_BASE}'/api/auth/signup`
        : `${API_BASE}/api/auth/login`;

      const payload = isSignUp
        ? { user_name, email, passcode }
        : { email, passcode };

      const res = await axios.post(url, payload);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = (err.response?.data as { message?: string })?.message;
        setError(message || 'Authentication failed');
      } else {
        setError('Something went wrong');
      }
    }
  };
}
