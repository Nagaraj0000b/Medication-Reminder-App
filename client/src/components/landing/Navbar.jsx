import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-teal-700">MedTracker</Link>
        </div>
        <div>
          <Link
            to="/login"
            className="px-4 py-2 border border-gray-300 rounded mr-2 hover:bg-gray-50"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}