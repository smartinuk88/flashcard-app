import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

function Flashcard({ flashcard, onNext, isNextCard = false }) {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    if (!isNextCard) {
      setFlipped(!flipped);
    }
  };

  const handleCorrect = () => {
    onNext();
  };

  const handleIncorrect = () => {
    onNext();
  };

  if (!flashcard) {
    return null; // Just in case flashcard is undefined
  }

  return (
    <div
      onClick={handleFlip}
      className={`relative flex flex-col justify-center items-center border bg-white border-primary-blue w-72 h-96 rounded-lg shadow-md cursor-pointer text-2xl font-semibold transition duration-100 text-center ${
        isNextCard ? "absolute -translate-y-full" : "z-10"
      }`}
    >
      <p>{!flipped || isNextCard ? flashcard.front : flashcard.back}</p>

      {flipped && !isNextCard && (
        <div className="absolute bottom-0 w-full flex justify-between p-4">
          <FontAwesomeIcon
            className="text-green-600 cursor-pointer"
            icon={faCheck}
            onClick={onNext}
          />
          <FontAwesomeIcon
            className="text-red-600 cursor-pointer"
            icon={faXmark}
            onClick={onNext}
          />
        </div>
      )}
    </div>
  );
}

export default Flashcard;
