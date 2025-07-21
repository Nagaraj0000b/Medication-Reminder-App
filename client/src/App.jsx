import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import Dashboard from './DashBoard/Dashboard';
import MedicationsPage from './pages/MedicationsPage';
import MedicationForm from './DashBoard/components/MedicationForm';
import RemindersPage from './pages/RemindersPage';
import ReminderEditPage from './DashBoard/components/ReminderEditPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/medications" element={<MedicationsPage />} />
          <Route path="/medications/new" element={<MedicationForm />} />
          <Route path="/medications/edit/:id" element={<MedicationForm />} />
          <Route path="/medications/:id" element={<MedicationForm />} />
          <Route path="/reminders" element={<RemindersPage />} />
          <Route path="/reminders/new" element={<RemindersPage />} />
          <Route path="/reminders/edit/:id" element={<ReminderEditPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
