import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AppScreenLoader from './AppScreenLoader';

function AdminRoute({ children }) {
  const { currentUser, isAdmin, loading } = useAuth();

  if (loading) {
    return <AppScreenLoader />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;
