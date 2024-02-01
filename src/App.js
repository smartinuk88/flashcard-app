import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { auth, db } from "./firebase-config";
import { serverTimestamp, doc, getDoc, setDoc } from "firebase/firestore";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import ErrorPage from "./pages/ErrorPage";
import DeckDash from "./pages/DeckDash";
import NotFound from "./pages/NotFound";
import { defaultDeck } from "./helpers/DefaultDeck";

function App() {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const listen = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // User is signed in
        setAuthUser(user);
        // Check if user doc already exists
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          // Create doc WITH default deck
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

          await setDoc(doc(db, "users", user.uid), {
            ...userData,
          });
        }
      } else {
        setAuthUser(null);
      }
    });

    return () => {
      listen();
    };
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={authUser ? <Dashboard /> : <SignIn />}
        errorElement={<ErrorPage />}
      />
      <Route
        path="decks/:deckId"
        element={<DeckDash />}
        errorElement={<ErrorPage />}
      />
      <Route path="*" element={<NotFound />} errorElement={<NotFound />} />
    </Routes>
  );
}

export default App;
