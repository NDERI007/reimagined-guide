// ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../schema/isAuth';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return isAuthenticated() ? children : <Navigate to="/auth" />;
};

export default ProtectedRoute;
