import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../components/common/BackButton';
import ReminderList from '../components/reminder/ReminderList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { apiUrl } from '../utils/api';

export default function MedicationReminderPage() {
  const [medication, setMedication] = useState(null);
  const [medications, setMedications] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (id) {
          // If we have an ID, fetch specific medication and its reminders
          const medRes = await fetch(apiUrl(`medications/${id}`), {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
          
          if (!medRes.ok) throw new Error('Failed to fetch medication');
          const medData = await medRes.json();
          setMedication(medData);
          
          // Fetch reminders for this medication
          const remRes = await fetch(apiUrl(`reminders?medication_id=${id}`), {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
          
          if (!remRes.ok) throw new Error('Failed to fetch reminders');
          const remData = await remRes.json();
          setReminders(Array.isArray(remData) ? remData : []);
        } else {
          // If no ID, fetch all medications
          const medsRes = await fetch(apiUrl('medications'), {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
          
          if (!medsRes.ok) throw new Error('Failed to fetch medications');
          const medsData = await medsRes.json();
          setMedications(Array.isArray(medsData) ? medsData : []);
        }
      } catch (err) {
        setError(err.message || 'An error occurred');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  const handleDeleteReminder = async (reminderId) => {
    try {
      const res = await fetch(`http://localhost:8000/reminders/${reminderId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (res.ok) {
        // Update UI by filtering out the deleted reminder
        setReminders(prevReminders => prevReminders.filter(rem => rem.id !== reminderId));
      } else {
        throw new Error('Failed to delete reminder');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
  };
  
  const handleToggleTaken = async (reminderId, taken) => {
    try {
      const res = await fetch(`http://localhost:8000/reminders/${reminderId}/taken`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ taken: taken ? 1 : 0 })
      });
      
      if (res.ok) {
        // Update UI to reflect the new taken status
        setReminders(prevReminders => 
          prevReminders.map(rem => 
            rem.id === reminderId ? { ...rem, taken: taken ? 1 : 0 } : rem
          )
        );
      } else {
        throw new Error('Failed to update reminder status');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
  };
  
  const handleDeleteMedication = async (medicationId) => {
    if (!window.confirm('Are you sure you want to delete this medication?')) {
      return;
    }
    
    try {
      const res = await fetch(`http://localhost:8000/medications/${medicationId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (res.ok) {
        // Update UI by filtering out the deleted medication
        setMedications(prevMedications => prevMedications.filter(med => med.id !== medicationId));
      } else {
        throw new Error('Failed to delete medication');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <BackButton />
          <LoadingSpinner message="Loading medication reminders..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <BackButton />
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mt-4">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <BackButton />
        
        {id && medication ? (
          // Display specific medication details and its reminders
          <>
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h1 className="text-2xl font-bold text-teal-700 mb-2">
                {medication.name} Reminders
              </h1>
              <div className="text-gray-600 mb-4">
                Dosage: {medication.dosage}
              </div>
              {medication.sideEffects && (
                <div className="text-amber-700 text-sm mb-4">
                  <strong>Side Effects:</strong> {medication.sideEffects}
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">All Reminders</h2>
                <button
                  className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
                  onClick={() => navigate(`/reminders/new?medication_id=${id}`)}
                >
                  Add New Reminder
                </button>
              </div>
              
              {reminders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg mb-4">No reminders set for this medication</div>
                  <button
                    className="bg-teal-600 text-white px-6 py-3 rounded hover:bg-teal-700"
                    onClick={() => navigate(`/reminders/new?medication_id=${id}`)}
                  >
                    Add Your First Reminder
                  </button>
                </div>
              ) : (
                <ReminderList
                  reminders={reminders}
                  onEdit={(reminderId) => navigate(`/reminders/edit/${reminderId}`)}
                  onDelete={handleDeleteReminder}
                  onToggleTaken={handleToggleTaken}
                />
              )}
            </div>
          </>
        ) : (
          // Display list of all medications when no ID is provided
          <>
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h1 className="text-2xl font-bold text-teal-700 mb-2">
                All Medications
              </h1>
              <p className="text-gray-600">
                Select a medication to view or manage its reminders
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Your Medications</h2>
                <button
                  className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
                  onClick={() => navigate('/medications/new')}
                >
                  Add New Medication
                </button>
              </div>
              
              {medications.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg mb-4">No medications added yet</div>
                  <button
                    className="bg-teal-600 text-white px-6 py-3 rounded hover:bg-teal-700"
                    onClick={() => navigate('/medications/new')}
                  >
                    Add Your First Medication
                  </button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {medications.map(med => (
                    <div key={med.id} className="border rounded-lg p-4 hover:shadow-md transition">
                      <h3 className="text-lg font-semibold text-teal-700">{med.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">Dosage: {med.dosage}</p>
                      <div className="flex justify-between mt-4">
                        <button
                          className="text-teal-600 hover:text-teal-800"
                          onClick={() => navigate(`/medications/edit/${med.id}`)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteMedication(med.id)}
                        >
                          Delete
                        </button>
                        <button
                          className="text-teal-600 hover:text-teal-800"
                          onClick={() => navigate(`/medications/${med.id}/reminders`)}
                        >
                          View Reminders
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}