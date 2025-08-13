import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../common/BackButton';

export default function MedicationForm() {
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    sideEffects: ''
  });
  
  const [addReminder, setAddReminder] = useState(false);
  const [reminderData, setReminderData] = useState({
    type: 'single',
    remind_at: '',
    weekday: '',
    time: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      fetch(`http://localhost:8000/medications/${id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => res.json())
        .then(data => {
          setFormData({
            name: data.name || '',
            dosage: data.dosage || '',
            sideEffects: data.sideEffects || ''
          });
          setLoading(false);
        })
        .catch(err => {
          setError('Failed to load medication');
          setLoading(false);
        });
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleReminderChange = (e) => {
    const { name, value } = e.target;
    setReminderData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // First save the medication
      const medicationResponse = await fetch(
        isEditMode ? `http://localhost:8000/medications/${id}` : 'http://localhost:8000/medications',
        {
          method: isEditMode ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(formData)
        }
      );

      if (!medicationResponse.ok) {
        throw new Error('Failed to save medication');
      }

      const medicationResult = await medicationResponse.json();
      const medicationId = isEditMode ? id : medicationResult.id;

      // If adding a reminder, save it too
      if (addReminder && medicationId) {
        const reminderResponse = await fetch('http://localhost:8000/reminders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            ...reminderData,
            medication_id: medicationId
          })
        });

        if (!reminderResponse.ok) {
          throw new Error('Failed to save reminder');
        }
      }

      navigate('/medications');
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <BackButton />
        
        <div className="bg-white rounded-xl shadow-sm p-6 mt-4">
          <h1 className="text-2xl font-bold text-teal-700 mb-6">
            {isEditMode ? 'Edit Medication' : 'Add New Medication'}
          </h1>
          
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Medication Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Dosage</label>
              <input
                type="text"
                name="dosage"
                value={formData.dosage}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
                placeholder="e.g., 500mg twice daily"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-1">Side Effects (optional)</label>
              <textarea
                name="sideEffects"
                value={formData.sideEffects}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                rows={3}
                placeholder="List any known side effects"
              />
            </div>
            
            {!isEditMode && (
              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="addReminder"
                    checked={addReminder}
                    onChange={() => setAddReminder(!addReminder)}
                    className="mr-2"
                  />
                  <label htmlFor="addReminder" className="text-gray-700">Add a reminder for this medication</label>
                </div>
              </div>
            )}
            
            {addReminder && !isEditMode && (
              <div className="mb-6 p-4 bg-gray-50 rounded">
                <h3 className="font-medium mb-3">Reminder Details</h3>
                
                <div className="mb-3">
                  <label className="block text-gray-700 mb-1">Reminder Type</label>
                  <select
                    name="type"
                    value={reminderData.type}
                    onChange={handleReminderChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="single">Single Time</option>
                    <option value="recurring">Recurring</option>
                  </select>
                </div>
                
                {reminderData.type === 'single' ? (
                  <div className="mb-3">
                    <label className="block text-gray-700 mb-1">When to remind</label>
                    <input
                      type="datetime-local"
                      name="remind_at"
                      value={reminderData.remind_at}
                      onChange={handleReminderChange}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required={addReminder}
                    />
                  </div>
                ) : (
                  <>
                    <div className="mb-3">
                      <label className="block text-gray-700 mb-1">Day of Week</label>
                      <select
                        name="weekday"
                        value={reminderData.weekday}
                        onChange={handleReminderChange}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required={addReminder && reminderData.type === 'recurring'}
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
                    
                    <div className="mb-3">
                      <label className="block text-gray-700 mb-1">Time</label>
                      <input
                        type="time"
                        name="time"
                        value={reminderData.time}
                        onChange={handleReminderChange}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required={addReminder && reminderData.type === 'recurring'}
                      />
                    </div>
                  </>
                )}
              </div>
            )}
            
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={() => navigate('/medications')}
                className="px-4 py-2 border border-gray-300 rounded mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
                disabled={loading}
              >
                {loading ? 'Saving...' : isEditMode ? 'Update Medication' : 'Add Medication'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
