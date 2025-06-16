import { FaRegCheckCircle } from "react-icons/fa";

export default function FeaturesSection() {
  return (
    <section className="px-10 py-12 grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-gray-100">
      <div className="flex items-start gap-4">
        <span className="text-2xl mt-1 text-emerald-600"><FaRegCheckCircle /></span>
        <div>
          <h3 className="font-bold text-lg text-gray-900">Sustainable Health</h3>
          <p className="text-gray-600">Medication reminders and tracking for everyone, accessible and reliable.</p>
        </div>
      </div>
      <div className="flex items-start gap-4">
        <span className="text-2xl mt-1 text-emerald-600"><FaRegCheckCircle /></span>
        <div>
          <h3 className="font-bold text-lg text-gray-900">Advanced Technology</h3>
          <p className="text-gray-600">Smart notifications, adherence tracking, and easy management for maximum efficiency.</p>
        </div>
      </div>
    </section>
  );
}
