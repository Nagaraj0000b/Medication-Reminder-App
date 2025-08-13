import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import UserGreeting from '../components/user/UserGreeting';
import MedicationList from '../components/medication/MedicationList';
import ReminderList from '../components/reminder/ReminderList';
import BackButton from '../components/common/BackButton';

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [medications, setMedications] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Format date for API
    const dateStr = selectedDate.toISOString().split('T')[0];
    
    // Fetch data for selected date
    setLoading(true);
    
    Promise.all([
      // Fetch medications
      fetch(`http://localhost:8000/medications?date=${dateStr}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => res.json()),
      
      // Fetch reminders
      fetch(`http://localhost:8000/reminders?date=${dateStr}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => res.json())
    ])
    .then(([medsData, remsData]) => {
      setMedications(Array.isArray(medsData) ? medsData : []);
      setReminders(Array.isArray(remsData) ? remsData : []);
    })
    .catch(err => {
      console.error('Error fetching data:', err);
    })
    .finally(() => {
      setLoading(false);
    });
  }, [selectedDate, navigate]);
  
  const handleDeleteMedication = useCallback(async (id) => {
    if (!window.confirm('Are you sure you want to delete this medication?')) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8000/medications/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setMedications(meds => meds.filter(med => med.id !== id));
        setReminders(rems => rems.filter(rem => rem.medication_id !== id));
      } else {
        const data = await response.json();
        console.error(data);
      }
    } catch (error) {
      console.error('Error deleting medication:', error);
    }
  }, []);
  
  const handleDeleteReminder = useCallback(async (id) => {
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
        setReminders(rems => rems.filter(rem => rem.id !== id));
      } else {
        const data = await response.json();
        console.error(data);
      }
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  }, []);
  
  const handleToggleTaken = useCallback(async (id, currentStatus) => {
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
        setReminders(rems => 
          rems.map(rem => rem.id === id ? { ...rem, taken: !currentStatus } : rem)
        );
      } else {
        const data = await response.json();
        console.error(data);
      }
    } catch (error) {
      console.error('Error updating reminder:', error);
    }
  }, []);

  if (loading && medications.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-3 border-teal-600 border-t-transparent"></div>
          <div className="text-lg text-gray-700 font-medium">Loading your medications...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <BackButton showHomeButton={false} />
        <UserGreeting username={localStorage.getItem('username') || 'User'} />
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">My Dashboard</h2>
            <p className="text-gray-500 text-sm">Manage your medications and reminders</p>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Date:</label>
            <input 
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={e => setSelectedDate(new Date(e.target.value))}
              className="border rounded px-3 py-1"
            />
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading your data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Today's Medications</h3>
              <MedicationList 
                medications={medications}
                onEdit={(id) => navigate(`/medications/edit/${id}`)}
                onDelete={handleDeleteMedication}
                onViewAll={() => navigate('/medications')}
              />
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-3">Today's Reminders</h3>
              <ReminderList 
                reminders={reminders}
                onEdit={(id) => navigate(`/reminders/edit/${id}`)}
                onDelete={handleDeleteReminder}
                onToggleTaken={handleToggleTaken}
              />
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => navigate('/medications/new')} 
                className="bg-teal-600 text-white py-2 rounded hover:bg-teal-700 text-sm flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Add New Medication
              </button>
              <button 
                onClick={() => navigate('/reminders/new')} 
                className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Add New Reminder
              </button>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold mb-4">Navigation</h3>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => navigate('/medications')} 
                className="border border-gray-300 py-2 rounded hover:bg-gray-50 text-sm flex items-center justify-center"
              >
                View All Medications
              </button>
              <button 
                onClick={() => navigate('/reminders')} 
                className="border border-gray-300 py-2 rounded hover:bg-gray-50 text-sm flex items-center justify-center"
              >
                View All Reminders
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
