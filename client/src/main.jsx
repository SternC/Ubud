import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import axios from 'axios'
import './index.css'
import Dashboard from './Dashboard.jsx'
import NotFound from './NotFound.jsx'
import Register from './Register.jsx'
import Login from './Login.jsx'
import EditUser from './EditUser.jsx'
import Hero from './Hero.jsx'
import Module from './Modul.jsx'
import CoachLogin from './CoachLogin.jsx';

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
    element: <Dashboard />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "edit/:id",
    element: <EditUser />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/profile",
    element: <Module />,
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={routerPath} />
  </StrictMode>,
)
