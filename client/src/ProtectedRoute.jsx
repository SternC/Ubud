
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/authentication", { withCredentials: true })
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-8">Loading...</p>;

  if (!user) return <Navigate to="/login" replace />;

 
  if (adminOnly && user.is_admin) return <Navigate to="/profile" replace />;

  
  if (!adminOnly && user.is_admin) return <Navigate to="/dashboard" replace />;

  return children;
}
