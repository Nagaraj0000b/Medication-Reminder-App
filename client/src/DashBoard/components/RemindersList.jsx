export default function RemindersList({ reminders }) {
  if (!reminders.length) return <div className="text-gray-400 text-center mt-8">No reminders for this day.</div>;
  return (
    <div className="mt-8 space-y-4">
      {reminders.map(rem => (
        <div key={rem.id} className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <div className="font-semibold text-teal-700">{rem.text}</div>
            <div className="text-gray-500 text-sm">{rem.medicine}</div>
          </div>
          <div className="text-gray-700 font-mono">{rem.time}</div>
        </div>
      ))}
    </div>
  );
}
