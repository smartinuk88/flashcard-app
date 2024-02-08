import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Flashcard from "../components/Flashcard";
import Footer from "../components/Footer";

function DeckDash() {
  const { state } = useLocation();

  return (
    <div className="h-screen">
      <Header />
      <main className="mx-auto px-10 max-w-screen mt-4 mb-8">
        <h1 className="text-center text-2xl md:text-4xl font-bold mb-1">
          {state.title}
        </h1>
        <p className="text-center text-sm md:text-lg">{state.description}</p>
        <div className="flex items-center justify-center p-10">
          <Flashcard flashcards={state.flashcards} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default DeckDash;
