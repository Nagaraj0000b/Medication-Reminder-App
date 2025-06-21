import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import Dashboard from "./DashBoard/Dashboard";
import MedicationsPage from "./pages/MedicationsPage";
import RemindersPage from "./pages/RemindersPage";
import Contact from "./pages/Contact";  
import About from "./pages/About";
import Features from "./pages/Features";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/home" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Nested Routes for Medications and Reminders */}
        <Route path="/medications" element={<MedicationsPage />} />
        <Route path="/medications/:id" element={<MedicationsPage />} />
        <Route path="/medications/new" element={<MedicationsPage />} />
        <Route path="/reminders" element={<RemindersPage />} />
        <Route path="/reminders/:id" element={<RemindersPage />} />
        <Route path="/reminders/new" element={<RemindersPage />} />
      </Routes>
    </Router>
  );
}

export default App;
