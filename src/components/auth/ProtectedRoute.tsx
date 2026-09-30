import type { ReactNode } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { AuthService } from "../../services/AuthService";
import { AppRoutes } from "../../routes/routes";

interface ProtectedRouteProps {
  children?: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();

  if (!AuthService.isAuthenticated()) {
    return <Navigate to={AppRoutes.login} state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
