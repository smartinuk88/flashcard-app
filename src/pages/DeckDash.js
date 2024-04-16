import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Flashcard from "../components/Flashcard";
import Footer from "../components/Footer";
import AddFlashCardModal from "../components/AddFlashCardModal";
import { useState, useEffect } from "react";
import DeckEditButtons from "../components/DeckEditButtons";
import EditFlashcardModal from "../components/EditFlashcardModal";
import DeleteFlashcardModal from "../components/DeleteFlashcardModal";
import { useUser } from "../helpers/Context";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase-config";

function DeckDash() {
  const { state: deck } = useLocation();
  const { loading, authUser, userData } = useUser();
  const [deckData, setDeckData] = useState(deck);
  const [addFlashcardModal, setAddFlashcardModal] = useState(false);
  const [editFlashcardModal, setEditFlashcardModal] = useState(false);
  const [deleteFlashcardModal, setDeleteFlashcardModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!deck?.id) return; // Ensure there's a deck ID to subscribe to

    const deckDocRef = doc(db, "users", authUser.uid, "decks", deck.id);
    const unsubscribe = onSnapshot(deckDocRef, (doc) => {
      if (doc.exists()) {
        setDeckData({ ...doc.data(), id: doc.id }); // Update local state with the latest deck data
      } else {
        // Handle the case where the document does not exist
        console.log("No such document!");
      }
    });

    return () => unsubscribe(); // Clean up the subscription
  }, [deck?.id, db, authUser.uid]); // Re-subscribe when deck.id changes

  // Function to advance to the next flashcard
  const getNextFlashcard = () => {
    setCurrentIndex((prevState) =>
      prevState < deckData.flashcards.length - 1 ? prevState + 1 : -1
    );
  };

  if (loading || !authUser || !userData) return null;

  return (
    <>
      <Header />
      <main className="flex flex-col justify-between items-center h-[calc(100vh-104px)] p-8">
        <div>
          <h1 className="text-center text-2xl md:text-4xl font-bold mb-1">
            {deckData.title}
          </h1>
          <p className="text-center text-sm md:text-lg">
            {deckData.description}
          </p>
        </div>

        {/* Modals for modifying flashcards */}
        {addFlashcardModal && (
          <AddFlashCardModal
            deck={deckData}
            onToggleFlashcardModal={setAddFlashcardModal}
          />
        )}

        {editFlashcardModal && (
          <EditFlashcardModal
            deck={deckData}
            flashcard={deckData.flashcards[currentIndex]}
            onToggleFlashcardModal={setEditFlashcardModal}
          />
        )}

        {deleteFlashcardModal && (
          <DeleteFlashcardModal
            deck={deckData}
            flashcard={deckData.flashcards[currentIndex]}
            onToggleFlashcardModal={setDeleteFlashcardModal}
          />
        )}

        <div className="relative flex flex-col items-center">
          <Flashcard
            key={
              currentIndex >= 0
                ? deckData.flashcards[currentIndex].id
                : "finished"
            }
            flashcard={
              currentIndex >= 0 ? deckData.flashcards[currentIndex] : undefined
            }
            onNext={getNextFlashcard}
            currentIndex={currentIndex}
            onCurrentIndexChange={setCurrentIndex}
            deckId={deck.id}
          />

          <DeckEditButtons
            onSetAddFlashcardModal={setAddFlashcardModal}
            onSetEditFlashcardModal={setEditFlashcardModal}
            onSetDeleteFlashcardModal={setDeleteFlashcardModal}
            flashcards={deckData.flashcards}
          />
          {deckData.flashcards.length > 1 &&
            currentIndex >= 0 &&
            currentIndex < deckData.flashcards.length - 1 && (
              <Flashcard
                flashcard={deckData.flashcards[currentIndex + 1]}
                isNextCard={true}
              />
            )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default DeckDash;
