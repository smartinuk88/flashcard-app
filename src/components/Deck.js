function Deck({ deck }) {
  return (
    <div className="flex flex-col bg-primary-blue rounded-xl p-4 items-center justify-center space-x-4 h-52 w-full min-h-max hover:scale-105 transition duration-100 cursor-pointer">
      <h3 className="text-lg font-semibold text-white">{deck.title}</h3>
      <p className="text-sm">{deck.collection.length} cards</p>
    </div>
  );
}

export default Deck;
