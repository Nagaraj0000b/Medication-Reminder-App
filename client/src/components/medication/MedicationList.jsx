import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function MedicationList({ medications, onEdit, onDelete, onViewAll }) {
  const navigate = useNavigate();

  if (!medications || medications.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        No medications for this day.
      </div>
    );
  }

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
        <ul className="divide-y divide-gray-100">
          {medications.map(med => (
            <li key={med.id} className="p-4 flex flex-col md:flex-row md:justify-between md:items-center hover:bg-gray-50 rounded-lg transition">
              <div>
                <div className="font-semibold text-lg text-gray-800">{med.name}</div>
                <div className="text-gray-500 text-sm">Dosage: {med.dosage}</div>
                {med.sideEffects && (
                  <div className="text-xs text-amber-600 mt-1">
                    Side effects: {med.sideEffects}
                  </div>
                )}
                {med.reminders && med.reminders.length > 0 && (
                  <div className="mt-2 text-sm text-teal-700">
                    Reminders:
                    <ul>
                      {med.reminders.map(rem => (
                        <li key={rem.id}>
                          {rem.type === "recurring"
                            ? `Every ${rem.weekday} at ${rem.time}`
                            : `On ${new Date(rem.remind_at).toLocaleString()}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-4 md:mt-0">
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
                <button
                  className="bg-teal-100 text-teal-700 px-3 py-1 rounded hover:bg-teal-200 transition-colors text-sm"
                  onClick={() => navigate(`/medications/${med.id}/reminders`)}
                >
                  Reminders
                </button>
              </div>
            </li>
          ))}
        </ul>
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
