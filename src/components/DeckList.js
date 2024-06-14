import Deck from "./Deck";
import { useUser } from "../helpers/Context";
import AddDeck from "./AddDeck";

function DeckList() {
  const { userDeckData } = useUser();

  return (
    <div className="w-full">
      <AddDeck />

      <div className="w-full grid sm:grid-cols-2  md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {userDeckData &&
          userDeckData.map((deck) => <Deck key={deck.id} deck={deck} />)}
      </div>
    </div>
  );
}

export default DeckList;
