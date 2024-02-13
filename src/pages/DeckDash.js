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

  return (
    <div className="h-screen">
      <Header />
      <main className="mx-auto px-10 max-w-screen mt-4 mb-8">
        <h1 className="text-center text-2xl md:text-4xl font-bold mb-1">
          {state.title}
        </h1>
        {addFlashcardModal && (
          <AddFlashCardModal
            deck={state}
            onToggleFlashcardModal={setAddFlashcardModal}
          />
        )}
        <p className="text-center text-sm md:text-lg">{state.description}</p>
        <div className="flex items-center justify-center p-10">
          <div className="relative">
            <Flashcard flashcards={state.flashcards} />

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
