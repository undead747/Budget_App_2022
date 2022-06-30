import React from "react";
import { useState, useEffect, useContext } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateCurrentUser
} from "firebase/auth";
import { auth } from "../Database/firebaseInitialize";
import { useHomeController } from "../Components/HomeContext";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [completeAuthProcess, setCompleteAuthProcess] = useState(false);
  const {loading, setLoading} = useHomeController();

  // Update everytime current user are changed in sever
  useEffect(() => {
    setLoading(true);
    const unsubscriber = onAuthStateChanged(auth, user => {
      setCompleteAuthProcess(true);
      setLoading(false);
      if (user) setCurrentUser(user);
    })

    return unsubscriber;
  }, [])

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const signup = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const updateUser = (user) => updateCurrentUser(auth, user);

  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  const logout = () => signOut(auth);

  const value = {
    currentUser,
    login,
    signup,
    updateUser,
    logout,
    resetPassword
  };

  return <AuthContext.Provider value={value}>
    {completeAuthProcess && children}
  </AuthContext.Provider>
}
