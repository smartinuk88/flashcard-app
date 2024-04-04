import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useRef, useState } from "react";
import { useUser } from "../helpers/Context";
import { Link } from "react-router-dom";
import { Timestamp } from "firebase/firestore";

function Flashcard({
  flashcard,
  onNext,
  deckId,
  currentIndex = null,
  onCurrentIndexChange,
  isNextCard = false,
}) {
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [intervalTimer, setIntervalTimer] = useState(null);

  const {
    userData,
    setUserData,
    pendingFlashcardUpdates,
    setPendingFlashcardUpdates,
    handleFirebaseUpdate,
  } = useUser();
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    if (!isNextCard) {
      setFlipped(!flipped);
    }
  };

  const handleFirebaseUpdateRef = useRef();

  // Store the latest function in the ref
  useEffect(() => {
    handleFirebaseUpdateRef.current = handleFirebaseUpdate;
  }, [handleFirebaseUpdate]);

  const handleReview = useCallback(
    (isCorrect, flashcardId, deckId) => {
      const now = new Date();
      const nowISOString = now.toISOString();

      const isNewDayReview = () => {
        // Determine if the reviewStreak should be incremented
        let lastReviewDate = userData.lastReviewed;

        if (lastReviewDate) {
          // If lastReviewed is a Firestore Timestamp, convert it to a Date object
          if (lastReviewDate.toDate) {
            lastReviewDate = lastReviewDate.toDate();
          } else if (typeof lastReviewDate === "string") {
            // If lastReviewed is an ISO string, parse it to a Date object
            lastReviewDate = new Date(lastReviewDate);
          }
        } else {
          lastReviewDate = null;
        }

        // Check if today is different from the last review date (ignoring time)
        return (
          !lastReviewDate ||
          now.toDateString() !== lastReviewDate.toDateString() ||
          userData.reviewStreak === 0
        );
      };

      // Update user data
      const updatedUserData = {
        ...userData,
        reviewStreak: isNewDayReview()
          ? userData.reviewStreak + 1
          : userData.reviewStreak,
        cardsReviewed: userData.cardsReviewed + 1,
        lastReviewed: nowISOString,
      };

      setUserData(updatedUserData);

      // Calculate new strength level of the flashcard
      const strengthChange = isCorrect ? 1 : -1;
      const existingStrength =
        pendingFlashcardUpdates?.[deckId]?.[flashcardId]?.strength ?? 0;
      let newStrength = existingStrength + strengthChange;
      // Ensure newStrength is within limits of 0 and 5
      newStrength = Math.max(0, Math.min(newStrength, 5));

      // Update pendingFlashcardUpdate state
      const updatedFlashcardUpdates = {
        ...pendingFlashcardUpdates,
        [deckId]: {
          ...pendingFlashcardUpdates[deckId],
          [flashcardId]: {
            strength: newStrength,
            lastReviewed: nowISOString,
          },
        },
      };

      setPendingFlashcardUpdates(updatedFlashcardUpdates);

      // Update to local storage
      const pendingUpdates = {
        userData: updatedUserData,
        flashcardUpdates: updatedFlashcardUpdates,
      };
      localStorage.setItem("pendingUpdates", JSON.stringify(pendingUpdates));
      console.log("Local storage items set");

      // Progress to next flashcard
      onNext();

      // Clear existing debounce timer and set a new one
      clearTimeout(debounceTimer);
      const newDebounceTimer = setTimeout(() => {
        handleFirebaseUpdateRef.current();
      }, 15000); // 15 seconds debounce
      setDebounceTimer(newDebounceTimer);
    },
    [debounceTimer]
  );

  // Set up regular interval update
  useEffect(() => {
    const newIntervalTimer = setInterval(() => {
      handleFirebaseUpdateRef.current();
    }, 90000); // 90 second interval
    setIntervalTimer(newIntervalTimer);

    // Cleanup function to clear timers
    return () => {
      clearTimeout(debounceTimer);
      clearInterval(newIntervalTimer);
    };
  }, [debounceTimer]);

  if (currentIndex === -1 && !flashcard) {
    return (
      <div className="relative flex flex-col justify-between items-center mb-4 border border-primary-blue w-72 h-96 rounded-lg shadow-md text-xl font-semibold text-center py-8">
        <p>Review Session Finished!</p>
        <div className="flex flex-col">
          <button
            onClick={() => onCurrentIndexChange(0)}
            className="p-4 mb-3 rounded-lg bg-green-500 text-white text-sm hover:bg-green-600 shadow-md transition duration-100"
          >
            Review Deck Again
          </button>

          <Link to={"/"}>
            <button className="p-4 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 shadow-md transition duration-100">
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
            onClick={() => handleReview(true, flashcard.id, deckId)}
          />
          <FontAwesomeIcon
            className="text-red-600 cursor-pointer"
            icon={faXmark}
            onClick={() => handleReview(false, flashcard.id, deckId)}
          />
        </div>
      )}
    </div>
  );
}

export default Flashcard;
