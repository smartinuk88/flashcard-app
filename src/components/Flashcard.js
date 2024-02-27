import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useUser } from "../helpers/Context";
import { Link } from "react-router-dom";

function Flashcard({
  flashcard,
  onNext,
  deckId,
  currentIndex = null,
  onCurrentIndexChange,
  isNextCard = false,
}) {
  const {
    userData,
    setUserData,
    pendingUpdates,
    setPendingUpdates,
    handleEndSession,
  } = useUser();
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    if (!isNextCard) {
      setFlipped(!flipped);
    }
  };

  const handleReview = (isCorrect, flashcardId) => {
    // Determine if the reviewStreak should be incremented or reset
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in one day
    const lastReviewDate = userData.lastCardReviewed
      ? new Date(userData.lastCardReviewed.seconds * 1000)
      : null;

    // Check if the last review was more than 24 hours ago or on a different calendar day
    const isNewDayReview =
      !lastReviewDate ||
      now - lastReviewDate >= oneDay ||
      now.toDateString() !== lastReviewDate.toDateString();

    setUserData((prevUserData) => {
      const newStreak = isNewDayReview
        ? prevUserData.reviewStreak + 1
        : prevUserData.reviewStreak;

      // Update and return the new user data object
      return {
        ...prevUserData,
        reviewStreak: newStreak,
        cardsReviewed: prevUserData.cardsReviewed + 1,
      };
    });

    // Calculate new strength level of the flashcard
    const strengthChange = isCorrect ? 1 : -1;
    const existingStrength =
      pendingUpdates.flashcardsStrength[flashcardId] || 0;
    const newStrength = Math.min(
      Math.max(existingStrength + strengthChange, 0),
      5
    );

    setPendingUpdates((prevState) => ({
      ...prevState,
      cardsReviewed: prevState.cardsReviewed + 1,
      flashcardsStrength: {
        ...prevState.flashcardsStrength,
        [deckId]: {
          ...prevState.flashcardsStrength[deckId],
          [flashcardId]: newStrength,
        },
      },
      lastReviewTime: now,
    }));

    onNext();
  };

  if (currentIndex === -1 && !flashcard) {
    return (
      <div className="relative flex flex-col justify-between items-center mb-4 border border-primary-blue w-72 h-96 rounded-lg shadow-md text-xl font-semibold text-center py-8">
        <p>Review Session Finished!</p>
        <div>
          <button
            onClick={() => onCurrentIndexChange(0)}
            className="p-4 mb-3 rounded-lg bg-green-500 text-white hover:bg-green-600 shadow-md transition duration-100"
          >
            Review Deck Again
          </button>
          <Link to={"/"}>
            <button className="p-4 rounded-lg bg-red-500 text-white hover:bg-red-600 shadow-md transition duration-100">
              Close Deck
            </button>
          </Link>
        </div>
      </div>
    );
  } else if (!flashcard) {
    return (
      <div className="relative flex flex-col justify-center items-center mb-4 border border-primary-blue w-72 h-96 rounded-lg shadow-md text-2xl font-semibold text-center">
        <p>No flashcards added</p>
      </div>
    ); // In case no flashcard in deck
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
