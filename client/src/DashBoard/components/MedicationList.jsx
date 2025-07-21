import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function MedicationList({ medications, onEdit, onDelete, onViewAll }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-gray-100">
        <h3 className="text-lg font-bold text-teal-700">Medications</h3>
        <button
          className="text-sm text-blue-600 underline hover:text-blue-800"
          onClick={onViewAll}
        >
          View All
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {!medications || medications.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-8">
              <div className="text-gray-300 text-4xl mb-2">💊</div>
              <p className="text-gray-500">No medications for this day</p>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {medications.map((med) => (
              <li key={med.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                <div className="flex-1">
                  <div className="font-semibold text-lg">{med.name}</div>
                  <div className="text-gray-500 text-sm">{med.dosage}</div>
                  {med.sideEffects && (
                    <div className="text-xs text-amber-600 mt-1">
                      Side effects: {med.sideEffects}
                    </div>
                  )}
                  {med.reminders && med.reminders.length > 0 && (
                    <div className="text-xs text-teal-600 mt-1">
                      {med.reminders.length} reminder(s) today
                    </div>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition-colors text-sm"
                    onClick={() => onEdit(med.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition-colors text-sm"
                    onClick={() => onDelete(med.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-100">
        <button
          className="w-full bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition-colors text-sm"
          onClick={() => navigate('/medications/new')}
        >
          Add Medication
        </button>
      </div>
    </div>
  );
}
