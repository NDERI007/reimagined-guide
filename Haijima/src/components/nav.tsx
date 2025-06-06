import { useNavigate } from 'react-router-dom';
import { useAuth } from '../schema/useAuth';
import { setSearchQuery, useSearchQuery } from './searchStore';
import { LogOut } from 'lucide-react';

const Navbar = () => {
  const { query } = useSearchQuery();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return (
    <nav className="flex w-full items-center justify-between border-b bg-white px-4 py-3">
      <div className="text-xl font-bold text-teal-600">JobTracker</div>

      <div className="mx-4 max-w-md flex-1">
        <input
          type="text"
          value={query}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search jobs by title, company, location..."
          className="w-full rounded-md border border-gray-300 bg-gray-200 px-4 py-2 focus:ring-2 focus:ring-teal-400 focus:outline-none"
        />
      </div>

      <div className="flex items-center space-x-3">
        <span className="text-sm font-medium">Welcome Twin</span>
      </div>
      <button
        onClick={handleLogout}
        className="flex cursor-pointer items-center px-3 py-1"
      >
        <LogOut size={20} /> Logout
      </button>
    </nav>
  );
};

export default Navbar;
