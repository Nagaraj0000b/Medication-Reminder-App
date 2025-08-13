import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../common/BackButton';

export default function ReminderEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reminderData, setReminderData] = useState({
    medication_id: '',
    remind_at: '',
    type: 'single',
    weekday: '',
    time: ''
  });
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch medications for dropdown
    fetch('http://localhost:8000/medications', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setMedications(data))
      .catch(err => console.error('Error fetching medications:', err));

    // If editing, fetch reminder data
    if (id) {
      setLoading(true);
      fetch(`http://localhost:8000/reminders/${id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => res.json())
        .then(data => {
          const datetime = data.remind_at ? new Date(data.remind_at).toISOString().slice(0, 16) : '';
          setReminderData({
            medication_id: data.medication_id || '',
            remind_at: datetime,
            type: data.type || 'single',
            weekday: data.weekday || '',
            time: data.time || ''
          });
          setLoading(false);
        })
        .catch(err => {
          setError('Failed to load reminder');
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    setReminderData({ ...reminderData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = id 
        ? `http://localhost:8000/reminders/${id}`
        : 'http://localhost:8000/reminders';
      
      const response = await fetch(url, {
        method: id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(reminderData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save reminder');
      }

      navigate('/reminders');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
        <BackButton />
        
        <div className="bg-white rounded-2xl shadow-lg border border-teal-100 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-6 text-white">
            <h1 className="text-2xl font-bold">
              {id ? 'Edit Reminder' : 'Add New Reminder'}
            </h1>
          </div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-300 text-red-700 p-4 m-4 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medication
              </label>
              <select
                name="medication_id"
                value={reminderData.medication_id}
                onChange={handleChange}
                className="w-full p-3 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                required
              >
                <option value="">Select a medication</option>
                {medications.map(med => (
                  <option key={med.id} value={med.id}>
                    {med.name} ({med.dosage})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reminder Type
              </label>
              <select
                name="type"
                value={reminderData.type}
                onChange={handleChange}
                className="w-full p-3 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent"
              >
                <option value="single">Single Time</option>
                <option value="recurring">Recurring</option>
              </select>
            </div>
            
            {reminderData.type === 'single' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  When to remind
                </label>
                <input
                  type="datetime-local"
                  name="remind_at"
                  value={reminderData.remind_at}
                  onChange={handleChange}
                  className="w-full p-3 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                  required
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Day of Week
                  </label>
                  <select
                    name="weekday"
                    value={reminderData.weekday}
                    onChange={handleChange}
                    className="w-full p-3 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                    required={reminderData.type === 'recurring'}
                  >
                    <option value="">Select day</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={reminderData.time}
                    onChange={handleChange}
                    className="w-full p-3 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                    required={reminderData.type === 'recurring'}
                  />
                </div>
              </>
            )}
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate('/reminders')}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-3 rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all font-medium"
              >
                {loading ? 'Saving...' : id ? 'Update Reminder' : 'Add Reminder'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
