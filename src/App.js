import { useEffect, useState } from "react";
import {
  auth,
  db,
  handleSignInWithGoogle,
  handleSignOut,
} from "./firebase-config";
import { serverTimestamp, doc, getDoc, setDoc } from "firebase/firestore";
import Dashboard from "./components/Dashboard";
import SignIn from "./components/SignIn";

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
        if (userSnap.exists()) {
          // Update doc
          console.log(userSnap.data());
        } else {
          // Create doc
          const userData = {
            displayName: user.displayName,
            img: user.photoURL,
            email: user.email,
            createdAt: serverTimestamp(),
            cardsReviewed: 0,
            reviewStreak: 0,
            deckProgress: {},
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

  return <div>{authUser ? <Dashboard /> : <SignIn />}</div>;
}

export default App;
