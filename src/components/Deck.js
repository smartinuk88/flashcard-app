import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../helpers/Context";

function Deck({ deck }) {
  const { deleteUserDeck } = useUser();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="relative bg-primary-blue rounded-xl p-4 h-52 w-full min-h-max hover:bg-secondary-blue transition duration-100">
      {showModal ? (
        <>
          <div className="flex flex-col h-full justify-between items-center py-4">
            <p className="font-semibold text-center">
              Are you sure you want to delete this deck?
            </p>
            <div className="flex space-x-4 items-center">
              <button
                className="bg-green-500 p-2 rounded-lg"
                onClick={() => deleteUserDeck(deck.id)}
              >
                Confirm
              </button>
              <button
                className="bg-red-500 p-2 rounded-lg"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <Link to={`decks/${deck.id}`} state={deck}>
            <div className="flex flex-col cursor-pointer items-start justify-start space-y-4 h-4/5">
              <h3 className="text-lg font-semibold text-white">{deck.title}</h3>
              <p className="text-sm">
                {deck.flashcards ? deck.flashcards.length : 0} cards
              </p>
            </div>
          </Link>
          <FontAwesomeIcon
            onClick={() => setShowModal(true)}
            className="absolute right-4 bottom-4 text-lg cursor-pointer"
            icon={faTrash}
          />
        </>
      )}
    </div>
  );
}

export default Deck;
