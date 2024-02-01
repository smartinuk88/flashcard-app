import { useEffect, useState } from "react";
import Deck from "./Deck";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase-config";

function DeckList() {
  const [decks, setDecks] = useState([]);
  const [addDeckMenuDisplay, setAddDeckMenuDisplay] = useState("none");
  const [newDeckTitle, setNewDeckTitle] = useState("");
  const [newDeckDescription, setNewDeckDescription] = useState("");

  useEffect(() => {
    if (!auth.currentUser) return; // Check if the user is logged in

    const userDocRef = doc(db, "users", auth.currentUser.uid);

    const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        console.log(userData.decks);
        userData.decks && setDecks(userData.decks);
      } else {
        // No user document exists
        console.log("No such document!");
      }
    });

    // Unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, [auth, db]);

  const addDeck = async (e) => {
    e.preventDefault();
    const newDeck = {
      collection: [],
      createdBy: auth.currentUser.displayName,
      description: newDeckDescription,
      title: newDeckTitle,
    };

    await addDoc(collection(db, "decks"), {
      ...newDeck,
    });

    // setDoc(userDocRef, {decks: })

    setNewDeckDescription("");
    setNewDeckTitle("");
  };

  const cancelAddDeck = (e) => {
    e.preventDefault();
    setAddDeckMenuDisplay("none");
    setNewDeckTitle("");
    setNewDeckDescription("");
  };

  const openAddDeckMenu = () => {
    addDeckMenuDisplay === "none"
      ? setAddDeckMenuDisplay("block")
      : setAddDeckMenuDisplay("none");
  };

  const deleteDeck = async (id) => {
    const deckDoc = doc(db, "decks", id);
    await deleteDoc(deckDoc);
  };

  return (
    <div>
      <button
        onClick={openAddDeckMenu}
        className={`${
          addDeckMenuDisplay === "block" && "disabled bg-gray-500"
        } w-full p-3 text-lg border border-primary-blue mb-4 rounded-full shadow-sm hover:bg-secondary-blue hover:text-white hover:border-white transition duration-75`}
      >
        Add Deck
      </button>

      {/* Add Deck Form */}
      <form
        style={{ display: addDeckMenuDisplay }}
        className="p-10 bg-white shadow-sm m-4 border rounded-lg w-full mx-auto"
      >
        <div className="mb-6">
          <div className="mb-3">
            <label htmlFor="deck-title"></label>
            <input
              className="w-full inline-block outline-none border border-primary-blue p-2 rounded-lg"
              required
              type="text"
              value={newDeckTitle}
              placeholder="Deck Title"
              onChange={(e) => setNewDeckTitle(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="deck-description"></label>
            <input
              className="w-full inline-block outline-none border border-primary-blue p-2 rounded-lg"
              required
              type="text"
              value={newDeckDescription}
              placeholder="Deck Description"
              onChange={(e) => setNewDeckDescription(e.target.value)}
            />
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            className="p-2 bg-green-600 text-center w-full rounded-full"
            onClick={addDeck}
          >
            Confirm
          </button>
          <button
            className="p-2 bg-red-600 text-center w-full rounded-full"
            onClick={cancelAddDeck}
          >
            Cancel
          </button>
        </div>
      </form>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {decks && decks.map((deck) => <Deck key={deck.id} deck={deck} />)}
      </div>
    </div>
  );
}

export default DeckList;
