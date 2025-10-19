import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "./api";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/authentication", { withCredentials: true })
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-8">Loading...</p>;

  // Not logged in → redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // If route is admin-only but user is not admin → block access
  if (adminOnly && !user.is_admin) return <Navigate to="/profile" replace />;

  // If route is user-only but user is admin → redirect to admin dashboard
  if (!adminOnly && user.is_admin) return <Navigate to="/dashboard" replace />;

  // Otherwise, allowed
  return children;
}
