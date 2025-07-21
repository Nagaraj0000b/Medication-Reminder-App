import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from './BackButton';

export default function MedicationForm() {
    const [formData, setFormData] = useState({
        name: '',
        dosage: '',
        sideEffects: ''
    });

    const [reminderSettings, setReminderSettings] = useState({
        enableReminders: true,
        frequencyType: 'daily', // once, daily, multiple_times, weekly, custom
        timesPerDay: 1,
        reminderTimes: [{ time: '09:00', mealTiming: 'none', minutesOffset: 0 }],
        mealTiming: 'none', // none, before_food, after_food, with_food
        daysOfWeek: [1, 2, 3, 4, 5, 6, 7], // 1=Monday, 7=Sunday
        intervalHours: 8,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        notes: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    // Meal timing options
    const mealTimingOptions = [
        { value: 'none', label: 'Any time' },
        { value: 'before_food', label: 'Before meals (30 min before)' },
        { value: 'after_food', label: 'After meals (30 min after)' },
        { value: 'with_food', label: 'With meals' }
    ];

    // Frequency type options
    const frequencyOptions = [
        { value: 'once', label: 'One time only' },
        { value: 'daily', label: 'Daily' },
        { value: 'multiple_times', label: 'Multiple times per day' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'custom', label: 'Every X hours' }
    ];

    const daysOfWeekOptions = [
        { value: 1, label: 'Mon' },
        { value: 2, label: 'Tue' },
        { value: 3, label: 'Wed' },
        { value: 4, label: 'Thu' },
        { value: 5, label: 'Fri' },
        { value: 6, label: 'Sat' },
        { value: 7, label: 'Sun' }
    ];

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        if (isEdit) {
            fetchMedicationWithReminders();
        }
    }, [navigate, id, isEdit]);

   const fetchMedicationWithReminders = async () => {
  const token = localStorage.getItem('token');
  setLoading(true);
  
  try {
    console.log(`Fetching medication and reminders for ID: ${id}`);
    
    // First, fetch the medication details
    const medicationResponse = await fetch(`http://localhost:8000/medications/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!medicationResponse.ok) {
      const errorText = await medicationResponse.text();
      console.error('Fetch medication error:', medicationResponse.status, errorText);
      throw new Error(`Failed to fetch medication: ${medicationResponse.status}`);
    }
    
    const medicationData = await medicationResponse.json();
    console.log('Fetched medication data:', medicationData);
    
    // Set the medication form data
    setFormData({
      name: medicationData.name || '',
      dosage: medicationData.dosage || '',
      sideEffects: medicationData.sideEffects || ''
    });
    
    // Then fetch existing reminders for this medication
    const remindersResponse = await fetch(`http://localhost:8000/medications/${id}/reminders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (remindersResponse.ok) {
      const remindersData = await remindersResponse.json();
      console.log('Fetched reminders data:', remindersData);
      
      if (remindersData.length > 0) {
        // **DEDUPLICATION LOGIC - This is the key fix**
        const uniqueReminderTimes = deduplicateReminderTimes(
          remindersData.map(reminder => {
            const reminderDate = new Date(reminder.remind_at);
            const timeString = reminderDate.toTimeString().slice(0, 5); // Get HH:MM format
            
            return {
              time: timeString,
              mealTiming: reminder.meal_timing || 'none',
              minutesOffset: 30
            };
          })
        );
        
        // Determine frequency type based on reminder pattern
        const uniqueDates = [...new Set(remindersData.map(r => r.remind_at.split(' ')[0]))];
        const remindersPerDay = Math.floor(remindersData.length / uniqueDates.length);
        
        let frequencyType = 'daily';
        if (uniqueDates.length === 1) {
          frequencyType = 'once';
        } else if (remindersPerDay > 1) {
          frequencyType = 'multiple_times';
        }
        
        setReminderSettings({
          enableReminders: true,
          frequencyType: frequencyType,
          timesPerDay: uniqueReminderTimes.length,
          reminderTimes: uniqueReminderTimes, // Use deduplicated times
          mealTiming: remindersData[0].meal_timing || 'none',
          daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
          intervalHours: 8,
          startDate: remindersData[0].remind_at.split(' ')[0],
          endDate: '',
          notes: ''
        });
      } else {
        setReminderSettings(prev => ({
          ...prev,
          enableReminders: false
        }));
      }
    } else {
      console.log('No existing reminders found or error fetching reminders');
      setReminderSettings(prev => ({
        ...prev,
        enableReminders: false
      }));
    }
    
  } catch (error) {
    console.error('Error fetching medication and reminders:', error);
    setError(`Failed to load medication details: ${error.message}`);
  } finally {
    setLoading(false);
  }
};
const deduplicateReminderTimes = (reminderTimes) => {
  const uniqueSet = new Set();
  const deduplicatedList = [];
  
  reminderTimes.forEach(timeSlot => {
    // Create a unique key based on time and meal timing
    const uniqueKey = `${timeSlot.time}-${timeSlot.mealTiming}`;
    
    if (!uniqueSet.has(uniqueKey)) {
      uniqueSet.add(uniqueKey);
      deduplicatedList.push(timeSlot);
    }
  });
  
  console.log(`Deduplicated ${reminderTimes.length} reminders to ${deduplicatedList.length} unique times`);
  return deduplicatedList;
};




    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleReminderChange = (field, value) => {
        setReminderSettings(prev => ({
            ...prev,
            [field]: value
        }));

        // Auto-adjust reminder times based on frequency
        if (field === 'frequencyType' || field === 'timesPerDay') {
            updateReminderTimes(field === 'timesPerDay' ? value : prev.timesPerDay,
                field === 'frequencyType' ? value : prev.frequencyType);
        }
    };
    const updateExistingReminders = async (medicationId, token) => {
        try {
            console.log(`Updating reminders for medication ${medicationId}`);

            // First, get existing reminders
            const existingResponse = await fetch(`http://localhost:8000/medications/${medicationId}/reminders`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!existingResponse.ok) {
                console.error('Failed to fetch existing reminders');
                // If we can't fetch existing, just create new ones
                await createReminders(medicationId, token);
                return;
            }

            const existingReminders = await existingResponse.json();
            const newReminderSchedule = generateReminderSchedule(medicationId);

            // Update existing reminders with new schedule
            const updateData = {
                existingReminders,
                newSchedule: newReminderSchedule,
                preserveStatus: true // Keep "taken" status for existing reminders
            };

            const updateResponse = await fetch(`http://localhost:8000/medications/${medicationId}/reminders/bulk-update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateData)
            });

            if (!updateResponse.ok) {
                throw new Error('Failed to update reminders');
            }

            console.log('Successfully updated existing reminders');

        } catch (error) {
            console.error('Error updating existing reminders:', error);
            setError(`Warning: Medication saved but reminders might not be updated properly`);
        }
    };

    const updateReminderTimes = (timesPerDay, frequencyType) => {
        if (frequencyType === 'multiple_times') {
            const times = [];
            const interval = 24 / timesPerDay;

            for (let i = 0; i < timesPerDay; i++) {
                const hour = Math.floor(8 + (interval * i)) % 24; // Start at 8 AM
                const timeString = `${hour.toString().padStart(2, '0')}:00`;
                times.push({
                    time: timeString,
                    mealTiming: reminderSettings.mealTiming,
                    minutesOffset: 30
                });
            }

            setReminderSettings(prev => ({
                ...prev,
                reminderTimes: times,
                timesPerDay: timesPerDay
            }));
        }
    };

   const handleTimeChange = (index, field, value) => {
  const newTimes = [...reminderSettings.reminderTimes];
  newTimes[index][field] = value;
  
  // Apply deduplication after any time change
  const deduplicatedTimes = deduplicateReminderTimes(newTimes);
  
  setReminderSettings(prev => ({
    ...prev,
    reminderTimes: deduplicatedTimes
  }));
};


    const addReminderTime = () => {
  const newTime = { 
    time: '12:00', 
    mealTiming: 'none', 
    minutesOffset: 0 
  };
  
  // Check if this time already exists
  const exists = reminderSettings.reminderTimes.some(existing => 
    existing.time === newTime.time && existing.mealTiming === newTime.mealTiming
  );
  
  if (!exists) {
    setReminderSettings(prev => ({
      ...prev,
      reminderTimes: [...prev.reminderTimes, newTime]
    }));
  } else {
    console.log('Reminder time already exists, not adding duplicate');
  }
};


    const removeReminderTime = (index) => {
        if (reminderSettings.reminderTimes.length > 1) {
            const newTimes = reminderSettings.reminderTimes.filter((_, i) => i !== index);
            setReminderSettings(prev => ({
                ...prev,
                reminderTimes: newTimes
            }));
        }
    };

    const handleDayToggle = (dayValue) => {
        const newDays = reminderSettings.daysOfWeek.includes(dayValue)
            ? reminderSettings.daysOfWeek.filter(day => day !== dayValue)
            : [...reminderSettings.daysOfWeek, dayValue].sort();

        setReminderSettings(prev => ({
            ...prev,
            daysOfWeek: newDays
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.dosage.trim()) {
            setError('Name and dosage are required');
            return;
        }

        const token = localStorage.getItem('token');
        setLoading(true);
        setError('');

        try {
            // Update medication details
            const medicationUrl = isEdit
                ? `http://localhost:8000/medications/${id}`
                : 'http://localhost:8000/medications';

            const medicationResponse = await fetch(medicationUrl, {
                method: isEdit ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!medicationResponse.ok) {
                throw new Error('Failed to save medication');
            }

            const medicationResult = await medicationResponse.json();
            const medicationId = isEdit ? id : medicationResult.id;

            // Handle reminders separately
            if (reminderSettings.enableReminders && medicationId) {
                if (isEdit) {
                    // For editing: Use replace strategy
                    await replaceReminders(medicationId, token);
                } else {
                    // For new medications: Create reminders
                    await createReminders(medicationId, token);
                }
            } else if (isEdit && !reminderSettings.enableReminders) {
                // Disable all reminders for this medication
                await clearAllReminders(medicationId, token);
            }

            navigate('/dashboard'); // Navigate to dashboard instead of medications

        } catch (error) {
            setError(`Failed to save: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };
    const replaceReminders = async (medicationId, token) => {
        try {
            console.log(`Replacing reminders for medication ${medicationId}`);

            // Step 1: Get existing reminders to preserve "taken" status
            const existingResponse = await fetch(`http://localhost:8000/medications/${medicationId}/reminders`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            let existingReminders = [];
            if (existingResponse.ok) {
                existingReminders = await existingResponse.json();
            }

            // Step 2: Clear all existing reminders
            await clearAllReminders(medicationId, token);

            // Step 3: Generate new reminder schedule
            const newReminders = generateReminderSchedule(medicationId);

            // Step 4: Preserve "taken" status for matching times
            const remindersWithPreservedStatus = newReminders.map(newReminder => {
                // Look for existing reminder with same date and similar time (within 5 minutes)
                const existingMatch = existingReminders.find(existing => {
                    const existingDate = new Date(existing.remind_at);
                    const newDate = new Date(newReminder.remind_at);

                    const dateDiff = Math.abs(existingDate.getTime() - newDate.getTime());
                    return dateDiff < 5 * 60 * 1000; // Within 5 minutes
                });

                return {
                    ...newReminder,
                    taken: existingMatch ? existingMatch.taken : false
                };
            });

            // Step 5: Create new reminders with preserved status
            for (const reminder of remindersWithPreservedStatus) {
                await fetch('http://localhost:8000/reminders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(reminder)
                });
            }

            console.log(`Successfully replaced ${remindersWithPreservedStatus.length} reminders`);

        } catch (error) {
            console.error('Error replacing reminders:', error);
            throw error;
        }
    };
    const clearAllReminders = async (medicationId, token) => {
        try {
            const response = await fetch(`http://localhost:8000/medications/${medicationId}/reminders/clear`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                console.error('Failed to clear existing reminders');
            }
        } catch (error) {
            console.error('Error clearing reminders:', error);
        }
    };




    const createReminders = async (medicationId, token) => {
        const reminders = generateReminderSchedule(medicationId);

        for (const reminder of reminders) {
            await fetch('http://localhost:8000/reminders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(reminder)
            });
        }
    };

    const generateReminderSchedule = (medicationId) => {
        const reminders = [];
        const { frequencyType, reminderTimes, daysOfWeek, startDate, endDate } = reminderSettings;

        console.log('Generating reminder schedule:', { frequencyType, reminderTimes, daysOfWeek });

        switch (frequencyType) {
            case 'once':
                reminders.push({
                    medication_id: medicationId,
                    remind_at: `${startDate} ${reminderTimes[0].time}:00`,
                    frequency_type: 'once',
                    meal_timing: reminderTimes[0].mealTiming || 'none',
                    taken: false
                });
                break;

            case 'daily':
            case 'multiple_times':
                const endDateObj = endDate ? new Date(endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                const startDateObj = new Date(startDate);
                const currentDate = new Date(startDateObj);

                // Clear time to start at beginning of day
                currentDate.setHours(0, 0, 0, 0);

                while (currentDate <= endDateObj) {
                    const dayOfWeek = currentDate.getDay() === 0 ? 7 : currentDate.getDay();

                    if (daysOfWeek.includes(dayOfWeek)) {
                        reminderTimes.forEach((timeSlot, index) => {
                            const reminderDateTime = new Date(currentDate);
                            const [hours, minutes] = timeSlot.time.split(':');

                            reminderDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

                            // Adjust for meal timing
                            if (timeSlot.mealTiming === 'before_food') {
                                reminderDateTime.setMinutes(reminderDateTime.getMinutes() - 30);
                            } else if (timeSlot.mealTiming === 'after_food') {
                                reminderDateTime.setMinutes(reminderDateTime.getMinutes() + 30);
                            }

                            const reminderString = reminderDateTime.toISOString().slice(0, 19).replace('T', ' ');

                            reminders.push({
                                medication_id: medicationId,
                                remind_at: reminderString,
                                frequency_type: frequencyType,
                                meal_timing: timeSlot.mealTiming || 'none',
                                taken: false
                            });
                        });
                    }

                    currentDate.setDate(currentDate.getDate() + 1);
                }
                break;
        }

        console.log(`Generated ${reminders.length} reminders for medication ${medicationId}`);
        return reminders;
    };


    return (
        <div className="min-h-screen bg-gray-200 p-4 md:p-8">
            <div className="max-w-3xl mx-auto">
                <BackButton />

                <h1 className="text-3xl font-bold text-teal-700 mb-8 text-center">
                    {isEdit ? 'Edit Medication' : 'Add New Medication'}
                </h1>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 mb-6 rounded text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Medication Information */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Medication Information</h2>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Medication Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="Enter medication name"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Dosage *
                                </label>
                                <input
                                    type="text"
                                    name="dosage"
                                    value={formData.dosage}
                                    onChange={handleFormChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="e.g., 500mg, 2 tablets"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Side Effects (Optional)
                            </label>
                            <textarea
                                name="sideEffects"
                                value={formData.sideEffects}
                                onChange={handleFormChange}
                                rows={3}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                placeholder="List any known side effects"
                            />
                        </div>
                    </div>

                    {/* Reminder Settings */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Reminder Settings</h2>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={reminderSettings.enableReminders}
                                    onChange={(e) => handleReminderChange('enableReminders', e.target.checked)}
                                    className="mr-2"
                                />
                                <span className="text-sm text-gray-600">Enable Reminders</span>
                            </label>
                        </div>

                        {reminderSettings.enableReminders && (
                            <div className="space-y-6">
                                {/* Frequency Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Reminder Frequency
                                    </label>
                                    <select
                                        value={reminderSettings.frequencyType}
                                        onChange={(e) => handleReminderChange('frequencyType', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                                    >
                                        {frequencyOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Times per day for multiple_times */}
                                {reminderSettings.frequencyType === 'multiple_times' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            How many times per day?
                                        </label>
                                        <select
                                            value={reminderSettings.timesPerDay}
                                            onChange={(e) => handleReminderChange('timesPerDay', parseInt(e.target.value))}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                                        >
                                            {[1, 2, 3, 4, 5, 6].map(num => (
                                                <option key={num} value={num}>{num} time{num > 1 ? 's' : ''}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Meal Timing */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Meal Timing
                                    </label>
                                    <select
                                        value={reminderSettings.mealTiming}
                                        onChange={(e) => handleReminderChange('mealTiming', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                                    >
                                        {mealTimingOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Reminder Times */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Reminder Times
                                    </label>
                                    {reminderSettings.reminderTimes.map((timeSlot, index) => (
                                        <div key={index} className="flex items-center gap-2 mb-2">
                                            <input
                                                type="time"
                                                value={timeSlot.time}
                                                onChange={(e) => handleTimeChange(index, 'time', e.target.value)}
                                                className="p-2 border border-gray-300 rounded-lg"
                                            />
                                            {reminderSettings.mealTiming !== 'none' && (
                                                <select
                                                    value={timeSlot.mealTiming}
                                                    onChange={(e) => handleTimeChange(index, 'mealTiming', e.target.value)}
                                                    className="p-2 border border-gray-300 rounded-lg"
                                                >
                                                    <option value="before_food">Before meal</option>
                                                    <option value="after_food">After meal</option>
                                                    <option value="with_food">With meal</option>
                                                </select>
                                            )}
                                            {reminderSettings.reminderTimes.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeReminderTime(index)}
                                                    className="bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addReminderTime}
                                        className="text-teal-600 hover:text-teal-800 text-sm"
                                    >
                                        + Add another time
                                    </button>
                                </div>

                                {/* Days of Week */}
                                {(reminderSettings.frequencyType === 'daily' || reminderSettings.frequencyType === 'multiple_times') && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Days of Week
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {daysOfWeekOptions.map(day => (
                                                <label key={day.value} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={reminderSettings.daysOfWeek.includes(day.value)}
                                                        onChange={() => handleDayToggle(day.value)}
                                                        className="mr-1"
                                                    />
                                                    <span className="text-sm">{day.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Date Range */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            value={reminderSettings.startDate}
                                            onChange={(e) => handleReminderChange('startDate', e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            End Date (Optional)
                                        </label>
                                        <input
                                            type="date"
                                            value={reminderSettings.endDate}
                                            onChange={(e) => handleReminderChange('endDate', e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            // Change this line in the cancel button
                            onClick={() => navigate('/dashboard')}  // Instead of '/medications'

                            className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors"
                        >
                            {loading ? 'Saving...' : (isEdit ? 'Update Medication' : 'Add Medication & Reminders')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
