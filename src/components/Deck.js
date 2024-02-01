import { Link } from "react-router-dom";

function Deck({ deck, i }) {
  return (
    <Link to={`decks/${i}`} state={deck}>
      <div className="flex flex-col bg-primary-blue rounded-xl p-4 items-center justify-center space-x-4 h-52 w-full min-h-max hover:scale-105 transition duration-100 cursor-pointer">
        <h3 className="text-lg font-semibold text-white">{deck.title}</h3>
        <p className="text-sm">{deck.flashcards.length} cards</p>
      </div>
    </Link>
  );
}

export default Deck;
