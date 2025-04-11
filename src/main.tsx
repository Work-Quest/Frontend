import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './pages/Home.tsx';
import Project from './pages/Project.tsx';

import MainLayout from './layouts/MainLayout.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, 
    children: [
      { index: true, element: <Home /> },
      { path: "project", element: <Project /> },
      // { path: "about", element: <About /> }, sub route
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

