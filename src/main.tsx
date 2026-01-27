import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Landing from './pages/Landing.tsx';
import Project from './pages/project/Project.tsx';
import ProjectEnd from './pages/ProjectEnd.tsx';
import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Profile from './pages/Profile.tsx';
import NotFound from './pages/NotFound.tsx';
import { AuthProvider } from "./context/AuthContext"
import { GoogleOAuthProvider } from "@react-oauth/google"
import AuthLayout from './layouts/AuthLayout.tsx'
import MainLayout from './layouts/MainLayout.tsx'
import ProtectedLayout from './layouts/ProtectedLayout.tsx';
import ProjectGuard from './layouts/ProjectGuard.tsx';
import CreateProjectPage from './pages/project/CreateProject.tsx';
import SetupProject from './pages/project/SetupProject.tsx';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
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
          {
            path: "project/:projectId",
            element: <ProjectGuard />,
            children: [
              { index: true, element: <Project /> },
              { path: "setup", element: <SetupProject /> }, 
            ]
          },
          { path: "project/create", element: < CreateProjectPage/>},
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
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

