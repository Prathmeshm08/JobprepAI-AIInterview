import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackgroundImage from "../components/BackgroundImage";
import Header from "../components/Header";

export default function InterviewSettingsPage() {
  const navigate = useNavigate();
  const [interviewType, setInterviewType] = useState("time"); // "time" or "questions"
  const [timeDuration, setTimeDuration] = useState(20); // 10-45 minutes
  const [questionCount, setQuestionCount] = useState(10); // 10-12 questions
  const [timePerQuestion, setTimePerQuestion] = useState(3); // 3-4 minutes

  const calculateEstimatedTime = () => {
    if (interviewType === "time") {
      return timeDuration;
    } else {
      return questionCount * timePerQuestion;
    }
  };

  const handleStartInterview = () => {
    const settings = {
      type: interviewType,
      duration: interviewType === "time" ? timeDuration : questionCount * timePerQuestion,
      questionCount: interviewType === "questions" ? questionCount : null,
      timePerQuestion: interviewType === "questions" ? timePerQuestion : null,
    };
    
    navigate("/upload", { state: { interviewSettings: settings } });
  };

  return (
    <>
      <BackgroundImage />
      <Header />
      <div className="relative z-10 min-h-screen flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-2xl bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-900 via-black to-black bg-clip-text text-transparent">
            Interview Settings
          </h1>

          {/* Interview Type Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Choose Interview Format</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setInterviewType("time")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  interviewType === "time"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 bg-white text-gray-700 hover:border-blue-300"
                }`}
              >
                <div className="text-lg font-semibold mb-2">⏱️ Time-based</div>
                <div className="text-sm">Set interview duration</div>
              </button>
              <button
                onClick={() => setInterviewType("questions")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  interviewType === "questions"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 bg-white text-gray-700 hover:border-blue-300"
                }`}
              >
                <div className="text-lg font-semibold mb-2">❓ Question-based</div>
                <div className="text-sm">Set number of questions</div>
              </button>
            </div>
          </div>

          {/* Time-based Settings */}
          {interviewType === "time" && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Interview Duration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration: {timeDuration} minutes
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="45"
                    value={timeDuration}
                    onChange={(e) => setTimeDuration(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>10 min</span>
                    <span>45 min</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Question-based Settings */}
          {interviewType === "questions" && (
            <div className="mb-8 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Number of Questions</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Questions: {questionCount}
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="12"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>10</span>
                    <span>12</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Time per Question</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time: {timePerQuestion} minutes per question
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="4"
                    value={timePerQuestion}
                    onChange={(e) => setTimePerQuestion(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>3 min</span>
                    <span>4 min</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Estimated Duration Display */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Estimated Interview Duration</h3>
            <p className="text-2xl font-bold text-blue-700">{calculateEstimatedTime()} minutes</p>
            <p className="text-sm text-blue-600 mt-1">
              {interviewType === "time" 
                ? "Fixed duration interview"
                : `${questionCount} questions × ${timePerQuestion} minutes each`
              }
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex-1 py-3 px-6 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all font-semibold"
            >
              Back to Dashboard
            </button>
            <button
              onClick={handleStartInterview}
              className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold"
            >
              Continue to Resume Upload
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 