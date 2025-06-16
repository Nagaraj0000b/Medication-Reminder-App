import { useNavigate } from "react-router-dom";

export default function MedicationList({ medications, onEdit, onDelete, onViewAll }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-teal-700">Medications</h3>
        <button
          className="text-sm text-blue-600 underline"
          onClick={onViewAll}
        >
          View All
        </button>
      </div>
      <ul className="divide-y divide-gray-100">
        {medications.map((med) => (
          <li key={med.id} className="py-4 flex justify-between items-center">
            <div>
              <div className="font-semibold text-lg">{med.name}</div>
              <div className="text-gray-500 text-sm">{med.dosage}</div>
              {med.sideEffects && (
                <div className="text-xs text-amber-600 mt-1">
                  Side effects: {med.sideEffects}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
                onClick={() => onEdit(med.id)}
                title="Edit"
              >
                Edit
              </button>
              <button
                className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
                onClick={() => onDelete(med.id)}
                title="Delete"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button
        className="mt-4 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
        onClick={() => navigate("/medications/new")}
      >
        + Add Medication
      </button>
    </div>
  );
}
