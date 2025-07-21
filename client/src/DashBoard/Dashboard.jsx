import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import UserGreeting from './components/UserGreeting';
import TimeDate from './components/TimeDate';
import InfiniteDateRow from './components/InfiniteDateRow';
import MedicationList from './components/MedicationList';
import RemindersList from './components/RemindersList';

function formatDateKey(date) {
  return date.toISOString().split('T')[0];
}

export default function Dashboard() {
  // Keep all your existing state and functions exactly the same
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [medications, setMedications] = useState([]);
  const [allMedications, setAllMedications] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [dataCache, setDataCache] = useState(new Map());
  const navigate = useNavigate();

  const selectedDateKey = useMemo(() => formatDateKey(selectedDate), [selectedDate]);

  // Keep all your existing useEffect and callback functions
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchAllMedications();
    fetchMedicationsWithReminders(selectedDateKey);
  }, [navigate]);

  useEffect(() => {
    if (dataCache.has(selectedDateKey)) {
      const cachedData = dataCache.get(selectedDateKey);
      setMedications(cachedData.medications);
      setReminders(cachedData.reminders);
      return;
    }

    const timeoutId = setTimeout(() => {
      fetchMedicationsWithReminders(selectedDateKey);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [selectedDateKey, dataCache]);

  // Keep all your existing functions (fetchAllMedications, fetchMedicationsWithReminders, etc.)
  const fetchAllMedications = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:8000/medications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          navigate('/login');
          return;
        }
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      if (Array.isArray(data)) {
        setAllMedications(data);
      }
    } catch (error) {
      console.error('Fetch all medications error:', error);
      setError(`Failed to load medications: ${error.message}`);
    }
  }, [navigate]);

  const fetchMedicationsWithReminders = useCallback(async (date) => {
    const token = localStorage.getItem('token');
    const shouldShowLoading = !dataCache.has(date);
    if (shouldShowLoading) {
      setLoading(true);
    }
    setError('');
    
    try {
      const response = await fetch(`http://localhost:8000/medications-with-reminders?date=${date}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          navigate('/login');
          return;
        }
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        const allReminders = data.flatMap(med => {
          if (!med.reminders || !Array.isArray(med.reminders)) {
            return [];
          }
          
          return med.reminders.map(rem => ({
            ...rem,
            medication_name: med.name,
            medication_id: med.id
          }));
        });
        
        setDataCache(prev => new Map([
          ...prev,
          [date, { medications: data, reminders: allReminders }]
        ]));
        
        setMedications(data);
        setReminders(allReminders);
      } else {
        console.error('Invalid data format:', data);
        setError('Invalid data received from server');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError(`Failed to load data: ${error.message}`);
    } finally {
      if (shouldShowLoading) {
        setLoading(false);
      }
    }
  }, [navigate, dataCache]);

  // Keep all your existing event handlers
  const handleEditMedication = useCallback((id) => {
    navigate(`/medications/edit/${id}`);
  }, [navigate]);

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
        setDataCache(new Map());
        await fetchAllMedications();
        await fetchMedicationsWithReminders(selectedDateKey);
        setError('');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete medication');
      }
    } catch (error) {
      setError('Failed to delete medication');
    }
  }, [fetchAllMedications, fetchMedicationsWithReminders, selectedDateKey]);

  const handleToggleReminderTaken = useCallback(async (reminderId, currentStatus) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8000/reminders/${reminderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ taken: !currentStatus })
      });

      if (response.ok) {
        setDataCache(prev => {
          const newCache = new Map(prev);
          if (newCache.has(selectedDateKey)) {
            const cachedData = { ...newCache.get(selectedDateKey) };
            cachedData.reminders = cachedData.reminders.map(reminder =>
              reminder.id === reminderId ? { ...reminder, taken: !currentStatus } : reminder
            );
            newCache.set(selectedDateKey, cachedData);
          }
          return newCache;
        });
        
        setReminders(prev => prev.map(reminder =>
          reminder.id === reminderId ? { ...reminder, taken: !currentStatus } : reminder
        ));
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update reminder');
      }
    } catch (error) {
      setError('Failed to update reminder');
    }
  }, [selectedDateKey]);

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
        setDataCache(prev => {
          const newCache = new Map(prev);
          newCache.delete(selectedDateKey);
          return newCache;
        });
        
        await fetchMedicationsWithReminders(selectedDateKey);
        setError('');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete reminder');
      }
    } catch (error) {
      setError('Failed to delete reminder');
    }
  }, [fetchMedicationsWithReminders, selectedDateKey]);

  const handleViewAll = useCallback(() => {
    navigate('/medications');
  }, [navigate]);

  const handleDateChange = useCallback((newDate) => {
    if (newDate.toDateString() === selectedDate.toDateString()) {
      return;
    }
    setSelectedDate(newDate);
  }, [selectedDate]);

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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Enhanced Error Display */}
        {error && (
          <div className="bg-white/90 backdrop-blur-sm border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-r-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <p className="text-sm font-medium">{error}</p>
              </div>
              <button onClick={() => setError('')} className="text-red-400 hover:text-red-600 transition-colors">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Modern Header with Glass Effect */}
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex-1 text-center sm:text-left">
              <UserGreeting username={localStorage.getItem('username') || 'User'} />
            </div>
            <div className="flex-1 text-center sm:text-right">
              <TimeDate />
            </div>
          </div>
        </div>

        {/* Enhanced Date Navigation */}
        <div className="transform transition-all duration-300 hover:scale-[1.01]">
          <InfiniteDateRow 
            selectedDate={selectedDate} 
            onDateChange={handleDateChange}
          />
        </div>

        {/* Modern Selected Date Display */}
        <div className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-3xl shadow-xl p-6 text-center text-white">
          <h2 className="text-xl sm:text-2xl font-bold tracking-wide">
            {selectedDate.toLocaleDateString('en', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h2>
          <div className="mt-2 text-teal-100">
            <span className="inline-flex items-center space-x-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">Today's Schedule</span>
            </span>
          </div>
        </div>

        {/* Modern Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Enhanced Medications Column */}
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                  <span>Medications</span>
                </h3>
                <button
                  className="text-xs text-teal-100 hover:text-white border border-teal-300 hover:border-white px-3 py-1 rounded-full transition-all duration-200 hover:bg-white/10"
                  onClick={handleViewAll}
                >
                  View All
                </button>
              </div>
            </div>
            
            <div className="max-h-80 overflow-y-auto custom-scrollbar">
              {medications.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-gray-300 text-6xl mb-4">💊</div>
                  <p className="text-gray-500 text-lg">No medications for this day</p>
                  <p className="text-gray-400 text-sm mt-2">Add your first medication to get started</p>
                </div>
              ) : (
                <div className="p-2">
                  {medications.map((med, index) => (
                    <div key={med.id} className={`group bg-white/50 hover:bg-white/80 backdrop-blur-sm rounded-2xl p-4 mb-3 border border-gray-100/50 hover:border-teal-200 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${index === 0 ? 'mt-0' : ''}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="font-semibold text-gray-900 text-lg truncate flex items-center space-x-2">
                            <div className="w-3 h-3 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full flex-shrink-0"></div>
                            <span>{med.name}</span>
                          </div>
                          <div className="text-sm text-gray-600 flex items-center space-x-2">
                            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{med.dosage}</span>
                          </div>
                          {med.sideEffects && (
                            <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-lg truncate">
                              ⚠️ {med.sideEffects}
                            </div>
                          )}
                          {med.reminders && med.reminders.length > 0 && (
                            <div className="text-xs text-teal-600 bg-teal-50 px-2 py-1 rounded-lg inline-flex items-center space-x-1">
                              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{med.reminders.length} reminder(s) today</span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            className="bg-gradient-to-r from-blue-400 to-blue-500 text-white px-3 py-2 rounded-xl text-xs hover:from-blue-500 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
                            onClick={() => handleEditMedication(med.id)}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-gradient-to-r from-red-400 to-red-500 text-white px-3 py-2 rounded-xl text-xs hover:from-red-500 hover:to-red-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
                            onClick={() => handleDeleteMedication(med.id)}
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
            
            <div className="p-4 border-t border-gray-100/50 bg-gray-50/50">
              <button
                className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-4 py-3 rounded-2xl font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                onClick={() => navigate('/medications/new')}
              >
                <span className="flex items-center justify-center space-x-2">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add New Medication</span>
                </span>
              </button>
            </div>
          </div>

          {/* Enhanced Reminders Column */}
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Today's Reminders</span>
              </h3>
            </div>
            
            <div className="max-h-80 overflow-y-auto custom-scrollbar">
              {reminders.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-gray-300 text-6xl mb-4">⏰</div>
                  <p className="text-gray-500 text-lg">No reminders for this day</p>
                  <p className="text-gray-400 text-sm mt-2">Schedule your medications to see reminders here</p>
                </div>
              ) : (
                <div className="p-2">
                  {reminders.map((reminder, index) => (
                    <div key={reminder.id} className={`group bg-white/50 hover:bg-white/80 backdrop-blur-sm rounded-2xl p-4 mb-3 border border-gray-100/50 hover:border-blue-200 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${index === 0 ? 'mt-0' : ''}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0 space-y-3">
                          <div className="font-semibold text-gray-900 text-lg truncate flex items-center space-x-2">
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex-shrink-0"></div>
                            <span>{reminder.medication_name || 'Unknown Medication'}</span>
                          </div>
                          <div className="text-sm text-gray-600 flex items-center space-x-2">
                            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{new Date(reminder.remind_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div>
                            <button
                              onClick={() => handleToggleReminderTaken(reminder.id, reminder.taken)}
                              className={`inline-flex items-center px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 transform hover:scale-105 ${
                                reminder.taken 
                                  ? 'bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg' 
                                  : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg'
                              }`}
                            >
                              {reminder.taken ? (
                                <>
                                  <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  Taken
                                </>
                              ) : (
                                <>
                                  <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Pending
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            className="bg-gradient-to-r from-blue-400 to-blue-500 text-white px-3 py-2 rounded-xl text-xs hover:from-blue-500 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
                            onClick={() => navigate(`/reminders/${reminder.id}`)}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-gradient-to-r from-red-400 to-red-500 text-white px-3 py-2 rounded-xl text-xs hover:from-red-500 hover:to-red-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
                            onClick={() => handleDeleteReminder(reminder.id)}
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

        {/* Enhanced Empty State */}
        {medications.length === 0 && reminders.length === 0 && (
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-12 text-center">
            <div className="text-gray-400 text-8xl mb-6">💊</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-4">
              Welcome to Your Medication Dashboard
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Get started by adding your first medication and setting up reminders to stay on track with your health.
            </p>
            <button
              className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-xl"
              onClick={() => navigate('/medications/new')}
            >
              <span className="flex items-center space-x-2">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Your First Medication</span>
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Enhanced Floating Add Button */}
      <button
        className="fixed bottom-6 right-6 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 z-50 group"
        onClick={() => navigate('/medications/new')}
        title="Add New Medication"
      >
        <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}
