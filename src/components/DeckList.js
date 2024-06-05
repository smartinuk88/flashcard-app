import Deck from "./Deck";
import { useUser } from "../helpers/Context";
import AddDeck from "./AddDeck";

function DeckList() {
  const { userDeckData } = useUser();

  return (
    <div>
      <AddDeck />

      <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {userDeckData &&
          userDeckData.map((deck) => <Deck key={deck.id} deck={deck} />)}
      </div>
    </div>
  );
}

export default DeckList;
