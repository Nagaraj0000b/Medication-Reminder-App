import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <div className="bg-teal-700 text-white">
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Never Miss a Medication Again
          </h1>
          <p className="text-xl mb-8">
            MedTracker helps you stay on top of your medication schedule with timely reminders and an easy-to-use tracking system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/signup"
              className="px-6 py-3 bg-white text-teal-700 rounded text-center font-medium hover:bg-gray-100"
            >
              Get Started for Free
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 border border-white rounded text-center font-medium hover:bg-teal-800"
            >
              Sign In
            </Link>
          </div>
        </div>
        <div className="md:w-1/2">
          <img 
            src="https://via.placeholder.com/600x400?text=MedTracker"
            alt="Medication Reminder" 
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}