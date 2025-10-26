import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles: Array<'customer' | 'seller' | null>; // null represents a guest/logged-out user
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();
  const userRole = user ? user.role : null;

  if (allowedRoles.includes(userRole)) {
    return <Outlet />;
  }
  
  // If a logged-in user tries to access a page they're not allowed to,
  // redirect them to their respective home page.
  if (user) {
      return <Navigate to={user.role === 'seller' ? '/seller-dashboard' : '/'} replace />;
  }

  // If a guest tries to access a protected page, send them to login, passing the current location
  return <Navigate to="/auth" state={{ from: location }} replace />;
};

export default ProtectedRoute;