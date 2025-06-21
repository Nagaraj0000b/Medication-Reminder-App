export default function SearchBar({ value, onChange }) {
  return (
    <div className="w-full max-w-xl mx-auto mt-6">
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search medications or reminders..."
        className="w-full px-5 py-3 rounded-xl shadow-sm border border-gray-200 focus:ring-2 focus:ring-teal-400 outline-none transition text-lg"
      />
    </div>
  );
}
