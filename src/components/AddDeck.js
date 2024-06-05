import { useState } from "react";
import { useUser } from "../helpers/Context";

function AddDeck() {
  const { addDeckToUser } = useUser();
  const [addDeckMenuDisplay, setAddDeckMenuDisplay] = useState("none");
  const [newDeckTitle, setNewDeckTitle] = useState("");
  const [newDeckDescription, setNewDeckDescription] = useState("");

  const addDeck = async (e) => {
    e.preventDefault();

    const colors = ["one", "two", "three"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newDeck = {
      flashcards: [],
      description: newDeckDescription,
      title: newDeckTitle,
      bgColor: randomColor,
    };

    addDeckToUser(newDeck);

    setNewDeckDescription("");
    setNewDeckTitle("");
    setAddDeckMenuDisplay("none");
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

  return (
    <div>
      <button
        onClick={openAddDeckMenu}
        className={`w-full p-3 text-lg border bg-dark mb-4 rounded-md shadow-sm text-white transition duration-75`}
      >
        {addDeckMenuDisplay === "block" ? "Hide Add Deck" : "Add Deck"}
      </button>
      <form
        style={{ display: addDeckMenuDisplay }}
        className="p-10 bg-one shadow-md m-4 mb-10 rounded-lg w-full mx-auto"
      >
        <div className="mb-6">
          <div className="mb-3">
            <label htmlFor="deck-title"></label>
            <input
              className="w-full inline-block outline-none shadow-sm p-2 rounded-md"
              required
              type="text"
              value={newDeckTitle}
              maxLength={60}
              placeholder="Deck Title"
              onChange={(e) => setNewDeckTitle(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="deck-description"></label>
            <input
              className="w-full inline-block outline-none shadow-sm p-2 rounded-md"
              required
              type="text"
              value={newDeckDescription}
              placeholder="Deck Description"
              onChange={(e) => setNewDeckDescription(e.target.value)}
            />
          </div>
        </div>
        <div className="flex space-x-10">
          <button
            className="p-2 bg-dark text-center text-white w-full hover:opacity-90 shadow-sm rounded-md"
            onClick={addDeck}
          >
            Confirm
          </button>
          <button
            className="p-2 bg-light text-center text-dark w-full hover:opacity-90 shadow-sm rounded-md"
            onClick={cancelAddDeck}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddDeck;
