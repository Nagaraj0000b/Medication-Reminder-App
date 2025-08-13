import { useState, useEffect } from 'react';

export default function UserGreeting() {
  const [username, setUsername] = useState('');
  
  useEffect(() => {
    // Get username from localStorage or fetch from API
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);
  
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 18) return 'Afternoon';
    return 'Evening';
  };
  
  return (
    <div className="mb-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
        Good {getTimeOfDay()}, <span className="text-teal-700">{username || 'User'}</span>!
      </h1>
      <p className="text-gray-600 mt-2">Here's your medication dashboard for today.</p>
    </div>
  );
}