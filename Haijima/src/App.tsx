import { useState } from 'react';

import './index.css';
import Navbar from './components/nav';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    </>
  );
}

export default App;
