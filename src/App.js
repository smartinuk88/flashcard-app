import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { auth, db } from "./firebase-config";
import { serverTimestamp, doc, getDoc, setDoc } from "firebase/firestore";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import ErrorPage from "./pages/ErrorPage";
import DeckDash from "./pages/DeckDash";
import NotFound from "./pages/NotFound";

function App() {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const defaultDeckId = "8ctacE6SGGPJsX8ADh6Q";
    const listen = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // User is signed in
        setAuthUser(user);
        // Check if user doc already exists
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          // Fetch the default deck reference
          const defaultDeckRef = doc(db, "decks", defaultDeckId);
          const defaultDeckSnap = await getDoc(defaultDeckRef);

          if (!defaultDeckSnap.exists()) {
            console.error("Default deck does not exist");
            // Handle the error appropriately
            return;
          }

          // Create doc WITH default deck
          const userData = {
            displayName: user.displayName,
            img: user.photoURL,
            email: user.email,
            createdAt: serverTimestamp(),
            lastCardReviewed: null,
            cardsReviewed: 0,
            reviewStreak: 0,
            deckProgress: {},
            decks: [defaultDeckRef],
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
