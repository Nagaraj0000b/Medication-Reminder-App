import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function BackButton({ showHomeButton = true }) {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center space-x-4 mb-4">
      <button 
        className="flex items-center text-sm text-gray-600 hover:text-teal-700"
        onClick={() => navigate(-1)}
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back
      </button>
      
      {showHomeButton && (
        <button 
          className="flex items-center text-sm text-gray-600 hover:text-teal-700 bg-gray-100 px-3 py-1 rounded-md"
          onClick={() => navigate('/dashboard')}
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
          Dashboard
        </button>
      )}
    </div>
  );
}
