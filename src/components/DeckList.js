import { useEffect, useState } from "react";
import Deck from "./Deck";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "../firebase-config";

function DeckList() {
  const [decks, setDecks] = useState([]);
  const [addDeckMenuDisplay, setAddDeckMenuDisplay] = useState("none");
  const [newDeckTitle, setNewDeckTitle] = useState("");
  const [newDeckDescription, setNewDeckDescription] = useState("");

  useEffect(() => {
    const ref = collection(db, "decks");
    const getDecks = onSnapshot(ref, (snapshot) => {
      let results = [];
      snapshot.docs.map((doc) => {
        results.push({ ...doc.data(), id: doc.id });
      });
      setDecks(results);
    });

    return () => getDecks();
  }, []);

  const addDeck = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "decks"), {
      collection: [],
      createdBy: auth.currentUser.displayName,
      description: newDeckDescription,
      title: newDeckTitle,
    });
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
