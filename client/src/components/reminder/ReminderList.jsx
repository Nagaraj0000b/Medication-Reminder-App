import React from 'react';

export default function ReminderList({ reminders, onEdit, onDelete, onToggleTaken }) {
  const formatTime = (dateTimeString) => {
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return 'Invalid time';
    }
  };

  if (!reminders || reminders.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="text-gray-400">No reminders found</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <ul className="divide-y divide-gray-100">
        {reminders.map((reminder) => (
          <li key={reminder.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
            <div className="flex items-center">
              {onToggleTaken && (
                <input
                  type="checkbox"
                  checked={reminder.taken === 1}
                  onChange={() => onToggleTaken(reminder.id, reminder.taken === 0)}
                  className="mr-3 h-5 w-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
              )}
              <div>
                <div className="font-medium">{reminder.medication_name || 'Medication'}</div>
                <div className="text-sm text-gray-500">{formatTime(reminder.remind_at)}</div>
              </div>
            </div>
            
            <div className="flex gap-2">
              {onEdit && (
                <button
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 text-sm"
                  onClick={() => onEdit(reminder.id)}
                >
                  Edit
                </button>
              )}
              
              {onDelete && (
                <button
                  className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 text-sm"
                  onClick={() => onDelete(reminder.id)}
                >
                  Delete
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
