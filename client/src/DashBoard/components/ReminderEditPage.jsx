import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ReminderEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reminderData, setReminderData] = useState({
    remind_at: '',
    taken: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReminderData();
  }, [id]);

  const fetchReminderData = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8000/reminders/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setReminderData({
          remind_at: data.remind_at.slice(0, 16), // Format for datetime-local input
          taken: data.taken
        });
      } else {
        setError('Failed to load reminder data');
      }
    } catch (error) {
      setError('Error loading reminder');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`http://localhost:8000/reminders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          remind_at: reminderData.remind_at,
          taken: reminderData.taken
        })
      });

      if (response.ok) {
        navigate('/dashboard');
      } else {
        setError('Failed to update reminder');
      }
    } catch (error) {
      setError('Error updating reminder');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-lg text-teal-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-teal-100 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-6 text-white">
            <h1 className="text-2xl font-bold">Edit Reminder</h1>
          </div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-300 text-red-700 p-4 m-4 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reminder Time
              </label>
              <input
                type="datetime-local"
                value={reminderData.remind_at}
                onChange={(e) => setReminderData(prev => ({ ...prev, remind_at: e.target.value }))}
                className="w-full p-3 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={reminderData.taken}
                  onChange={(e) => setReminderData(prev => ({ ...prev, taken: e.target.checked }))}
                  className="w-5 h-5 text-teal-600 border-teal-300 rounded focus:ring-teal-400"
                />
                <span className="text-sm font-medium text-gray-700">Mark as taken</span>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-3 rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all font-medium"
              >
                Update Reminder
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
