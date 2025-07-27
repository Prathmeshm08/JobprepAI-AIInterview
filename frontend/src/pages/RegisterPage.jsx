import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import BackgroundImage from "../components/BackgroundImage";
import { motion } from "framer-motion";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccessMsg("Registered successfully! Redirecting to login...");
      setTimeout(() => {
        setSuccessMsg("");
        navigate("/login");
      }, 1500);
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <>
      <BackgroundImage />
      <Header />
      <div className="relative z-10 min-h-screen flex flex-col justify-center items-center text-gray-900 px-4">
        <motion.div
          className="w-full max-w-md bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-blue-900 via-black to-black bg-clip-text text-transparent">
            Register to JobPrep AI
          </h2>
          <form onSubmit={handleRegister} className="space-y-6">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="string"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
            />
            {errorMsg && <p className="text-red-600 text-sm text-center">{errorMsg}</p>}
            {successMsg && <p className="text-green-600 text-sm text-center">{successMsg}</p>}
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow-md"
            >
              Register
            </button>
            <p className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 underline hover:text-blue-700">
                Login here
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </>
  );
}
