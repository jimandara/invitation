import React, { lazy, Suspense } from 'react'
import './index.css'
import Loader from './components/loader';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import NotFound from './NotFound';
import ReactDOM from 'react-dom/client';

const Homepage = lazy(() => 
  wait(3000).then(() => import('./views/Homepage'))
);

const routes = [
  {
    path: '/invitation',
    element: <Navigate to="/invitation/home" />,
  },
  {
    path: 'invitation/home',
    element: (
      <Suspense fallback={<Loader />}>
        <Homepage />
      </Suspense>
    ),
  },

  {
    path: '*',
    element: <NotFound />,
  },
];

const router = createBrowserRouter(routes);

// Simulate delay function
function wait(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

// Render application
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
