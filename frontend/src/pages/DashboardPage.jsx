// src/pages/DashboardPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import BackgroundImage from "../components/BackgroundImage";

const companies = [
  { name: "Google", file: "/pdfs/Google.csv" },
  { name: "Amazon", file: "/pdfs/Amazon.csv" },
  { name: "Microsoft", file: "/pdfs/Microsoft.csv" },
  { name: "Capgemini", file: "/pdfs/Capgemini.csv" },
  { name: "Accenture", file: "/pdfs/Accenture.csv" },
  { name: "Walmart", file: "/pdfs/Walmart.csv" },
  { name: "Paypal", file: "/pdfs/Paypal.csv" },
  { name: "Wipro", file: "/pdfs/Wipro.csv" },
  { name: "IBM", file: "/pdfs/IBM.csv" },
  { name: "Juspay", file: "/pdfs/Juspay.csv" },
  { name: "Cognizant", file: "/pdfs/Cognizant.csv" },
  { name: "Infosys", file: "/pdfs/Infosys.csv" },
];

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <>
      <BackgroundImage />
      <Header />
      <div className="relative z-10 min-h-screen text-white px-4 py-10 flex flex-col items-center">
        <div className="bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-700 px-6 sm:px-12 py-10 sm:py-12 rounded-3xl shadow-2xl w-full max-w-6xl text-center mb-14 border-4 border-white hover:shadow-pink-500/40 transition-all">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 sm:mb-8 tracking-wide drop-shadow-md">
            Kickstart Your Personalized AI Interview Journey
          </h1>
          <button
            onClick={() => navigate("/interview-settings")}
            className="px-8 sm:px-10 py-3 sm:py-4 bg-white text-indigo-700 font-semibold rounded-full hover:scale-105 hover:bg-indigo-100 transition-all shadow-xl text-base sm:text-lg"
          >
            🎯 Begin the Interview
          </button>
        </div>

        <div className="w-full max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-10 text-center underline decoration-pink-400 drop-shadow-sm">
            Explore Our Job Preparation Toolkit
          </h2>

          {/* Companywise Interview Questions */}
          <div className="mb-20">
            <h3 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8 text-center text-white">
              Master Coding at Top Companies
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 sm:gap-8 px-2 sm:px-4">
              {companies.map((company, idx) => (
                <a
                  key={idx}
                  href={company.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-indigo-700 rounded-xl p-4 sm:p-6 shadow-lg hover:scale-105 hover:bg-indigo-100 text-center font-semibold text-sm sm:text-lg transition-transform border border-indigo-300 hover:border-indigo-500"
                >
                  {company.name}
                </a>
              ))}
            </div>
          </div>

          {/* Practice Coding Questions */}
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-white">
            Get everything you need to crack your dream job!!
            </h3>
            <a
              href="/pdfs/Placement Material.zip"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 sm:px-10 py-3 rounded-full hover:scale-105 hover:from-green-400 hover:to-emerald-500 transition-all shadow-lg text-base sm:text-lg"
            >
              📥 Get Job-Ready Now
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
