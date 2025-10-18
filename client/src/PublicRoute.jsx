import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function PublicRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/authentication", { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-8">Loading...</p>;

  // ✅ If user is logged in, redirect them
  if (user) {
    return user.is_admin ? (
      <Navigate to="/dashboard" replace />
    ) : (
      <Navigate to="/profile" replace />
    );
  }

  // ✅ If no user logged in, show the public page
  return children;
}
