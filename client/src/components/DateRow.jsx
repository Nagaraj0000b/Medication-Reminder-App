import { addDays, format } from "date-fns";

export default function DateRow({ selectedDate, onDateChange }) {
  // Previous day, today, next 4 days
  const days = [-1, 0, 1, 2, 3, 4].map(offset => addDays(new Date(), offset));
  return (
    <div className="flex gap-2 overflow-x-auto py-2">
      {days.map(date => {
        const isSelected =
          format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
        return (
          <button
            key={date}
            className={`px-4 py-2 rounded-lg font-semibold ${
              isSelected
                ? "bg-teal-600 text-white"
                : "bg-white text-gray-700 hover:bg-teal-50"
            }`}
            onClick={() => onDateChange(date)}
          >
            {format(date, "EEE, dd MMM")}
          </button>
        );
      })}
    </div>
  );
}
