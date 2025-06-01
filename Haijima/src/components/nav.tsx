import { setSearchQuery, useSearchQuery } from './searchStore';

const Navbar = () => {
  const searchQuery = useSearchQuery();
  return (
    <nav className="flex w-full items-center justify-between border-b bg-white px-4 py-3">
      <div className="text-xl font-bold text-teal-600">JobTracker</div>

      <div className="mx-4 max-w-md flex-1">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search jobs by title, company, location..."
          className="w-full rounded-md border border-gray-300 bg-gray-200 px-4 py-2 focus:ring-2 focus:ring-teal-400 focus:outline-none"
        />
      </div>

      <div className="flex items-center space-x-3">
        <span className="text-sm font-medium"> 'Guest'</span>
        <img className="h-10 w-10 rounded-full border" />
      </div>
    </nav>
  );
};

export default Navbar;
