import { useState } from "react";
import { useUser } from "../helpers/Context";
import { v4 as uuidv4 } from "uuid";

function AddFlashCardModal({ deck, onToggleFlashcardModal }) {
  const { addFlashcardToUserDeck } = useUser();

  const [cardFront, setCardFront] = useState("");
  const [cardBack, setCardBack] = useState("");
  const [message, setMessage] = useState("");

  const addFlashcard = async (e) => {
    e.preventDefault();
    const newFlashcard = {
      id: uuidv4(), // Generates unique id
      front: cardFront,
      back: cardBack,
      lastReviewed: null,
      strength: 0,
    };

    const result = await addFlashcardToUserDeck(newFlashcard, deck);

    if (result.success) {
      setMessage("Flashcard added successfully!");
      console.log(newFlashcard);
    } else {
      setMessage(`Error adding flashcard: ${result.error}`);
    }

    setCardFront("");
    setCardBack("");

    // Clear the message after 3 seconds
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-white flex w-full justify-center items-center z-50">
      <div className="text-center bg-one p-10 h-4/5 rounded-lg shadow-lg w-4/5">
        <h2 className="text-2xl font-bold mb-4 text-white">
          Add New Flashcard
        </h2>

        <form>
          <div className="mb-6">
            <label htmlFor="card-front" className="text-white">
              Card Front
            </label>
            <input
              className="w-full inline-block outline-none shadow-sm p-2 rounded-md"
              required
              type="text"
              value={cardFront}
              placeholder="Hola"
              onChange={(e) => setCardFront(e.target.value)}
            />
          </div>
          <div className="mb-12">
            <label htmlFor="card-back" className="text-white">
              Card Back
            </label>
            <input
              className="w-full inline-block outline-none border border-one p-2 rounded-lg"
              required
              type="text"
              value={cardBack}
              placeholder="Hello"
              onChange={(e) => setCardBack(e.target.value)}
            />
          </div>

          <p className="h-10">{message}</p>

          <div className="flex justify-center space-x-4">
            <button
              onClick={addFlashcard}
              className="mt-4 py-2 px-4 shadow-sm bg-dark text-white rounded-md hover:opacity-90 transition duration-300 ease-in-out"
            >
              Add Card
            </button>
            <button
              onClick={() => onToggleFlashcardModal(false)}
              className="mt-4 py-2 px-4 shadow-sm bg-light text-dark rounded-md hover:opacity-90 transition duration-300 ease-in-out"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddFlashCardModal;
