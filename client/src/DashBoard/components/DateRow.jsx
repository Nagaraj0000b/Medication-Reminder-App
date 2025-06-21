import { useState } from "react";
import { addDays, format, isSameDay } from "date-fns";

function getDaysArray(centerDate) {
  // Previous day, today, 3 upcoming days (total 5)
  return [-1, 0, 1, 2, 3].map(offset => addDays(centerDate, offset));
}

export default function DateRow({ selectedDate, onDateChange }) {
  const [centerDate, setCenterDate] = useState(new Date());
  const days = getDaysArray(centerDate);

  const scrollLeft = () => setCenterDate(addDays(centerDate, -1));
  const scrollRight = () => setCenterDate(addDays(centerDate, 1));

  return (
    <div className="w-full max-w-xl mx-auto mt-4 flex items-center justify-between">
      {/* Left Arrow */}
      <button
        className="rounded-full p-2 bg-white shadow hover:bg-teal-100 border border-gray-200 transition"
        onClick={scrollLeft}
        aria-label="Scroll left"
        tabIndex={0}
      >
        <span className="text-lg text-teal-600">&#8592;</span>
      </button>
      {/* Days Row */}
      <div className="flex gap-1 flex-1 justify-center">
        {days.map((day, idx) => {
          const isToday = isSameDay(day, new Date());
          const isSelected = isSameDay(day, selectedDate);
          return (
            <button
              key={idx}
              onClick={() => onDateChange(day)}
              className={`
                flex flex-col items-center py-2 rounded-full text-xs font-medium transition-all duration-150
                ${isSelected
                  ? "bg-teal-500 text-white shadow scale-105"
                  : "bg-white text-gray-700 hover:bg-teal-50"}
                ${isToday && !isSelected ? "border border-teal-400" : ""}
                focus:outline-none focus:ring-2 focus:ring-teal-400
              `}
              style={{ minWidth: 56 }}
              aria-current={isSelected ? "date" : undefined}
            >
              <span className="font-semibold">{format(day, "dd")}</span>
              <span className="uppercase">{format(day, "EEE")}</span>
              {isToday && (
                <span className={`block w-1.5 h-1.5 rounded-full mt-0.5 ${isSelected ? "bg-white" : "bg-teal-400"}`}></span>
              )}
            </button>
          );
        })}
      </div>
      {/* Right Arrow */}
      <button
        className="rounded-full p-2 bg-white shadow hover:bg-teal-100 border border-gray-200 transition"
        onClick={scrollRight}
        aria-label="Scroll right"
        tabIndex={0}
      >
        <span className="text-lg text-teal-600">&#8594;</span>
      </button>
    </div>
  );
}
