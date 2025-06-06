// hooks/useAuth.ts
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

export function useAuth() {
  const [user, setUser] = useState<{
    id: number;
    email: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_URL;

  // Validate token
  const validateToken = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${API_BASE}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Token validation failed:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto validate on mount
  useEffect(() => {
    validateToken();
  }, [validateToken]);

  //Logout
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  return { user, loading, isAuthenticated: !!user, validateToken, logout };
}
