import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Landing from './pages/Landing.tsx';
import Project from './pages/Project.tsx';
import ProjectEnd from './pages/ProjectEnd.tsx';
import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Profile from './pages/Profile.tsx';
import NotFound from './pages/NotFound.tsx';
import { AuthProvider } from "./context/AuthContext"

import AuthLayout from './layouts/AuthLayout.tsx'
import MainLayout from './layouts/MainLayout.tsx'
import ProtectedLayout from './layouts/ProtectedLayout.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />, 
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ]
  },

  //public routes
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Landing /> }, // ← THIS IS NOW PUBLIC
      { path: "*", element: <NotFound /> },
    ],
  },

  
  //protected routes
  {
    path: "/",
    element: <MainLayout />, 
    children: [
      { 
        element: <ProtectedLayout />,  
        children: [
          { index: true, element: <Landing /> },
          { path: "project-end", element: <ProjectEnd /> },
          { path: "project", element: <Project /> },
          { path: "profile", element: <Profile /> },
          
        ]
      }
    ]
    
  }, 
  {
    path: "/home",
    element: <MainLayout className='bg-lightOrange'/>, 
    children: [
      { 
        element: <ProtectedLayout />,  
        children: [
        { index: true, element: <Home />},
        ]
      }
    ]
  }
  
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);

