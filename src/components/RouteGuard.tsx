
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './auth/AuthProvider';

interface RouteGuardProps {
  children: ReactNode;
  requiresAccess?: 'gp' | 'clinical_admin' | 'patient';
}

const RouteGuard = ({ children, requiresAccess }: RouteGuardProps) => {
  const { user, userRole, loading } = useAuth();

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth if not logged in and access is required
  if (!user && requiresAccess) {
    return <Navigate to="/auth" replace />;
  }

  // Check role-based access
  if (requiresAccess && userRole !== requiresAccess) {
    // Redirect based on their actual role
    switch (userRole) {
      case 'gp':
        return <Navigate to="/gp/dashboard" replace />;
      case 'clinical_admin':
        return <Navigate to="/clinical/dashboard" replace />;
      case 'patient':
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default RouteGuard;
