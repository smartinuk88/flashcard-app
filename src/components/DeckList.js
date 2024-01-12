import Deck from "./Deck";

function DeckList() {
  const decks = [
    {
      title: "1000 Most Common Spanish Words",
      description: "The absolute essential Spanish words",
      collection: [
        "Ver",
        "Ir",
        "Hola",
        "Adios",
        "Bien",
        "Mal",
        "Calor",
        "Frío",
      ],
    },
    {
      title: "House Vocab",
      description: "Important words for around the house",
      collection: [
        "Taza",
        "Aspirador",
        "Salón",
        "Cama",
        "Baño",
        "Nevera",
        "Habitación",
        "Cocina",
      ],
    },
  ];
  return (
    <div>
      <button className="w-full p-3 text-lg border border-primary-blue mb-4 rounded-full shadow-sm">
        Add Deck
      </button>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {decks.map((deck) => (
          <Deck deck={deck} />
        ))}
        {/* Extra dummy decks for styling purposes */}
        {decks.map((deck) => (
          <Deck deck={deck} />
        ))}
        {decks.map((deck) => (
          <Deck deck={deck} />
        ))}
        {decks.map((deck) => (
          <Deck deck={deck} />
        ))}
      </div>
    </div>
  );
}

export default DeckList;
