import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BackgroundImage from "../components/BackgroundImage";

export default function FeedbackPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    overallScore = 0,
    communicationScore = 0,
    clarityScore = 0,
    suggestions = [],
    transcript = "",
    strengths = [],
    analysis = "",
  } = location.state || {};

  return (
    <>
      <BackgroundImage />
      {/* Top bar with Back and Profile */}
      <div className="flex justify-between items-center px-6 pt-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-white/80 text-indigo-700 px-4 py-2 rounded-full shadow hover:bg-white font-semibold"
        >
          ← Back
        </button>
        <button
          onClick={() => navigate("/profile")}
          className="bg-white/80 text-indigo-700 px-4 py-2 rounded-full shadow hover:bg-white font-semibold"
        >
          👤 Profile
        </button>
      </div>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 pb-10">
        <div className="w-full max-w-3xl bg-white/90 rounded-2xl shadow-2xl p-8 mt-6">
          {/* Scores Row */}
          <div className="flex flex-col sm:flex-row justify-between gap-6 mb-8">
            <div className="flex-1 bg-gradient-to-br from-indigo-500 to-blue-400 rounded-xl shadow p-6 text-center text-white">
              <div className="text-3xl font-extrabold mb-2">{overallScore}/10</div>
              <div className="text-lg font-semibold">Overall Interview Rating</div>
            </div>
            <div className="flex-1 bg-gradient-to-br from-purple-500 to-pink-400 rounded-xl shadow p-6 text-center text-white">
              <div className="text-3xl font-extrabold mb-2">{communicationScore}/10</div>
              <div className="text-lg font-semibold">Communication</div>
            </div>
            <div className="flex-1 bg-gradient-to-br from-green-500 to-emerald-400 rounded-xl shadow p-6 text-center text-white">
              <div className="text-3xl font-extrabold mb-2">{clarityScore}/10</div>
              <div className="text-lg font-semibold">Clarity</div>
            </div>
          </div>
          {/* Analysis */}
          {analysis && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-2 text-indigo-800">Interview Analysis</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-900 shadow-inner">
                <p className="text-sm leading-relaxed">{analysis}</p>
              </div>
            </div>
          )}
          {/* Strengths */}
          {strengths && strengths.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-2 text-green-800">Your Strengths</h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-900 shadow-inner">
                <ul className="list-disc list-inside space-y-1">
                  {strengths.map((strength, index) => (
                    <li key={index} className="text-sm leading-relaxed">{strength}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {/* Suggestions Box */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-2 text-indigo-800">Suggestions</h2>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 min-h-[80px] text-gray-800 shadow-inner">
              {suggestions.length > 0 ? (
                <ul className="list-disc list-inside space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm leading-relaxed">
                      {suggestion}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No suggestions available.</p>
              )}
            </div>
          </div>
          {/* Transcript Box */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-2 text-indigo-800">Interview Transcript</h2>
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 min-h-[100px] text-gray-700 shadow-inner max-h-60 overflow-y-auto">
              {transcript ? (
                <div className="space-y-3">
                  {transcript.split('\n\n').map((message, index) => {
                    const [role, ...contentParts] = message.split(': ');
                    const content = contentParts.join(': ');
                    return (
                      <div key={index} className={`p-2 rounded ${
                        role?.toLowerCase().includes('assistant') 
                          ? 'bg-blue-50 border-l-4 border-blue-400' 
                          : 'bg-green-50 border-l-4 border-green-400'
                      }`}>
                        <div className="font-semibold text-sm text-gray-600 mb-1">
                          {role || 'Unknown'}
                        </div>
                        <div className="text-sm leading-relaxed">
                          {content || 'No content'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500">No transcript available.</p>
              )}
            </div>
          </div>
          {/* Back to Dashboard Button */}
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-indigo-700 transition shadow-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </>
  );
} 