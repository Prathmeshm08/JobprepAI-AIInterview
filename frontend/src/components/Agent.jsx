import { useState, useEffect } from "react";
import Vapi from "@vapi-ai/web";

const vapi = new Vapi("858bab47-0f0c-4938-bb88-bdc11bec123e"); // Replace with your actual Vapi Web token

const CallStatus = {
  INACTIVE: "INACTIVE",
  CONNECTING: "CONNECTING",
  ACTIVE: "ACTIVE",
  FINISHED: "FINISHED",
};

const Agent = ({
  userName,
  userId,
  questions,
  onInterviewEnd,
  interviewSettings = {},
}) => {
  const [callStatus, setCallStatus] = useState(CallStatus.INACTIVE);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [transcript, setTranscript] = useState([]);

  // Extract settings
  const { type, duration, questionCount: maxQuestions, timePerQuestion } = interviewSettings;

  // Auto-terminate based on configuration
  useEffect(() => {
    if (callStatus === CallStatus.ACTIVE && startTime) {
      const timer = setInterval(() => {
        const currentTime = Date.now();
        const elapsed = Math.floor((currentTime - startTime) / 1000 / 60); // minutes
        setElapsedTime(elapsed);

        // Check time-based termination
        if (type === "time" && elapsed >= duration) {
          console.log("Time limit reached, ending interview");
          handleDisconnect();
        }

        // Check question-based termination
        if (type === "questions" && questionCount >= maxQuestions) {
          console.log("Question limit reached, ending interview");
          handleDisconnect();
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [callStatus, startTime, type, duration, maxQuestions, questionCount]);

  // Track questions (simplified - you might want to implement actual question detection)
  useEffect(() => {
    if (callStatus === CallStatus.ACTIVE) {
      const questionTimer = setInterval(() => {
        // Increment question count every 3-4 minutes (simplified)
        const timePerQ = timePerQuestion || 3;
        const newQuestionCount = Math.floor(elapsedTime / timePerQ);
        if (newQuestionCount > questionCount) {
          setQuestionCount(newQuestionCount);
        }
      }, 30000); // Check every 30 seconds

      return () => clearInterval(questionTimer);
    }
  }, [callStatus, elapsedTime, questionCount, timePerQuestion]);

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
      setStartTime(Date.now());
      setElapsedTime(0);
      setQuestionCount(0);
      setTranscript([]);
    };
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);
    const onMessage = (message) => {
      // Store all transcript messages
      console.log('Vapi message received:', message);
      
      // Handle different message formats from Vapi
      if (message.type === 'transcript' || message.type === 'message') {
        const role = message.role || (message.speaker === 'user' ? 'user' : 'assistant');
        const content = message.content || message.text || message.transcript || '';
        
        if (content.trim()) {
          setTranscript(prev => [...prev, {
            role: role,
            content: content.trim(),
            timestamp: new Date().toLocaleTimeString()
          }]);
        }
      }
      
      // Also capture any other message types that might contain conversation
      if (message.transcript || message.text) {
        const content = message.transcript || message.text;
        if (content && content.trim()) {
          setTranscript(prev => [...prev, {
            role: message.role || 'assistant',
            content: content.trim(),
            timestamp: new Date().toLocaleTimeString()
          }]);
        }
      }
    };
    const onError = (error) => console.log("Error:", error);
    const onTranscript = (transcriptData) => {
      console.log('Transcript event received:', transcriptData);
      if (transcriptData && transcriptData.text) {
        setTranscript(prev => [...prev, {
          role: 'assistant',
          content: transcriptData.text.trim(),
          timestamp: new Date().toLocaleTimeString()
        }]);
      }
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("transcript", onTranscript);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("transcript", onTranscript);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (callStatus === CallStatus.FINISHED && typeof onInterviewEnd === "function") {
      onInterviewEnd(transcript);
    }
  }, [callStatus, onInterviewEnd, transcript]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);
    let formattedQuestions = "";
    if (questions) {
      formattedQuestions = questions.map((q) => `- ${q}`).join("\n");
    }
    await vapi.start("bdc8010d-4c7c-4507-9726-1111e743b04d", {
      variableValues: {
        questions: formattedQuestions,
        username: userName,
        userid: userId,
        interviewDuration: duration,
        maxQuestions: maxQuestions,
      },
    });
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    // Try to get final transcript from Vapi
    try {
      const finalTranscript = vapi.getTranscript();
      if (finalTranscript && finalTranscript.length > 0) {
        console.log('Final transcript from Vapi:', finalTranscript);
        // Add any remaining transcript data
        finalTranscript.forEach(item => {
          if (item.text && item.text.trim()) {
            setTranscript(prev => [...prev, {
              role: item.speaker || 'assistant',
              content: item.text.trim(),
              timestamp: new Date().toLocaleTimeString()
            }]);
          }
        });
      }
    } catch (error) {
      console.log('Could not get final transcript:', error);
    }
    vapi.stop();
  };

  // Calculate progress
  const getProgress = () => {
    if (type === "time") {
      return Math.min((elapsedTime / duration) * 100, 100);
    } else if (type === "questions") {
      return Math.min((questionCount / maxQuestions) * 100, 100);
    }
    return 0;
  };

  // Get remaining time/questions
  const getRemaining = () => {
    if (type === "time") {
      return Math.max(duration - elapsedTime, 0);
    } else if (type === "questions") {
      return Math.max(maxQuestions - questionCount, 0);
    }
    return 0;
  };

  // Only show the button if interview is not started
  if (callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED) {
    return (
      <div className="w-full flex justify-center items-center min-h-[200px]">
        <button
          className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-lg font-semibold shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
          onClick={handleCall}
          disabled={callStatus === CallStatus.CONNECTING}
        >
          🎤 Start Interview
        </button>
      </div>
    );
  }

  // Show the rest of the interface only when interview is active or connecting
  return (
    <div className="w-full">
      {/* Status Bar */}
      <div className="flex items-center justify-between mb-6 p-4 bg-white/5 rounded-xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${callStatus === CallStatus.ACTIVE ? 'bg-green-500 animate-pulse' : callStatus === CallStatus.CONNECTING ? 'bg-yellow-500 animate-pulse' : 'bg-gray-500'}`}></div>
            <span className="text-sm text-gray-300">
              {callStatus === CallStatus.ACTIVE ? 'Interview Active' : 
               callStatus === CallStatus.CONNECTING ? 'Connecting...' : 
               callStatus === CallStatus.FINISHED ? 'Interview Ended' : 'Ready to Start'}
            </span>
          </div>
         {/* Progress Indicator */}
         {callStatus === CallStatus.ACTIVE && (
           <div className="flex items-center gap-4">
             <div className="text-sm text-gray-300">
               {type === "time" ? (
                 <>
                   <span>Time: {elapsedTime}/{duration} min</span>
                   <span className="ml-2">({getRemaining()} min left)</span>
                 </>
               ) : (
                 <>
                   <span>Questions: {questionCount}/{maxQuestions}</span>
                   <span className="ml-2">({getRemaining()} left)</span>
                 </>
               )}
             </div>
             <div className="w-32 bg-gray-700 rounded-full h-2">
               <div 
                 className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                 style={{ width: `${getProgress()}%` }}
               ></div>
             </div>
           </div>
         )}
        </div>
        <div className="flex gap-3">
          {(callStatus === CallStatus.ACTIVE || callStatus === CallStatus.CONNECTING) && (
            <button
              className="px-6 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg font-semibold shadow-lg hover:from-red-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105"
              onClick={handleDisconnect}
            >
              🛑 End Interview
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Agent; 