export default function UserGreeting({ username }) {
  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }
  return (
    <div className="text-2xl font-semibold text-gray-800">
      {getGreeting()}, <span className="text-teal-600">{username}</span>
    </div>
  );
}
