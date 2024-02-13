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
  deleteDoc,
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

  // Function to add a new deck to the user's decks collection
  const addDeckToUser = async (newDeck) => {
    try {
      // Create new deck doc in user's decks collection
      const decksCollectionRef = collection(db, "users", authUser.uid, "decks");
      const deckDocRef = await addDoc(decksCollectionRef, { ...newDeck });
      const newDeckWithId = { ...newDeck, id: deckDocRef.id };

      // Update local state
      setUserDeckData((prevUserDeckData) => [
        ...prevUserDeckData,
        newDeckWithId,
      ]);
    } catch (error) {
      console.error("Error adding new deck:", error);
    }
  };

  // Function to delete deck from user's decks collection and update local state
  const deleteUserDeck = async (id) => {
    try {
      // Delete doc from firebase user's decks collection
      const deckDocRef = doc(db, "users", authUser.uid, "decks", id);
      await deleteDoc(deckDocRef);

      // Update local state to remove the deleted deck
      setUserDeckData((prevUserDeckData) =>
        prevUserDeckData.filter((deck) => deck.id !== id)
      );
    } catch (error) {
      console.error("Error deleting deck:", error);
    }
  };

  // Function to add a new deck to the user's decks collection
  const addFlashcardToUserDeck = async (newFlashcard, deck) => {
    try {
      // Reference to specific user deck document
      const deckDocRef = await doc(db, "users", authUser.uid, "decks", deck.id);

      // Add the new flashcard to the 'flashcards' array in the deck document
      await updateDoc(deckDocRef, {
        flashcards: arrayUnion(newFlashcard),
      });

      // Update local state: Find the updated deck and add the new flashcard to its 'flashcards' array
      setUserDeckData((prevUserDeckData) =>
        prevUserDeckData.map((d) =>
          d.id === deck.id
            ? { ...d, flashcards: [...(d.flashcards || []), newFlashcard] }
            : d
        )
      );

      return { success: true }; // Indicate success
    } catch (error) {
      console.error("Error adding new flashcard:", error);
      return { success: false, error: error.message }; // Indicate failure and include error message
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
        deleteUserDeck,
        addFlashcardToUserDeck,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
