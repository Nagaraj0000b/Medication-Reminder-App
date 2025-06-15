import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <Router>
      <div className="h-screen w-full bg-gradient-to-r from-pink-400 to-yellow-400 flex flex-col">
        <Navbar />
        {/* other components */}
      </div>
    </Router>
  );
}