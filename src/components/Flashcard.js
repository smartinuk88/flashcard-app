import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useState } from "react";
import { useUser } from "../helpers/Context";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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
    userDeckData,
    setUserDeckData,
    pendingFlashcardUpdates,
    setPendingFlashcardUpdates,
    handleFirebaseUpdate,
    debounceTimer,
    setDebounceTimer,
    handleFirebaseUpdateRef,
  } = useUser();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFlip = () => {
    if (!isNextCard && !isAnimating) {
      setIsFlipped(!isFlipped);
      setIsAnimating(true);
    }
  };

  // Store the latest function in the ref
  useEffect(() => {
    handleFirebaseUpdateRef.current = handleFirebaseUpdate;
  }, [handleFirebaseUpdate]);

  const handleReview = useCallback(
    (isCorrect, flashcardId, deckId, event) => {
      event.stopPropagation();

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
      const flashcardFromDeckData = userDeckData
        .find((deck) => deck.id === deckId)
        ?.flashcards.find((flashcard) => flashcard.id === flashcardId);

      const existingStrength = flashcardFromDeckData
        ? flashcardFromDeckData.strength
        : 0;
      let newStrength = existingStrength + strengthChange;
      // Ensure newStrength is within limits of 0 and 5
      newStrength = Math.max(0, Math.min(newStrength, 5));

      // Update userDeckData with the new strength for the current session
      const updatedDeckData = userDeckData.map((deck) => {
        if (deck.id === deckId) {
          return {
            ...deck,
            flashcards: deck.flashcards.map((flashcard) => {
              if (flashcard.id === flashcardId) {
                console.log({
                  ...flashcard,
                  strength: newStrength,
                  lastReviewed: nowISOString,
                });
                return {
                  ...flashcard,
                  strength: newStrength,
                  lastReviewed: nowISOString,
                };
              }
              return flashcard;
            }),
          };
        }
        return deck;
      });

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

      setUserDeckData(updatedDeckData);
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
    [debounceTimer, setDebounceTimer]
  );

  return (
    <div
      onClick={handleFlip}
      className={`flip-card flex flex-col justify-center items-center mb-4 w-72 h-96 rounded-lg cursor-pointer text-2xl font-semibold text-center ${
        isNextCard ? "z-0 absolute top-2 right-1" : "z-10 relative"
      }`}
    >
      <motion.div
        className="flip-card-inner w-[100%] h-[100%] shadow-md border border-primary-blue bg-white rounded-lg"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, animationDirection: "normal" }}
        onAnimationComplete={() => setIsAnimating(false)}
      >
        {/* Front face of the card */}
        <div className="flip-card-front flex items-center justify-center w-[100%] h-[100%]">
          <p className="text-xl font-semibold p-4">{flashcard.front}</p>
        </div>

        {/* Back face of the card */}
        <div className="flip-card-back flex items-center justify-center w-[100%] h-[100%]">
          <p className="text-xl font-semibold p-4">{flashcard.back}</p>

          {!isNextCard && (
            <div className="absolute bottom-0 w-full flex justify-between p-4">
              <FontAwesomeIcon
                className="text-green-600 cursor-pointer"
                icon={faCheck}
                onClick={(event) =>
                  handleReview(true, flashcard.id, deckId, event)
                }
              />
              <FontAwesomeIcon
                className="text-red-600 cursor-pointer"
                icon={faXmark}
                onClick={(event) =>
                  handleReview(false, flashcard.id, deckId, event)
                }
              />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default Flashcard;
