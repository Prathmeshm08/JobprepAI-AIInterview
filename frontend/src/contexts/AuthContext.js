// src/contexts/AuthContext.js
import React, { useContext, useEffect, useState, createContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

// 1. Create the context
const AuthContext = createContext();

// 2. Custom hook to use the context easily
export function useAuth() {
  return useContext(AuthContext);
}

// 3. Provider component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 4. Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe; // Clean up the listener on unmount
  }, []);

  // 5. Provide the user to the rest of the app
  return (
    <AuthContext.Provider value={{ currentUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}