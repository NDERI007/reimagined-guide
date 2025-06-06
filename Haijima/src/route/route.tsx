// routes.tsx
// routes.tsx
import { Navigate, type RouteObject } from 'react-router-dom';
import RegLog from '../components/auth';
import Navbar from '../components/nav';
import JobBoard from '../jOBs/jobBoard';
import { JobProvider } from '../jOBs/JobsTORE';

const routes: RouteObject[] = [
  { path: '/', element: <Navigate to="/auth" /> },

  { path: '/auth', element: <RegLog /> },
  {
    path: '/jobboard',
    element: (
      <JobProvider>
        <Navbar />
        <JobBoard />
      </JobProvider>
    ),
  },
];

export default routes;
