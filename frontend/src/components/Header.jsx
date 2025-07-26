// src/components/Header.jsx
import React from "react";
import { motion } from "framer-motion";
import logo from "../assets/logo.png"; // ✅ make sure the path is correct
import { Link } from "react-router-dom";

export default function Header() {

  return (
    <motion.header
      className="flex justify-between items-center p-4 sm:p-6 sticky top-0 z-50 shadow-sm"

      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center space-x-3">
        <img src={logo} alt="JobPrep AI Logo" className="w-10 h-10 rounded-full shadow-md" />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-white to-blue-500 bg-clip-text text-transparent">
  JobPrep AI
</h1>
      </div>
      <div>
        <Link to="/profile" className="text-white text-2xl hover:underline hover:text-pink-200 transition-all" title="Profile">👤</Link>
      </div>
    </motion.header>
  );
}
