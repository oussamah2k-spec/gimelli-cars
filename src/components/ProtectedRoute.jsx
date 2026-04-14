import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AppScreenLoader from "./AppScreenLoader";

function ProtectedRoute({ children }) {
  const { isAuthenticated, isAuthorizedAdmin, loading } = useAuth();

  if (loading) {
    return <AppScreenLoader />;
  }

  return isAuthenticated && isAuthorizedAdmin ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;