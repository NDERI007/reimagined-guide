// ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../schema/useAuth';

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, isAuthenticated } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return children;
}
