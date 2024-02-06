import { createContext, useState, useContext, useEffect } from "react";
import { auth, db } from "../firebase-config";
import {
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { defaultDeck } from "./DefaultDeck";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to handle fetching or creating user document in Firestore
  const fetchOrCreateUserDocument = async (user) => {
    const userRef = doc(db, "users", user.uid);
    let userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Create the document with default deck
      await setDoc(userRef, {
        displayName: user.displayName,
        img: user.photoURL,
        email: user.email,
        createdAt: serverTimestamp(),
        lastCardReviewed: null,
        cardsReviewed: 0,
        reviewStreak: 0,
        decks: [defaultDeck],
      });
      userSnap = await getDoc(userRef); // Re-fetch the document after creating
    }

    setUserData(userSnap.data());
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setLoading(true);
      if (user) {
        // User is signed in
        setAuthUser(user);
        fetchOrCreateUserDocument(user);
      } else {
        setAuthUser({});
        setUserData({});
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setAuthUser(result.user);
      await fetchOrCreateUserDocument(result.user);
      console.log("Signed in with Google");
    } catch (err) {
      console.error("Error signing in with Google: ", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut(auth); // Sign out from Firebase auth
      setAuthUser(null); // Update state to reflect that user is signed out
      setUserData(null);
      console.log("Sign out successful");
    } catch (err) {
      console.error("Sign out error: ", err);
    } finally {
      setLoading(false);
    }
  };

  // Function to add a new deck to the user's decks array
  const addDeckToUser = async (newDeck) => {
    try {
      const userRef = doc(db, "users", authUser.uid);
      await updateDoc(userRef, {
        decks: arrayUnion(newDeck),
      });
      // Update local state
      setUserData((prevUserData) => ({
        ...prevUserData,
        decks: [...prevUserData.decks, newDeck],
      }));
    } catch (error) {
      console.error("Error adding new deck:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        authUser,
        userData,
        setUserData,
        loading,
        handleSignInWithGoogle,
        handleSignOut,
        addDeckToUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
