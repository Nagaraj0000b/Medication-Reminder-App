export default function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Search medications or reminders..."
      className="w-full md:w-80 px-4 py-2 rounded-lg border border-gray-200 shadow-sm"
      value={value}
      onChange={onChange}
    />
  );
}
