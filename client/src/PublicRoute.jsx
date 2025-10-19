import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "./api";

export default function PublicRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/authentication", { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
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
