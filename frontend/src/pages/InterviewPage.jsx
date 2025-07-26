import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import Agent from '../components/Agent';
import talkingAvatar from '../avatar.json';
import { auth, db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import MaleAvatar from '../assets/Male.avif';
import FemaleAvatar from '../assets/Female.jpg';

export default function InterviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    userName = 'Candidate',
    userId = 'unknown',
    questions = [],
    gender = 'male',
    interviewSettings = {},
  } = location.state || {};

  // Choose avatar based on gender
  const userAvatar = gender === 'female' ? FemaleAvatar : MaleAvatar;

  // Placeholder: Replace with real AI evaluation logic later
  const handleInterviewEnd = async (transcript) => {
    // Placeholder: Replace with real transcript and resumeUrl
    console.log('Interview ended with transcript:', transcript);
    const transcriptText = transcript.length > 0 
      ? transcript.map(msg => `${msg.role}: ${msg.content}`).join('\n\n')
      : 'No transcript available.';
    console.log('Formatted transcript text:', transcriptText);
    const resumeUrl = '';
    // Call backend API for AI evaluation
    let aiResult = {
      overallScore: 0,
      communicationScore: 0,
      clarityScore: 0,
      suggestions: [],
    };
    try {
      const response = await fetch('http://localhost:5000/ai-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: transcriptText, resumeUrl }),
      });
      aiResult = await response.json();
    } catch (e) {
      // fallback if backend is not available
      aiResult = {
        overallScore: 7,
        communicationScore: 8,
        clarityScore: 6,
        suggestions: [
          'Be more concise in your answers.',
          'Improve technical depth.',
          'Practice speaking with more confidence.'
        ],
      };
    }
    // Store feedback in Firestore
    const user = auth.currentUser;
    if (user) {
      const feedbackRef = collection(db, 'users', user.uid, 'feedback');
      await addDoc(feedbackRef, {
        ...aiResult,
        resumeUrl,
        transcript: transcriptText,
        createdAt: serverTimestamp(),
      });
    }
    // Redirect to feedback page
    navigate('/feedback', {
      state: {
        ...aiResult,
        resumeUrl,
        transcript: transcriptText,
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black text-white p-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          🎤 AI Interview Session
        </h1>
        <p className="text-lg text-gray-300">
          Ready to showcase your skills with {userName}?
        </p>
      </motion.div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[70vh]">
          
          {/* User Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-indigo-300 mb-2">You</h2>
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-1">
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="w-full h-full rounded-full object-cover border-4 border-white/20"
                  />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mt-2">{userName}</h3>
              <p className="text-gray-400 text-sm">Ready for interview</p>
            </div>

            {/* User Status */}
            <div className="bg-white/5 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Status:</span>
                <span className="text-green-400 font-semibold">● Active</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-gray-300">Microphone:</span>
                <span className="text-blue-400 font-semibold">● Connected</span>
              </div>
            </div>

          </motion.div>

          {/* AI Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-purple-300 mb-2">🤖 AI Interviewer</h2>
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 p-1">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <div className="w-24 h-24">
                      <Lottie animationData={talkingAvatar} loop={true} />
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-500 rounded-full border-4 border-slate-900 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mt-4">AI Assistant</h3>
              <p className="text-gray-400 text-sm">Ready to conduct interview</p>
            </div>

            {/* AI Status */}
            <div className="bg-white/5 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Status:</span>
                <span className="text-purple-400 font-semibold">● Active</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-gray-300">Voice:</span>
                <span className="text-pink-400 font-semibold">● Connected</span>
              </div>
            </div>

          </motion.div>
        </div>

        {/* Interview Controls */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl"
        >
          <Agent
            userName={userName}
            userId={userId}
            questions={questions}
            onInterviewEnd={handleInterviewEnd}
            interviewSettings={interviewSettings}
          />
        </motion.div>
      </div>
    </div>
  );
}
