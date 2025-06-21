import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserGreeting from "./components/UserGreeting";
import TimeDate from "./components/TimeDate";
import SearchBar from "./components/SearchBar";
import DateRow from "./components/DateRow";
import MedicationList from "./components/MedicationList";

// Example data
const mockMeds = [
  { id: 1, name: "Aspirin", dosage: "100mg", sideEffects: "Nausea" },
  { id: 2, name: "Paracetamol", dosage: "500mg", sideEffects: "None" },
];
const mockReminders = [
  { id: 1, text: "Take Aspirin", time: "08:00 AM", medId: 1, date: "2025-06-21" },
  { id: 2, text: "Take Paracetamol", time: "02:00 PM", medId: 2, date: "2025-06-22" },
];

function formatDateKey(date) {
  return date.toISOString().split("T")[0];
}

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [medications, setMedications] = useState(mockMeds);
  const [reminders] = useState(mockReminders);
  const navigate = useNavigate();

  // Filter reminders for the selected day
  const remindersForDay = reminders.filter(
    r => r.date === formatDateKey(selectedDate)
  );

  // Get medication IDs with reminders for the selected day
  const medIdsWithReminders = remindersForDay.map(r => r.medId);

  // Filter medications that have reminders for the selected day
  const medicationsForDay = medications.filter(med =>
    medIdsWithReminders.includes(med.id)
  );

  return (
    <div className="min-h-screen bg-gray-200 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Greeting and Time/Date Row - always left/right even on mobile */}
        <div className="flex w-full justify-between items-center mb-6">
          <div className="flex-1 text-left">
            <UserGreeting username="Alex" />
          </div>
          <div className="flex-1 text-right">
            <TimeDate />
          </div>
        </div>
        {/* Search Bar */}
        <SearchBar />
        {/* Date Row */}
        <DateRow selectedDate={selectedDate} onDateChange={setSelectedDate} />
        {/* Medications List */}
        <div className="mt-8">
          <MedicationList
            medications={medicationsForDay}
            onEdit={id => navigate(`/medications/${id}`)}
            onDelete={id => setMedications(medications.filter(m => m.id !== id))}
            onViewAll={() => navigate("/medications")}
          />
        </div>
        {/* Add Medication Button */}
        <button
          className="fixed bottom-8 right-8 bg-teal-600 text-white p-4 rounded-full shadow-lg hover:bg-teal-700 transition"
          onClick={() => navigate("/medications/new")}
          title="Add Medication"
        >
          +
        </button>
      </div>
    </div>
  );
}
