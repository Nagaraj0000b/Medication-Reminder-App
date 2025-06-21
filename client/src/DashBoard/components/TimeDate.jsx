import { useEffect, useState } from "react";

export default function TimeDate() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="text-right">
      <div className="text-lg font-medium text-gray-700">
        {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </div>
      <div className="text-sm text-gray-500">
        {now.toLocaleDateString(undefined, { weekday: "short", month: "long", day: "numeric", year: "numeric" })}
      </div>
    </div>
  );
}
