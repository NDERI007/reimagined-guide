import { useRoutes } from 'react-router-dom';
import './index.css';
import routes from './route/route';

export default function App() {
  //Local state refers to data that is managed and stored within a specific component using hooks like useState or useReducer in React.
  //const [count, setCount] = useState(0); // ✅ This is local state
  const element = useRoutes(routes);
  return element;
}
