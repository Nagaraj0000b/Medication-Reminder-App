import React from 'react';

export default function RemindersList({ reminders, onEdit, onDelete, onToggleTaken }) {
  const formatTime = (dateTimeString) => {
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return 'Invalid time';
    }
  };

  const handleEditReminder = (reminderId) => {
    // Navigate to reminder edit page or open edit modal
    if (onEdit) {
      onEdit(reminderId);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-teal-50 rounded-2xl shadow-sm border border-teal-100">
      <div className="p-4 border-b border-teal-100 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-t-2xl">
        <h3 className="text-lg font-semibold text-teal-700">Today's Reminders</h3>
      </div>
      
      <div className="max-h-64 overflow-y-auto">
        {reminders.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-teal-200 text-4xl mb-3">⏰</div>
            <p className="text-teal-500 text-sm">No reminders for this day</p>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {reminders.map((reminder) => (
              <div 
                key={reminder.id} 
                className="bg-white rounded-xl p-4 shadow-sm border border-teal-100 hover:shadow-md hover:border-teal-200 transition-all duration-200"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-base text-gray-800 mb-1">
                      {reminder.medication_name || 'Unknown Medication'}
                    </div>
                    <div className="text-sm text-teal-600 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatTime(reminder.remind_at)}
                    </div>
                    <div className="mb-3">
                      <button
                        onClick={() => onToggleTaken(reminder.id, reminder.taken)}
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                          reminder.taken 
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-200' 
                            : 'bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-200'
                        }`}
                      >
                        <span className="mr-1">
                          {reminder.taken ? '✓' : '○'}
                        </span>
                        {reminder.taken ? 'Taken' : 'Pending'}
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-sm hover:bg-blue-100 border border-blue-200 transition-colors duration-200"
                      onClick={() => handleEditReminder(reminder.id)}
                      title="Edit Reminder"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-sm hover:bg-red-100 border border-red-200 transition-colors duration-200"
                      onClick={() => onDelete(reminder.id)}
                      title="Delete Reminder"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
