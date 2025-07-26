// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, collection, getDocs, orderBy, query } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { motion } from "framer-motion";
import BackgroundImage from "../components/BackgroundImage";
import MaleAvatar from "../assets/Male.avif";
import FemaleAvatar from "../assets/Female.jpg";

export default function ProfilePage() {
  const navigate = useNavigate();
  const currentUser = auth.currentUser;
  const uid = currentUser?.uid;

  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "",
    email: currentUser?.email || "",
    bio: "",
    skills: "", // comma‑separated input, stored as array
    gender: "male", // default gender
  });
  const [feedbackHistory, setFeedbackHistory] = useState([]);

  const MALE_AVATAR = MaleAvatar;
  const FEMALE_AVATAR = FemaleAvatar;

  /* ───────────────────────── LOAD USER PROFILE ───────────────────────── */
  useEffect(() => {
    if (!uid) return;

    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile({ ...profile, ...docSnap.data() });
        } else {
          // first‑time user → create empty profile document
          await setDoc(docRef, {
            email: currentUser.email,
            createdAt: serverTimestamp(),
          });
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchFeedbackHistory = async () => {
      try {
        const feedbackRef = collection(db, "users", uid, "feedback");
        const q = query(feedbackRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        setFeedbackHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Failed to load feedback history", err);
      }
    };

    fetchProfile();
    fetchFeedbackHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  /* ───────────────────────── FORM HANDLERS ───────────────────────── */
  const handleChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // Set avatar based on gender
      const avatarUrl = profile.gender === "female" ? FEMALE_AVATAR : MALE_AVATAR;
      const docRef = doc(db, "users", uid);
      await updateDoc(docRef, {
        ...profile,
        avatar: avatarUrl,
        skills: profile.skills
          .split(/,|\n/) // allow comma or newline
          .map((s) => s.trim())
          .filter(Boolean),
        updatedAt: serverTimestamp(),
      });
      setProfile((prev) => ({ ...prev, avatar: avatarUrl }));
      setEditMode(false);
    } catch (err) {
      console.error("Failed to save profile", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  if (!uid) {
    return (
      <div className="h-screen flex items-center justify-center text-xl">
        Please log in to view your profile.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl">
        Loading profile...
      </div>
    );
  }

  /* ───────────────────────── UI ───────────────────────── */
  return (
    <>
      <BackgroundImage />
      <button
        onClick={() => navigate('/dashboard')}
        className="absolute top-6 left-6 bg-white/80 text-indigo-700 px-4 py-2 rounded-full shadow hover:bg-white font-semibold z-20"
      >
        ← Back
      </button>
      <div className="flex justify-center mt-10 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 shadow-xl text-white relative"
        >
          {/* Header buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => setEditMode(!editMode)}
              className="bg-white text-black text-sm px-4 py-1 rounded hover:scale-105 transition"
            >
              {editMode ? "Cancel" : "Edit Profile"}
            </button>
            <button
              onClick={handleLogout}
              className="bg-transparent text-red-300 border border-red-300 text-sm px-4 py-1 rounded hover:bg-red-500 hover:text-white transition"
            >
              Logout
            </button>
          </div>

          {/* Profile header */}
          <div className="flex items-center gap-4 mt-10">
            <div className="relative group">
              <img
                src={profile.gender === "female" ? FEMALE_AVATAR : MALE_AVATAR}
                alt="User Avatar"
                className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
              />
            </div>

            <div>
              {editMode ? (
                <input
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleChange}
                  className="bg-transparent border-b border-white/50 py-1 text-xl font-bold placeholder-white/60 focus:outline-none"
                  placeholder="Full Name"
                />
              ) : (
                <h2 className="text-2xl font-bold min-h-[2.5rem]">
                  {profile.fullName || "Full Name"}
                </h2>
              )}
              <p className="text-sm text-white/80">{profile.email}</p>
              {editMode && (
                <div className="mt-2">
                  <label className="mr-4">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={profile.gender === "male"}
                      onChange={handleChange}
                      className="mr-1"
                    />
                    Male
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={profile.gender === "female"}
                      onChange={handleChange}
                      className="mr-1"
                    />
                    Female
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* About */}
          <div className="mt-6 space-y-4">
            {/* Bio */}
            <Section title="About" editMode={editMode}>
              {editMode ? (
                <textarea
                  name="bio"
                  rows={3}
                  className="mt-2 w-full bg-black/30 border border-white/30 p-2 rounded text-white"
                  value={profile.bio}
                  onChange={handleChange}
                />
              ) : (
                <p className="text-sm mt-2 min-h-[3rem]">
                  {profile.bio || "No bio added yet"}
                </p>
              )}
            </Section>

            {/* Location */}
            <Section title="Location" editMode={editMode}>
              {editMode ? (
                <input
                  name="location"
                  className="mt-2 w-full bg-black/30 border border-white/30 p-2 rounded text-white"
                  value={profile.location}
                  onChange={handleChange}
                />
              ) : (
                <p className="text-sm mt-2 min-h-[1.5rem]">
                  {profile.location || "No location added yet"}
                </p>
              )}
            </Section>

            {/* Skills */}
            <Section title="Skills" editMode={editMode}>
              {editMode ? (
                <textarea
                  name="skills"
                  rows={2}
                  className="mt-2 w-full bg-black/30 p-2 rounded text-white"
                  value={profile.skills}
                  onChange={handleChange}
                  placeholder="e.g. Python, ML, React"
                />
              ) : (
                <p className="text-sm mt-2 min-h-[1.5rem]">
                  {Array.isArray(profile.skills)
                    ? profile.skills.join(", ")
                    : profile.skills || "No skills added yet"}
                </p>
              )}
            </Section>

            {/* Save button */}
            {editMode && (
              <button
                onClick={handleSave}
                className="mt-4 w-full bg-white text-black font-semibold py-2 rounded hover:scale-105 transition"
              >
                Save Profile
              </button>
            )}
            {/* Feedback History Section */}
            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-4 text-white">Feedback History</h2>
              {feedbackHistory.length === 0 ? (
                <p className="text-white/80">No feedback history yet.</p>
              ) : (
                <div className="space-y-4">
                  {feedbackHistory.map((fb, idx) => (
                    <details key={fb.id} className="bg-white/10 rounded-xl p-4">
                      <summary className="cursor-pointer font-semibold text-lg text-indigo-200 flex items-center justify-between">
                        <span>Interview on {fb.createdAt?.toDate ? fb.createdAt.toDate().toLocaleString() : 'Unknown date'}</span>
                        <span className="ml-4 text-indigo-400">Score: {fb.overallScore}/10</span>
                      </summary>
                      <div className="mt-2 text-white/90">
                        <div>Communication: <span className="font-bold">{fb.communicationScore}/10</span></div>
                        <div>Clarity: <span className="font-bold">{fb.clarityScore}/10</span></div>
                        <div className="mt-2">
                          <span className="font-semibold">Suggestions:</span>
                          <ul className="list-disc list-inside ml-4">
                            {Array.isArray(fb.suggestions) ? fb.suggestions.map((s, i) => <li key={i}>{s}</li>) : <li>{fb.suggestions}</li>}
                          </ul>
                        </div>
                        {fb.resumeUrl && (
                          <div className="mt-2">
                            <a href={fb.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-300 underline">View Resume</a>
                          </div>
                        )}
                        {fb.transcript && (
                          <div className="mt-2">
                            <span className="font-semibold">Transcript:</span>
                            <div className="bg-white/20 rounded p-2 text-xs max-h-32 overflow-y-auto whitespace-pre-line mt-1">{fb.transcript}</div>
                          </div>
                        )}
                      </div>
                    </details>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

/* ───────────────────────── Reusable Section Component ───────────────────────── */
const Section = ({ title, children, editMode }) => (
  <div className="bg-black/30 p-4 rounded-xl">
    <h3 className="font-semibold text-lg flex items-center gap-2">
      {title}
      {editMode && <span className="text-xs text-white/60">(editable)</span>}
    </h3>
    {children}
  </div>
);
