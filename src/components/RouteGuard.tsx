
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface RouteGuardProps {
  children: ReactNode;
  requiresAccess?: 'gp' | 'clinical' | 'patient';
}

const RouteGuard = ({ children, requiresAccess }: RouteGuardProps) => {
  // For now, we'll allow access to all routes
  // You can add authentication logic here later
  const hasAccess = true;

  if (!hasAccess && requiresAccess) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RouteGuard;
