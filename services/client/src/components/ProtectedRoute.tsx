import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedLayout: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (!isLoading) {
    if (!user || !user.token) {
      return <Navigate to="/login" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedLayout;
