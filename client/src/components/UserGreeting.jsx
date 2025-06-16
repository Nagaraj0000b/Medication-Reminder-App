export default function UserGreeting({ username }) {
  return (
    <div className="text-right">
      <div className="text-lg font-semibold text-gray-700">Hi, {username}!</div>
      <div className="text-sm text-gray-400">Welcome back 👋</div>
    </div>
  );
}
