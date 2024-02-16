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

    // Clear the message after 3 seconds
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-primary-blue flex w-full justify-center items-center z-50">
      <div className="text-center bg-white p-10 h-4/5 rounded-lg shadow-lg w-4/5">
        <h2 className="text-2xl font-bold mb-4">Edit Flashcard</h2>

        <form>
          <div className="mb-6">
            <label htmlFor="card-front">Card Front</label>
            <input
              className="w-full inline-block outline-none border border-primary-blue p-2 rounded-lg"
              required
              type="text"
              value={cardFront}
              onChange={(e) => setCardFront(e.target.value)}
            />
          </div>
          <div className="mb-12">
            <label htmlFor="card-back">Card Back</label>
            <input
              className="w-full inline-block outline-none border border-primary-blue p-2 rounded-lg"
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
              className="mt-4 py-2 px-4 shadow-sm bg-green-500 text-white rounded hover:bg-green-700 transition duration-300 ease-in-out"
            >
              Edit Card
            </button>
            <button
              onClick={() => onToggleFlashcardModal(false)}
              className="mt-4 py-2 px-4 shadow-sm bg-red-500 text-white rounded hover:bg-red-700 transition duration-300 ease-in-out"
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
