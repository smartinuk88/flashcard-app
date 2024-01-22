import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Flashcard from "../components/Flashcard";
import Footer from "../components/Footer";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function DeckDash() {
  const { state } = useLocation();
  const [flashcards, setFlashcards] = useState(state.collection);
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="h-screen">
      <Header />
      <main className="mx-auto h-full px-10 max-w-screen mt-4 mb-8">
        <h1 className="text-center text-4xl font-bold mb-1">{state.title}</h1>
        <p className="text-center text-xl">{state.description}</p>
        <div className="relative flex items-center justify-center p-10">
          <FontAwesomeIcon
            className="absolute top-4 left-4 text-3xl"
            icon={faPlus}
          />
          <Flashcard flashcards={flashcards} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default DeckDash;
