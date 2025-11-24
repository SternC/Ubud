import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "./api";

export default function PublicRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const res = await api.get("/authentication", { withCredentials: true });
        if (isMounted) {
          setUser(res.data);
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

  if (user) {
    return user.is_admin ? (
      <Navigate to="/dashboard" replace />
    ) : (
      <Navigate to="/profile" replace />
    );
  }


  return children;
}