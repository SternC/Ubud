import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "./api";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const res = await api.get("/authentication", { withCredentials: true });
        if (isMounted) {
          setUser(res.data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <p className="p-8">Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !user.is_admin) return <Navigate to="/profile" replace />;
  if (!adminOnly && user.is_admin) return <Navigate to="/dashboard" replace />;

  return children;
}