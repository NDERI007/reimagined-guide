// routes.tsx

import { Navigate, type RouteObject } from 'react-router-dom';
import RegLog from '../components/auth';
import JobBoard from '../jOBs/jobBoard';
import ProtectedRoute from '../components/protectedRoute';
import JobLayout from '../jOBs/jobLayout';

const routes: RouteObject[] = [
  { path: '/', element: <Navigate to="/auth" /> },

  { path: '/auth', element: <RegLog /> },
  {
    path: '/jobboard',
    element: (
      <ProtectedRoute>
        <JobLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <JobBoard />,
      },
    ],
  },
];

export default routes;
