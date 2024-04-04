import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { auth, db } from "../firebase-config";
import {
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  writeBatch,
  Timestamp,
} from "firebase/firestore";
import { defaultDeck } from "./DefaultDeck";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userDeckData, setUserDeckData] = useState([]);
  const [pendingFlashcardUpdates, setPendingFlashcardUpdates] = useState({});
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
        lastReviewed: null,
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
        lastReviewed:
          (decksnap.lastReviewed && decksnap.lastReviewed.toDate()) || null,
      }));
    }

    setUserData(userSnap.data());
    setUserDeckData(userDecks);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setLoading(true);
      if (user) {
        // User is signed in
        setAuthUser(user);

        const handleLocalStorageUpdates = async () => {
          const pendingUpdatesString = localStorage.getItem("pendingUpdates");
          if (pendingUpdatesString) {
            try {
              const pendingUpdates = JSON.parse(pendingUpdatesString);
              // Ensure that there are actually updates to process
              if (pendingUpdates && Object.keys(pendingUpdates).length > 0) {
                console.log(
                  "Found pending updates in local storage, updating Firebase..."
                );
                // Call handleFirebaseUpdate with the pending updates
                const updateResult = await handleFirebaseUpdate(
                  pendingUpdates.flashcardUpdates,
                  pendingUpdates.userData
                );
                if (updateResult.success) {
                  // Clear local storage after successful update
                  localStorage.removeItem("pendingUpdates");
                }
              }
            } catch (error) {
              console.error(
                "Error processing updates from local storage:",
                error
              );
            }
          }
        };

        // await handleLocalStorageUpdates();
        await fetchOrCreateUserDocuments(user);
      } else {
        setAuthUser({});
        setUserData({});
        setUserDeckData([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Function to check if 24 hours have passed since last review
    const checkReviewStreak = async () => {
      const now = new Date();
      const lastReviewDate = userData.lastReviewed
        ? new Date(userData.lastReviewed.seconds * 1000)
        : null;
      const oneDay = 24 * 60 * 60 * 1000; // milliseconds in one day

      if (lastReviewDate && now - lastReviewDate > oneDay) {
        // If more than 24 hours have passed since the last review, reset streak
        console.log(
          "More than 24 hours have passed since last review. Resetting streak."
        );
        setUserData((prevUserData) => ({
          ...prevUserData,
          reviewStreak: 0,
        }));
      }
    };

    // Set up the interval to run the check every hour
    const intervalId = setInterval(checkReviewStreak, 3600000); // 3600000 ms = 1 hour

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [userData, authUser]); // Depend on userData and authUser to re-run the effect when they change

  // Store the pending updates in a ref so that it doesn't trigger effects
  const pendingUpdatesRef = useRef(pendingFlashcardUpdates);
  const userDataRef = useRef(userData);

  // Update the ref whenever the pendingFlashcardUpdates changes
  useEffect(() => {
    pendingUpdatesRef.current = pendingFlashcardUpdates;
    userDataRef.current = userData;
  }, [pendingFlashcardUpdates, userData]);

  const handleFirebaseUpdate = useCallback(
    async (
      flashcardUpdates = pendingUpdatesRef.current,
      userDataUpdates = userDataRef.current,
      user = authUser
    ) => {
      console.log("Checking pendingFlashcardUpdates...");
      if (Object.keys(flashcardUpdates).length > 0) {
        console.log("Pending updates found, updating firebase...");
        try {
          // Begin a batch to perform all updates together
          const batch = writeBatch(db);

          // Update user document with overall review stats
          const userRef = doc(db, "users", user.uid);

          // TODO: Convert ISO string back to Firestore Timestamp (and same for pendingUpdates and local storage updates)
          let lastReviewedTimestamp;
          if (typeof userDataUpdates.lastReviewed === "string") {
            // If it's a string, convert it to a Date object first
            const userLastReviewedDate = new Date(userDataUpdates.lastReviewed);
            lastReviewedTimestamp = Timestamp.fromDate(userLastReviewedDate);
          } else {
            // Assume it's already a Timestamp
            lastReviewedTimestamp = userDataUpdates.lastReviewed;
          }

          batch.update(userRef, {
            cardsReviewed: userDataUpdates.cardsReviewed,
            reviewStreak: userDataUpdates.reviewStreak,
            lastReviewed: lastReviewedTimestamp,
          });

          // Update relevant deck documents with changes to flashcard data

          for (const [deckId, updates] of Object.entries(flashcardUpdates)) {
            const deckRef = doc(db, "users", user.uid, "decks", deckId);
            const deckSnap = await getDoc(deckRef);

            if (deckSnap.exists()) {
              const deckData = deckSnap.data();
              // Clone the existing flashcards array from the snapshot data
              let updatedFlashcards = [...deckData.flashcards];

              // Update each flashcard in the cloned array based on the pending updates
              for (const [flashcardId, updateData] of Object.entries(updates)) {
                const index = updatedFlashcards.findIndex(
                  (f) => f.id === Number(flashcardId)
                );
                if (index !== -1) {
                  updatedFlashcards[index] = {
                    ...updatedFlashcards[index],
                    ...updateData,
                  };
                }
              }

              // Set the updated array back to the deck document
              batch.update(deckRef, { flashcards: updatedFlashcards });
            }
          }

          // Commit the batch
          await batch.commit();

          // Clear the ref
          pendingUpdatesRef.current = {};

          // Clear the pending updates state itself
          setPendingFlashcardUpdates({});

          // Clear local storage
          localStorage.removeItem("pendingUpdates");
          return { success: true }; // Indicate success
        } catch (error) {
          console.error("Error updating user session data:", error);
          return { success: false, error: error.message }; // Indicate failure and include error message
        }
      } else {
        console.log("No updates to perform");
        return { success: true };
      }
    },
    [db, authUser]
  );

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

  const handleSignOut = useCallback(async () => {
    setLoading(true);
    try {
      await handleFirebaseUpdate();
      signOut(auth); // Sign out from Firebase auth
      setAuthUser(null); // Update state to reflect that user is signed out
      setUserData(null);
      setUserDeckData([]);
      console.log("Sign out successful");
    } catch (err) {
      console.error("Sign out error: ", err);
    } finally {
      setLoading(false);
    }
  }, [
    handleFirebaseUpdate,
    setLoading,
    signOut,
    setAuthUser,
    setUserData,
    setUserDeckData,
  ]);

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

  // Function to add a new flashcard to the user's decks collection
  const addFlashcardToUserDeck = async (newFlashcard, deck) => {
    try {
      const deckDocRef = doc(db, "users", authUser.uid, "decks", deck.id);
      const docSnap = await getDoc(deckDocRef);

      if (docSnap.exists()) {
        const deckData = docSnap.data();
        // Ensure flashcards array exists and append new flashcard with updated id
        const updatedFlashcards = [
          ...(deckData.flashcards || []),
          { ...newFlashcard, id: (deckData.flashcards || []).length },
        ];

        // Update the document with the new array
        await updateDoc(deckDocRef, { flashcards: updatedFlashcards });

        // Update local state similarly
        setUserDeckData((prevUserDeckData) =>
          prevUserDeckData.map((d) =>
            d.id === deck.id ? { ...d, flashcards: updatedFlashcards } : d
          )
        );
      }

      return { success: true }; // Indicate success
    } catch (error) {
      console.error("Error adding new flashcard:", error);
      return { success: false, error: error.message }; // Indicate failure and include error message
    }
  };

  // Function to edit a flashcard in a user's decks collection
  const editFlashcardInUserDeck = async (editedFlashcard, deck) => {
    try {
      // Reference to specific user deck document
      const deckDocRef = doc(db, "users", authUser.uid, "decks", deck.id);

      // Fetch the current state of the deck to access its flashcards
      const docSnap = await getDoc(deckDocRef);
      if (!docSnap.exists()) {
        console.log("No such document!");
        return { success: false, error: "Deck document does not exist" };
      }
      const currentDeck = docSnap.data();

      // Replace the old flashcard with the new edited version
      const updatedFlashcards = currentDeck.flashcards.map((flashcard) =>
        flashcard.id === editedFlashcard.id ? editedFlashcard : flashcard
      );

      // Update the deck document with the new flashcards array
      await updateDoc(deckDocRef, {
        flashcards: updatedFlashcards,
      });

      // Update local state: Find the deck to update and add the new flashcard to its 'flashcards' array
      setUserDeckData((prevUserDeckData) =>
        prevUserDeckData.map((d) =>
          d.id === deck.id ? { ...d, flashcards: updatedFlashcards } : d
        )
      );

      return { success: true }; // Indicate success
    } catch (error) {
      console.error("Error adding new flashcard:", error);
      return { success: false, error: error.message }; // Indicate failure and include error message
    }
  };

  const deleteFlashcardInUserDeck = async (deck, id) => {
    try {
      // Reference to specific user deck document
      const deckDocRef = doc(db, "users", authUser.uid, "decks", deck.id);

      // Fetch the current state of the deck to access its flashcards
      const docSnap = await getDoc(deckDocRef);
      if (!docSnap.exists()) {
        console.log("No such document!");
        return { success: false, error: "Deck document does not exist" };
      }
      const currentDeck = docSnap.data();

      // Filter out the deleted flashcard
      const updatedFlashcards = currentDeck.flashcards.filter(
        (flashcard) => flashcard.id !== id
      );

      // Update the deck document with the new flashcards array
      await updateDoc(deckDocRef, {
        flashcards: updatedFlashcards,
      });

      // Update local state: Find the updated deck and add the new flashcard to its 'flashcards' array
      setUserDeckData((prevUserDeckData) =>
        prevUserDeckData.map((d) =>
          d.id === deck.id ? { ...d, flashcards: updatedFlashcards } : d
        )
      );

      return { success: true };
    } catch (error) {
      console.error("Error deleting flashcard:", error);
      return { success: false, error: error.message }; // Indicate failure and include error message
    }
  };

  return (
    <UserContext.Provider
      value={{
        authUser,
        userDataRef,
        userData,
        setUserData,
        userDeckData,
        setUserDeckData,
        pendingFlashcardUpdates,
        setPendingFlashcardUpdates,
        pendingUpdatesRef,
        loading,
        handleSignInWithGoogle,
        handleSignOut,
        addDeckToUser,
        deleteUserDeck,
        addFlashcardToUserDeck,
        editFlashcardInUserDeck,
        deleteFlashcardInUserDeck,
        handleFirebaseUpdate,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
