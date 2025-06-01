import { useState } from 'react';

import './index.css';
import Navbar from './components/nav';
import JobBoard from './jOBs/jobBoard';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  //Local state refers to data that is managed and stored within a specific component using hooks like useState or useReducer in React.
  //const [count, setCount] = useState(0); // ✅ This is local state
  return (
    <>
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <JobBoard jobs={[]} searchQuery={''} statuses={[]} />
    </>
  );
}

export default App;
