import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// 🧭 Only for logged-out users (login/register)
export function GuestRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null; // optional: show spinner
  return user ? (
    <Navigate to={user.is_admin ? "/dashboard" : "/profile"} replace />
  ) : (
    children
  );
}

// 🔒 Only for logged-in users (profile/dashboard)
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  return !user ? <Navigate to="/login" replace /> : children;
}