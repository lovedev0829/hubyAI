import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isTokenExpired } from "../../functions/auth";

const ProtectedRoute: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const checkAuth = async () => {
    if (isTokenExpired("access_token")) {
      localStorage.clear();
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }
    setIsAuthenticated(true);
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
    const intervalId = setInterval(() => {
      checkAuth();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [location.key]);

  if (loading) {
    return <div data-testid="loading">Loading...</div>;
  }
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;
