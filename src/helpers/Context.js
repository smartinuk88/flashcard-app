import { createContext, useState, useContext, useEffect } from "react";
import { auth, db } from "../firebase-config";
import {
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  collection,
  addDoc,
  getDocs,
} from "firebase/firestore";
import { defaultDeck } from "./DefaultDeck";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userDeckData, setUserDeckData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to handle fetching or creating user document in Firestore
  const fetchOrCreateUserDocuments = async (user) => {
    const userRef = doc(db, "users", user.uid);
    let userSnap = await getDoc(userRef);
    const decksCollectionRef = collection(db, "users", user.uid, "decks");
    let decksCollectionSnap = await getDocs(decksCollectionRef);
    let userDecks = decksCollectionSnap.docs.map((decksnap) => ({
      id: decksnap.id,
      ...decksnap.data(),
    }));

    if (!userSnap.exists()) {
      // Create the user document without decks
      await setDoc(userRef, {
        displayName: user.displayName,
        img: user.photoURL,
        email: user.email,
        createdAt: serverTimestamp(),
        lastCardReviewed: null,
        cardsReviewed: 0,
        reviewStreak: 0,
      });

      // Create decks subcollection under user doc and initialise with default deck
      const decksCollectionRef = collection(db, "users", user.uid, "decks");
      await addDoc(decksCollectionRef, { ...defaultDeck });

      // Re-fetch the user document and decks collection after creating
      userSnap = await getDoc(userRef);
      decksCollectionSnap = await getDocs(decksCollectionRef);
      userDecks = decksCollectionSnap.docs.map((decksnap) => ({
        id: decksnap.id,
        ...decksnap.data(),
      }));
    }

    setUserData(userSnap.data());
    setUserDeckData(userDecks);
    console.log(userDecks);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setLoading(true);
      if (user) {
        // User is signed in
        setAuthUser(user);
        fetchOrCreateUserDocuments(user);
      } else {
        setAuthUser({});
        setUserData({});
        setUserDeckData([]);
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
      setUserDeckData([]);
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
      // Create new deck doc in user's decks collection
      const decksCollectionRef = collection(db, "users", authUser.uid, "decks");
      const deckDocRef = await addDoc(decksCollectionRef, { ...newDeck });

      // Update user doc with reference to new deck
      const userRef = doc(db, "users", authUser.uid);
      await updateDoc(userRef, {
        decks: arrayUnion(db, `users/${authUser.uid}/decks/${deckDocRef.id}`),
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
        userDeckData,
        setUserDeckData,
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
