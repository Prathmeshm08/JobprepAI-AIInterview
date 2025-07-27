import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider, appleProvider } from "../firebase";
import BackgroundImage from "../components/BackgroundImage";
import Header from "../components/Header";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccessMsg("Login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      setErrorMsg(error.message || "Login failed");
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setSuccessMsg("Google login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      setErrorMsg("Google login failed. Please try again.");
    }
  };

  const handleAppleLogin = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const result = await signInWithPopup(auth, appleProvider);
      const user = result.user;
      setSuccessMsg("Apple login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      setErrorMsg("Apple login failed. Please try again.");
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
            Login to Your Account
          </h2>
          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errorMsg && <p className="text-red-500 text-sm text-center">{errorMsg}</p>}
            {successMsg && <p className="text-green-600 text-sm text-center">{successMsg}</p>}
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-md"
            >
              Login
            </button>
          </form>
          {/* Google Login */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full mt-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 flex items-center justify-center gap-2 shadow-sm"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Sign in with Google
            </button>
          </div>
          {/* Apple Login */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleAppleLogin}
              className="w-full mt-3 py-2 bg-black text-white rounded-lg hover:bg-gray-900 flex items-center justify-center gap-2 shadow-sm"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                alt="Apple"
                className="w-5 h-5 invert"
              />
              Sign in with Apple
            </button>
          </div>
          <p className="mt-6 text-center text-sm">
            Don’t have an account?{" "}
            <a href="/register" className="underline text-blue-500 hover:text-blue-700">
              Register here
            </a>
          </p>
        </motion.div>
      </div>
    </>
  );
}
