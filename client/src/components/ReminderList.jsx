import { useNavigate } from "react-router-dom";

export default function ReminderList({ reminders, onEdit, onDelete, onViewAll }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-yellow-600">Reminders</h3>
        <button
          className="text-sm text-blue-600 underline"
          onClick={onViewAll}
        >
          View All
        </button>
      </div>
      <ul className="divide-y divide-gray-100">
        {reminders.map((rem) => (
          <li key={rem.id} className="py-4 flex justify-between items-center">
            <div>
              <div className="font-semibold text-lg">{rem.text}</div>
              <div className="text-gray-500 text-sm">{rem.time}</div>
            </div>
            <div className="flex gap-2">
              <button
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
                onClick={() => onEdit(rem.id)}
                title="Edit"
              >
                Edit
              </button>
              <button
                className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
                onClick={() => onDelete(rem.id)}
                title="Delete"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button
        className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        onClick={() => navigate("/reminders/new")}
      >
        + Add Reminder
      </button>
    </div>
  );
}
