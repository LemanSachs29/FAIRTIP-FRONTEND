import { Navigate, useLocation } from 'react-router-dom';

import { isAuthenticated } from '../services/auth.js';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export { ProtectedRoute };
