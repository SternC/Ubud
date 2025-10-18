import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import axios from "axios";
import "./index.css";

import Dashboard from "./Dashboard.jsx";
import NotFound from "./NotFound.jsx";
import Register from "./Register.jsx";
import Login from "./Login.jsx";
import Hero from "./Hero.jsx";
import Module from "./Modul.jsx";
import CoachLogin from "./CoachLogin.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import PublicRoute from "./PublicRoute.jsx";

axios.defaults.withCredentials = true;

const routerPath = createBrowserRouter([
  {
    path: "/",
    element: <Hero />,
  },
  {
    path: "/coach-login",
    element: <CoachLogin />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute adminOnly={true}>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Module />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={routerPath} />
  </StrictMode>
);
