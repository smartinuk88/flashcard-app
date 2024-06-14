import { Link, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Flashcard from "../components/Flashcard";
import Footer from "../components/Footer";
import AddFlashCardModal from "../components/AddFlashCardModal";
import { useState } from "react";
import DeckEditButtons from "../components/DeckEditButtons";
import EditFlashcardModal from "../components/EditFlashcardModal";
import DeleteFlashcardModal from "../components/DeleteFlashcardModal";
import { useUser } from "../helpers/Context";

function DeckDash() {
  const { state: deck } = useLocation();
  const { loading, authUser, userData, userDeckData } = useUser();
  const [addFlashcardModal, setAddFlashcardModal] = useState(false);
  const [editFlashcardModal, setEditFlashcardModal] = useState(false);
  const [deleteFlashcardModal, setDeleteFlashcardModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const colors = ["one", "two", "three"];

  const currentDeck = userDeckData.find((d) => d.id === deck.id);

  const getColor = (index) => colors[index % colors.length];

  const getNextFlashcard = () => {
    setCurrentIndex((prev) =>
      prev + 1 < currentDeck.flashcards.length ? prev + 1 : -1
    );
  };

  if (loading || !authUser || !userData) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col justify-between items-center h-[calc(100vh-104px)] p-5 sm:p-8">
        <div className="w-full">
          <h1 className="text-center text-dark line-clamp-2 overflow-hidden text-lg sm:text-2xl md:text-4xl font-bold mb-1 break-words">
            {currentDeck.title}
          </h1>
          <p className="text-center text-dark line-clamp-2 overflow-hidden text-xs sm:text-sm md:text-lg break-words">
            {currentDeck.description}
          </p>
        </div>

        {/* Modals for modifying flashcards */}
        {addFlashcardModal && (
          <AddFlashCardModal
            deck={currentDeck}
            onToggleFlashcardModal={setAddFlashcardModal}
          />
        )}

        {editFlashcardModal && (
          <EditFlashcardModal
            deck={currentDeck}
            flashcard={currentDeck.flashcards[currentIndex]}
            onToggleFlashcardModal={setEditFlashcardModal}
          />
        )}

        {deleteFlashcardModal && (
          <DeleteFlashcardModal
            deck={currentDeck}
            flashcard={currentDeck.flashcards[currentIndex]}
            onToggleFlashcardModal={setDeleteFlashcardModal}
          />
        )}

        <div className="relative flex flex-col items-center">
          {/* No flashcards in deck condition */}
          {currentDeck.flashcards.length === 0 && (
            <div className="relative flex flex-col justify-center items-center mb-4 border border-one w-64 h-96 sm:w-72 rounded-lg shadow-md text-2xl font-semibold text-center">
              <p>No flashcards added</p>
            </div>
          )}

          {/* Review Session Finished Condition */}
          {currentIndex === -1 && currentDeck.flashcards.length > 0 && (
            <div className="relative flex flex-col justify-between items-center mb-4 bg-one text-white w-64 h-96 sm:w-72 rounded-lg shadow-md text-xl font-semibold text-center py-8">
              <p>Review Session Finished!</p>
              <div className="flex flex-col">
                <button
                  onClick={() => setCurrentIndex(0)}
                  className="p-4 mb-3 rounded-lg bg-dark text-white text-sm hover:opacity-90 shadow-md transition duration-100"
                >
                  Review Deck Again
                </button>

                <Link to={"/"}>
                  <button className="p-4 rounded-lg bg-light text-dark text-sm hover:opacity-90 shadow-md transition duration-100">
                    Close Deck
                  </button>
                </Link>
              </div>
            </div>
          )}

          {currentIndex >= 0 && currentIndex < currentDeck.flashcards.length ? (
            <Flashcard
              key={
                currentIndex >= 0
                  ? currentDeck.flashcards[currentIndex].id
                  : "finished"
              }
              flashcard={
                currentIndex >= 0
                  ? currentDeck.flashcards[currentIndex]
                  : undefined
              }
              onNext={getNextFlashcard}
              onCurrentIndexChange={setCurrentIndex}
              deckId={currentDeck?.id}
              color={getColor(currentIndex)}
            />
          ) : null}

          <DeckEditButtons
            onSetAddFlashcardModal={setAddFlashcardModal}
            onSetEditFlashcardModal={setEditFlashcardModal}
            onSetDeleteFlashcardModal={setDeleteFlashcardModal}
            flashcards={currentDeck.flashcards}
            currentIndex={currentIndex}
          />
          {currentDeck.flashcards.length > 1 &&
            currentIndex >= 0 &&
            currentIndex < currentDeck.flashcards.length - 1 && (
              <Flashcard
                flashcard={currentDeck.flashcards[currentIndex + 1]}
                isNextCard={true}
                color={getColor(currentIndex + 1)}
              />
            )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default DeckDash;
