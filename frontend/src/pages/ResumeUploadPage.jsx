import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import talkingAvatar from '../avatar.json';
import BackgroundImage from '../components/BackgroundImage';
import Header from '../components/Header';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ResumeUploadPage() {
  const [resume, setResume] = useState(null);
  const [score, setScore] = useState(null);
  const [message, setMessage] = useState('');
  const [extractedData, setExtractedData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleUpload = async () => {
    if (!resume) return alert('Please choose a resume file first.');

    const formData = new FormData();
    formData.append('resume', resume);
    // Optionally add user info here if available
    // formData.append('userId', userId);
    // formData.append('userName', userName);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      const skills = data.skills || [];
      const projects = data.projects || [];
      const certifications = data.certifications || [];
      const text = data.text || '';
      const questions = data.questions || [];
      const vapi = data.vapi || null;

      setScore(data.score);

      if (data.score < 60) {
        setMessage('⚠️ Your resume needs improvement. Try enhancing your skills and formatting.');
      } else {
        setMessage("🎉 Great! You're ready to start the AI interview.");
      }

      setExtractedData({ skills, projects, certifications, text, questions, vapi });
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    }
  };

  const handleStartInterview = () => {
    if (score >= 60 && extractedData) {
      const interviewSettings = location?.state?.interviewSettings || {};
      navigate('/interview', { 
        state: { 
          ...extractedData,
          interviewSettings
        }
      });
    }
  };

  return (
    <>
      <BackgroundImage />
      <Header />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 text-white">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-indigo-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            🚀 Resume Voice Interview
          </h1>
          <p className="text-lg text-gray-100">
            Upload your resume and begin your AI-powered voice interview journey.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex flex-col items-center space-y-4 w-full max-w-md bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-2xl"
        >
          <input
            type="file"
            onChange={(e) => setResume(e.target.files[0])}
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none"
          />

          <button
            onClick={handleUpload}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-md shadow-md font-semibold hover:scale-105 transition"
          >
            📤 Upload Resume
          </button>

          {score !== null && (
            <div className="w-full bg-white text-gray-800 p-4 rounded shadow text-left space-y-2 mt-4">
              <p className="text-lg font-semibold">
                ✅ ATS Score: <span className="text-indigo-700 font-bold">{score}%</span>
              </p>
              <p>{message}</p>

              {score >= 60 && (
                <button
                  onClick={handleStartInterview}
                  className="mt-4 w-full bg-green-600 text-white px-6 py-2 rounded-md shadow-md font-semibold hover:scale-105 transition"
                >
                  🎤 Start AI Interview
                </button>
              )}
            </div>
          )}

          <div className="w-64 mt-8">
            <Lottie animationData={talkingAvatar} loop={true} />
          </div>
        </motion.div>
      </div>
    </>
  );
}
