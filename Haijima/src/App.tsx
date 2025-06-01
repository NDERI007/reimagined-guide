import './index.css';
import Navbar from './components/nav';
import JobBoard from './jOBs/jobBoard';

function App() {
  //Local state refers to data that is managed and stored within a specific component using hooks like useState or useReducer in React.
  //const [count, setCount] = useState(0); // ✅ This is local state

  //Use ref, sub, part

  return (
    <>
      <Navbar />
      <JobBoard />
    </>
  );
}

export default App;
