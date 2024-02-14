import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Flashcard from "../components/Flashcard";
import Footer from "../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import AddFlashCardModal from "../components/AddFlashCardModal";
import { useState } from "react";

function DeckDash() {
  const { state } = useLocation();
  const [addFlashcardModal, setAddFlashcardModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to advance to the next flashcard
  const getNextFlashcard = () => {
    setCurrentIndex(
      currentIndex < state.flashcards.length - 1 ? currentIndex + 1 : 0
    );
  };

  return (
    <div className="h-screen">
      <Header />
      <main className="mx-auto px-10 max-w-screen mt-4 mb-8">
        <h1 className="text-center text-2xl md:text-4xl font-bold mb-1">
          {state.title}
        </h1>
        <p className="text-center text-sm md:text-lg">{state.description}</p>

        {addFlashcardModal && (
          <AddFlashCardModal
            deck={state}
            onToggleFlashcardModal={setAddFlashcardModal}
          />
        )}

        <div className="flex items-center justify-center p-10">
          {!state.flashcards.length && (
            <div className="relative flex flex-col justify-center items-center border border-primary-blue w-72 h-96 rounded-lg shadow-md text-2xl font-semibold transition duration-100 text-center">
              <p>No flashcards added</p>
            </div>
          )}

          <div className="relative">
            {state.flashcards.length > 0 && (
              <Flashcard
                flashcard={state.flashcards[currentIndex]}
                onNext={getNextFlashcard}
              />
            )}
            {state.flashcards.length > 1 &&
              currentIndex < state.flashcards.length - 1 && (
                <Flashcard
                  flashcard={state.flashcards[currentIndex + 1]}
                  isNextCard={true}
                />
              )}

            <div className="absolute flex flex-col justify-between items-center space-y-8 top-0 -left-10">
              <FontAwesomeIcon
                onClick={() => setAddFlashcardModal(true)}
                className="cursor-pointer"
                icon={faPlus}
              />
              <FontAwesomeIcon
                className="cursor-pointer"
                icon={faPenToSquare}
              />
              <FontAwesomeIcon className="cursor-pointer" icon={faTrash} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default DeckDash;
