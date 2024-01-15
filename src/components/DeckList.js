import { useState } from "react";
import Deck from "./Deck";
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase-config";

function DeckList() {
  const [addDeckOpen, setAddDeckOpen] = useState(false);
  const [newDeckTitle, setNewDeckTitle] = useState("");
  const [newDeckDescription, setNewDeckDescription] = useState("");

  const decks = [
    {
      title: "1000 Most Common Spanish Words",
      description: "The absolute essential Spanish words",
      collection: [
        "Ver",
        "Ir",
        "Hola",
        "Adios",
        "Bien",
        "Mal",
        "Calor",
        "Frío",
      ],
    },
    {
      title: "House Vocab",
      description: "Important words for around the house",
      collection: [
        "Taza",
        "Aspirador",
        "Salón",
        "Cama",
        "Baño",
        "Nevera",
        "Habitación",
        "Cocina",
      ],
    },
  ];

  const addDeck = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "decks"), {
      collection: [],
      createdBy: auth.currentUser.uid,
      description: newDeckDescription,
      title: newDeckTitle,
    });
    setNewDeckDescription("");
    setNewDeckTitle("");
  };

  const cancelAddDeck = () => {
    setAddDeckOpen(false);
    setNewDeckTitle("");
    setNewDeckDescription("");
  };

  const deleteDeck = async (id) => {
    const deckDoc = doc(db, "decks", id);
    await deleteDoc(deckDoc);
  };

  return (
    <div>
      <button
        onClick={(prev) => setAddDeckOpen(!prev)}
        className="w-full p-3 text-lg border border-primary-blue mb-4 rounded-full shadow-sm hover:bg-secondary-blue hover:text-white hover:border-white transition duration-75"
      >
        Add Deck
      </button>
      <form>
        <label htmlFor="deck-title">Deck Title</label>
        <input
          type="text"
          value={newDeckTitle}
          onChange={(e) => setNewDeckTitle(e.target.value)}
        />
        <label htmlFor="deck-description">Deck Description</label>
        <input
          type="text"
          value={newDeckDescription}
          onChange={(e) => setNewDeckDescription(e.target.value)}
        />
        <button onClick={addDeck}>Confirm</button>
        <button onClick={cancelAddDeck}>Cancel</button>
      </form>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {decks.map((deck) => (
          <Deck deck={deck} />
        ))}
        {/* Extra dummy decks for styling purposes */}
        {decks.map((deck) => (
          <Deck deck={deck} />
        ))}
        {decks.map((deck) => (
          <Deck deck={deck} />
        ))}
        {decks.map((deck) => (
          <Deck deck={deck} />
        ))}
      </div>
    </div>
  );
}

export default DeckList;
