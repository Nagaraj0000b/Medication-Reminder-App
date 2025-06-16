import { useNavigate } from "react-router-dom";

export default function BackButton({ className = "" }) {
  const navigate = useNavigate();
  return (
    <button
      className={`mb-6 text-teal-600 hover:text-teal-700 font-semibold ${className}`}
      onClick={() => navigate(-1)}
    >
      ← Back
    </button>
  );
}
