import React, { useState } from 'react';
import axios from 'axios';

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [score, setScore] = useState(null);
  const [question, setQuestion] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await axios.post('http://127.0.0.1:5000/upload', formData);
      setScore(res.data.score);
      setQuestion(res.data.question);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload resume');
    }
  };

  return (
    <div className="p-10 text-center space-y-4">
      <h1 className="text-2xl font-bold text-blue-600">🎯 Resume Voice Interview</h1>
      <input type="file" accept=".docx" onChange={handleFileChange} className="mb-2" />
      <button
        onClick={handleUpload}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Upload Resume
      </button>
      {score !== null && (
        <div className="mt-4 text-lg">
          <p>✅ Score: <strong>{score}%</strong></p>
          <p>🎤 Question: {question}</p>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
