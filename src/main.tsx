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


import MainLayout from './layouts/MainLayout.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ]
  },
  {
    path: "/",
    element: <MainLayout />, 
    children: [
      { index: true, element: <Landing /> },
      { path: "project-end", element: <ProjectEnd /> },
      { path: "project", element: <Project /> },
    ]
    
  }, 
  {
    path: "/home",
    element: <MainLayout className='bg-lightOrange'/>, 
    children: [
      { index: true, element: <Home />},
    ]
  }
  
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

