import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';

export default function RemindersPage() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchReminders();
  }, [navigate]);

  const fetchReminders = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/reminders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setReminders(data);
      } else if (data.error?.toLowerCase().includes('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login');
      } else {
        setError(data.error || 'Failed to load reminders');
      }
    } catch (error) {
      setError(`Failed to load reminders: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTaken = async (id, currentStatus) => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`http://localhost:8000/reminders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ taken: !currentStatus })
      });

      if (response.ok) {
        fetchReminders(); // Refresh the list
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update reminder');
      }
    } catch (error) {
      setError('Failed to update reminder');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this reminder?')) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8000/reminders/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchReminders(); // Refresh the list
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete reminder');
      }
    } catch (error) {
      setError('Failed to delete reminder');
    }
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-200 flex items-center justify-center">
        <div className="text-lg">Loading reminders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <BackButton />
        
        <h1 className="text-3xl font-bold text-teal-700 mb-8 text-center">My Reminders</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 mb-4 rounded text-center">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">All Reminders</h2>
            <button
              className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition-colors"
              onClick={() => navigate('/reminders/new')}
            >
              Add New Reminder
            </button>
          </div>

          {reminders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">No reminders found</div>
              <button
                className="bg-teal-600 text-white px-6 py-3 rounded hover:bg-teal-700 transition-colors"
                onClick={() => navigate('/reminders/new')}
              >
                Add Your First Reminder
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {reminders.map((reminder) => (
                <div key={reminder.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-800">
                        {reminder.medication_name || 'Unknown Medication'}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        Scheduled: {formatDateTime(reminder.remind_at)}
                      </p>
                      <div className="mt-2">
                        <span className={`inline-block px-2 py-1 rounded text-sm ${
                          reminder.taken 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {reminder.taken ? 'Taken' : 'Pending'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        className={`px-3 py-1 rounded transition-colors ${
                          reminder.taken
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                        onClick={() => handleToggleTaken(reminder.id, reminder.taken)}
                      >
                        {reminder.taken ? 'Mark Pending' : 'Mark Taken'}
                      </button>
                      <button
                        className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition-colors"
                        onClick={() => handleDelete(reminder.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
