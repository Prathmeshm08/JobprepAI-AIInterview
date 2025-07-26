import React from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";

import logo from "../assets/logo.png";
import BackgroundImage from "../components/BackgroundImage";


export default function WelcomePage() {
  const [darkMode, setDarkMode] = React.useState(false);

  return (
    <>
      <BackgroundImage />

      <div className={`${darkMode ? "text-white" : "text-gray-900"} relative z-10 min-h-screen flex flex-col justify-between transition-colors duration-500`}>

        {/* Header with logo and title */}
        <header className="flex justify-between items-center p-6">
          <motion.div
            className="flex items-center space-x-3"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <img src={logo} alt="JobPrep AI Logo" className="w-10 h-10 rounded-full shadow-md" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-white to-blue-500 bg-clip-text text-transparent">
  JobPrep AI
</h1>

          </motion.div>

          <motion.button
            onClick={() => setDarkMode(!darkMode)}
            whileHover={{ rotate: 90 }}
            className="p-2 transition-transform"
          >
            {darkMode ? <Sun /> : <Moon />}
          </motion.button>
        </header>

        {/* Main Content */}
        <main className="flex flex-col items-center justify-center flex-grow text-center px-4">
          <motion.h2
            className={`text-4xl font-extrabold mb-4 ${
              darkMode
                ? "bg-gradient-to-r from-pink-400 via-white to-blue-500 bg-clip-text text-transparent"
                : "text-white"
            }`}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Your Smartest Step Toward Success!!
          </motion.h2>

          <motion.p
            className="mb-8 text-lg text-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            AI Feedback, Voice Practice, and Career Confidence!
          </motion.p>

          {/* Get Started Button (to Login Page) */}
          <Link to="/login">
            <motion.button
              className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
              whileHover={{ scale: 1.1 }}
            >
              Get Started
            </motion.button>
          </Link>
        </main>

        {/* Footer */}
        <motion.footer
          className="text-center py-4 text-sm text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          © 2025 JobPrep AI. All Rights Reserved.
        </motion.footer>
      </div>
    </>
  );
}
