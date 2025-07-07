
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const authUser = localStorage.getItem("auth_user");
    
    if (!authUser) {
      navigate("/auth");
      return;
    }

    if (requiredRole) {
      const userData = JSON.parse(authUser);
      if (userData.role !== requiredRole) {
        navigate("/auth");
        return;
      }
    }
  }, [navigate, requiredRole]);

  return <>{children}</>;
};

export default ProtectedRoute;
