import { useState } from "react";
import { useUser } from "../helpers/Context";

function DeleteFlashcardModal({ deck, onToggleFlashcardModal, flashcard }) {
  const { deleteFlashcardInUserDeck } = useUser();

  const [message, setMessage] = useState("");

  const deleteFlashcard = async (e) => {
    e.preventDefault();

    const result = await deleteFlashcardInUserDeck(deck, flashcard.id);

    if (result.success) {
      setMessage("Flashcard deleted successfully!");
    } else {
      setMessage(`Error deleting flashcard: ${result.error}`);
    }

    // Clear the message after 3 seconds
    setTimeout(() => {
      setMessage("");
      onToggleFlashcardModal(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-white flex w-full justify-center items-center z-50">
      <div className="text-center flex flex-col justify-center space-y-10 items-center bg-one p-10 h-4/5 rounded-lg shadow-lg w-4/5">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-white">
            Delete Flashcard
          </h2>
          <p>Are you sure?</p>
        </div>

        <p>{message}</p>

        <div className="flex justify-center space-x-4">
          <button
            onClick={deleteFlashcard}
            className="mt-4 py-2 px-4 shadow-sm bg-dark text-white rounded hover:opacity-90 transition duration-300 ease-in-out"
          >
            Delete Card
          </button>
          <button
            onClick={() => onToggleFlashcardModal(false)}
            className="mt-4 py-2 px-4 shadow-sm bg-light text-dark rounded hover:opacity-90 transition duration-300 ease-in-out"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteFlashcardModal;
