import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';

export default function MedicationsPage() {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchMedications();
  }, [navigate]);

  const fetchMedications = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/medications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Server response:', response.status, errorData);
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setMedications(data);
      } else if (data.error?.toLowerCase().includes('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login');
      } else {
        setError(data.error || 'Failed to load medications');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError(`Failed to load medications: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/medications/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this medication? This will also delete all associated reminders.')) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8000/medications/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchMedications(); // Refresh the list
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete medication');
      }
    } catch (error) {
      setError('Failed to delete medication');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-200 flex items-center justify-center">
        <div className="text-lg">Loading medications...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <BackButton />
        
        <h1 className="text-3xl font-bold text-teal-700 mb-8 text-center">My Medications</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 mb-4 rounded text-center">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">All Medications</h2>
            <button
              className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition-colors"
              onClick={() => navigate('/medications/new')}
            >
              Add New Medication
            </button>
          </div>

          {medications.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">No medications found</div>
              <button
                className="bg-teal-600 text-white px-6 py-3 rounded hover:bg-teal-700 transition-colors"
                onClick={() => navigate('/medications/new')}
              >
                Add Your First Medication
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {medications.map((medication) => (
                <div key={medication.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-800">{medication.name}</h3>
                      <p className="text-gray-600 mt-1">Dosage: {medication.dosage}</p>
                      {medication.sideEffects && (
                        <p className="text-amber-600 text-sm mt-2">
                          Side effects: {medication.sideEffects}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition-colors"
                        onClick={() => handleEdit(medication.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition-colors"
                        onClick={() => handleDelete(medication.id)}
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
