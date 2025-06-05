import './index.css';
import Navbar from './components/nav';
import JobBoard from './jOBs/jobBoard';
import { JobProvider } from './jOBs/JobsTORE';
import { Route, Routes } from 'react-router-dom';
import RegLog from './components/auth';
import ProtectedRoute from './components/protectedRoute';

function App() {
  //Local state refers to data that is managed and stored within a specific component using hooks like useState or useReducer in React.
  //const [count, setCount] = useState(0); // ✅ This is local state

  return (
    <>
      <Routes>
        <Route path="/auth" element={<RegLog />} />;
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <JobProvider>
                {/* <JobProvider> wraps only the components that read/write job data (JobBoard, JobCard, JobModal) — keeping the scope tight and performant.

*/}
                {/* Navbar needs to filter/search jobs → it must access the current job list.

Job data lives in your external store (JobProvider), so anything filtering or displaying it must be inside that context.

*/}
                <Navbar />
                <JobBoard />
              </JobProvider>
            </ProtectedRoute>
          }
        />
        ;
      </Routes>
    </>
  );
}

export default App;
