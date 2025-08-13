import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Only show the bottom navigation on protected routes after login
  if (location.pathname === '/' || 
      location.pathname === '/login' || 
      location.pathname === '/signup' || 
      location.pathname === '/verify-otp') {
    return null;
  }
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 px-4 z-10">
      <button
        className={`flex flex-col items-center p-2 rounded-md ${
          location.pathname === '/dashboard' ? 'text-teal-600' : 'text-gray-600'
        }`}
        onClick={() => navigate('/dashboard')}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
        </svg>
        <span className="text-xs mt-1">Home</span>
      </button>
      
      <button
        className={`flex flex-col items-center p-2 rounded-md ${
          location.pathname.includes('/medications') ? 'text-teal-600' : 'text-gray-600'
        }`}
        onClick={() => navigate('/medications')}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
        </svg>
        <span className="text-xs mt-1">Medications</span>
      </button>
      
      <button
        className={`flex flex-col items-center p-2 rounded-md ${
          location.pathname.includes('/reminders') ? 'text-teal-600' : 'text-gray-600'
        }`}
        onClick={() => navigate('/reminders')}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span className="text-xs mt-1">Reminders</span>
      </button>
    </div>
  );
}
