import { createContext, useState, useContext, useEffect } from "react";
import { auth, db } from "../firebase-config";
import { serverTimestamp, doc, getDoc, setDoc } from "firebase/firestore";
import { defaultDeck } from "./DefaultDeck";

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const listen = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // User is signed in
        setAuthUser(user);
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          // Create doc WITH default deck from helpers/DefaultDeck
          const userData = {
            displayName: user.displayName,
            img: user.photoURL,
            email: user.email,
            createdAt: serverTimestamp(),
            lastCardReviewed: null,
            cardsReviewed: 0,
            reviewStreak: 0,
            decks: [defaultDeck],
          };

          await setDoc(userRef, userData);
          setUserData(userData);
        } else {
          setUserData(userSnap.data());
        }
      } else {
        setAuthUser(null);
        setUserData(null);
      }
    });

    return () => listen();
  }, []);

  return (
    <UserContext.Provider value={{ authUser, userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};
