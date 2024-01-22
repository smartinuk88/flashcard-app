import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

function Flashcard({ flashcards }) {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped((prev) => !prev);
  };
  return (
    <div
      onClick={handleFlip}
      className="relative flex flex-col justify-center items-center border border-primary-blue w-72 h-96 rounded-lg shadow-md cursor-pointer text-2xl font-semibold hover:scale-105 transition duration-100 text-center"
    >
      <p>{!flipped ? flashcards[0].englishWord : flashcards[0].targetWord}</p>
      <div
        className={
          !flipped
            ? `hidden`
            : `absolute bottom-0 w-full flex justify-between p-4`
        }
      >
        <FontAwesomeIcon className="text-green-600" icon={faCheck} />
        <FontAwesomeIcon className="text-red-600" icon={faXmark} />
      </div>
    </div>
  );
}

export default Flashcard;
