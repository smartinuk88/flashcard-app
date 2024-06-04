import { useState } from "react";
import { useUser } from "../helpers/Context";

function EditFlashcardModal({ deck, onToggleFlashcardModal, flashcard }) {
  const { editFlashcardInUserDeck } = useUser();

  const [cardFront, setCardFront] = useState(flashcard.front);
  const [cardBack, setCardBack] = useState(flashcard.back);
  const [message, setMessage] = useState("");

  const editFlashcard = async (e) => {
    e.preventDefault();
    const editedFlashcard = {
      id: flashcard.id,
      front: cardFront,
      back: cardBack,
      lastReviewed: null,
      strength: flashcard.strength,
    };

    const result = await editFlashcardInUserDeck(editedFlashcard, deck);

    if (result.success) {
      setMessage("Flashcard edited successfully!");
    } else {
      setMessage(`Error editing flashcard: ${result.error}`);
    }

    setCardFront("");
    setCardBack("");

    // Clear the message after 1 second
    setTimeout(() => {
      setMessage("");
      onToggleFlashcardModal(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-white flex w-full justify-center items-center z-50">
      <div className="text-center bg-one p-10 h-4/5 rounded-lg shadow-lg w-4/5">
        <h2 className="text-2xl font-bold mb-4 text-white">Edit Flashcard</h2>

        <form>
          <div className="mb-6">
            <label htmlFor="card-front" className="text-white">
              Card Front
            </label>
            <input
              className="w-full inline-block outline-none p-2 shadow-sm rounded-md"
              required
              type="text"
              value={cardFront}
              onChange={(e) => setCardFront(e.target.value)}
            />
          </div>
          <div className="mb-12">
            <label htmlFor="card-back" className="text-white">
              Card Back
            </label>
            <input
              className="w-full inline-block outline-none shadow-sm p-2 rounded-md"
              required
              type="text"
              value={cardBack}
              onChange={(e) => setCardBack(e.target.value)}
            />
          </div>

          <p>{message}</p>

          <div className="flex justify-center space-x-4">
            <button
              onClick={editFlashcard}
              className="mt-4 py-2 px-4 shadow-sm bg-dark text-white rounded hover:opacity-90 transition duration-300 ease-in-out"
            >
              Edit Card
            </button>
            <button
              onClick={() => onToggleFlashcardModal(false)}
              className="mt-4 py-2 px-4 shadow-sm bg-light text-dark rounded hover:opacity-90 transition duration-300 ease-in-out"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditFlashcardModal;
