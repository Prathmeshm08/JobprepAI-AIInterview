// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import ResumeUploadPage from './pages/ResumeUploadPage';
import LoginPage from './pages/LoginPage'; 
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import InterviewPage from './pages/InterviewPage';
import ProfilePage from "./pages/ProfilePage";
import PrivateRoute from './components/PrivateRoute'; // <-- Add this import
import FeedbackPage from "./pages/FeedbackPage";
import InterviewSettingsPage from "./pages/InterviewSettingsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Protected routes */}
        
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <PrivateRoute>
              <ResumeUploadPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/interview"
          element={
            <PrivateRoute>
              <InterviewPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/interview-settings"
          element={
            <PrivateRoute>
              <InterviewSettingsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/feedback"
          element={<FeedbackPage />}
        />
        {/* <Route path="/voice-interview" element={<VoiceInterview />} /> */}
      </Routes>
    </Router>
  );
}

export default App;