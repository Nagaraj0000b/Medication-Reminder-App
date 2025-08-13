import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-teal-700 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/dashboard"
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}