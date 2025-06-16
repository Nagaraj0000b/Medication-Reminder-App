import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import UserGreeting from "../components/UserGreeting";
import DateRow from "../components/DateRow";
import MedicationList from "../components/MedicationList";
import ReminderList from "../components/ReminderList";

const mockMeds = [
  { id: 1, name: "Aspirin", dosage: "100mg", sideEffects: "Nausea" },
  { id: 2, name: "Paracetamol", dosage: "500mg", sideEffects: "None" },
];
const mockReminders = [
  { id: 1, text: "Take Aspirin", time: "08:00 AM" },
  { id: 2, text: "Take Paracetamol", time: "02:00 PM" },
];

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [medications, setMedications] = useState(mockMeds);
  const [reminders, setReminders] = useState(mockReminders);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <SearchBar />
          <UserGreeting username="Alex" />
        </div>
        <DateRow selectedDate={selectedDate} onDateChange={setSelectedDate} />
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <MedicationList
            medications={medications}
            onEdit={(id) => navigate(`/medications/${id}`)}
            onDelete={(id) => setMedications(medications.filter(m => m.id !== id))}
            onViewAll={() => navigate("/medications")}
          />
          <ReminderList
            reminders={reminders}
            onEdit={(id) => navigate(`/reminders/${id}`)}
            onDelete={(id) => setReminders(reminders.filter(r => r.id !== id))}
            onViewAll={() => navigate("/reminders")}
          />
        </div>
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
