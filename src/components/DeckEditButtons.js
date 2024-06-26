import {
  faPenToSquare,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function DeckEditButtons({
  onSetAddFlashcardModal,
  onSetEditFlashcardModal,
  onSetDeleteFlashcardModal,
  flashcards,
  currentIndex,
}) {
  return (
    <div className="absolute flex flex-col justify-between items-center space-y-8 top-0 -left-10">
      <FontAwesomeIcon
        onClick={() => onSetAddFlashcardModal(true)}
        className="cursor-pointer text-2xl text-dark"
        icon={faPlus}
      />

      {flashcards.length > 0 && currentIndex !== -1 && (
        <>
          <FontAwesomeIcon
            onClick={() => onSetEditFlashcardModal(true)}
            className="cursor-pointer text-2xl text-dark"
            icon={faPenToSquare}
          />
          <FontAwesomeIcon
            onClick={() => onSetDeleteFlashcardModal(true)}
            className="cursor-pointer text-2xl text-dark"
            icon={faTrash}
          />
        </>
      )}
    </div>
  );
}

export default DeckEditButtons;
