import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useUser } from "../helpers/Context";

function Flashcard({ flashcard, onNext, isNextCard = false }) {
  const { userData, setUserData } = useUser();

  const [pendingUpdates, setPendingUpdates] = useState({
    cardsReviewed: 0,
    flashcardsStrength: {},
    lastReviewTime: null,
    reviewStreak: userData.reviewStreak,
  });
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    if (!isNextCard) {
      setFlipped(!flipped);
    }
  };

  const handleReview = (isCorrect, flashcardId) => {
    // Determine if the reviewStreak should be incremented or reset
    const lastReviewDate = userData.lastCardReviewed
      ? new Date(userData.lastCardReviewed.seconds * 1000)
      : new Date();
    const now = new Date();
    const timeSinceLastReview = now - lastReviewDate;
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in one day

    setUserData((prevUserData) => {
      // Calculate the new streak
      const newStreak =
        timeSinceLastReview < oneDay ? prevUserData.reviewStreak + 1 : 1;

      // Update and return the new user data object
      return {
        ...prevUserData,
        reviewStreak: newStreak,
        lastCardReviewed: now, // Update this if you want to show the last review time in the UI immediately as well
      };
    });

    // Update local state
    // Get new strength level of flashcard
    const strengthChange = isCorrect ? 1 : -1;
    const newStrength = Math.min(
      Math.max(
        (pendingUpdates.flashcardsStrength[flashcardId] || 0) + strengthChange,
        0
      ),
      5
    );

    setPendingUpdates((prevState) => ({
      ...prevState,
      cardsReviewed: prevState.cardsReviewed + 1,
      flashcardsStrength: {
        ...prevState.flashcardsStrength,
        [flashcardId]: newStrength,
      },
      lastReviewTime: lastReviewDate,
    }));

    onNext();
  };

  if (!flashcard) {
    return (
      <div className="relative flex flex-col justify-center items-center mb-4 border border-primary-blue w-72 h-96 rounded-lg shadow-md text-2xl font-semibold transition duration-100 text-center">
        <p>No flashcards added</p>
      </div>
    ); // Just in case flashcard is undefined
  }

  return (
    <div
      onClick={handleFlip}
      className={`flex flex-col justify-center items-center mb-4 border bg-white border-primary-blue w-72 h-96 rounded-lg shadow-md cursor-pointer text-2xl font-semibold transition duration-100 text-center ${
        isNextCard ? "absolute top-0" : "relative z-10"
      }`}
    >
      <p>{!flipped || isNextCard ? flashcard.front : flashcard.back}</p>

      {flipped && !isNextCard && (
        <div className="absolute bottom-0 w-full flex justify-between p-4">
          <FontAwesomeIcon
            className="text-green-600 cursor-pointer"
            icon={faCheck}
            onClick={() => handleReview(true, flashcard.id)}
          />
          <FontAwesomeIcon
            className="text-red-600 cursor-pointer"
            icon={faXmark}
            onClick={() => handleReview(false, flashcard.id)}
          />
        </div>
      )}
    </div>
  );
}

export default Flashcard;
