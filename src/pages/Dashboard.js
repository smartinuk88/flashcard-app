import { useEffect, useState } from "react";
import DeckList from "../components/DeckList";
import Footer from "../components/Footer";
import Header from "../components/Header";
import UserStats from "../components/UserStats";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase-config";

function Dashboard() {
  const [decks, setDecks] = useState([]);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (!auth.currentUser) return; // Check if the user is logged in

    const userDocRef = doc(db, "users", auth.currentUser.uid);

    const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const fetchedUserData = docSnapshot.data();
        setUserData(fetchedUserData); // Set the user data with the fetched data
        if (fetchedUserData.decks) {
          setDecks(fetchedUserData.decks); // Set the decks with the fetched decks
        }
      } else {
        // No user document exists
        console.log("No such document!");
      }
    });

    // Unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, [auth, db]);

  return (
    <div className="bg-white">
      <Header />
      <main className="mx-auto px-10 max-w-7xl mt-4 mb-8">
        <UserStats userData={userData} />
        <DeckList decks={decks} />
      </main>
      <Footer />
    </div>
  );
}

export default Dashboard;
