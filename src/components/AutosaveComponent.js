import { useEffect } from "react";
import { useUser } from "../helpers/Context";

function AutosaveComponent() {
  const { handleFirebaseUpdate, pendingFlashcardUpdates } = useUser();

  useEffect(() => {
    const autosaveInterval = setInterval(() => {
      if (
        pendingFlashcardUpdates &&
        Object.keys(pendingFlashcardUpdates).length > 0
      ) {
        console.log("Autosave triggered");
        handleFirebaseUpdate();
      }
    }, 1000 * 60 * 5); // Autosave every 5 minutes

    return () => clearInterval(autosaveInterval);
  }, [pendingFlashcardUpdates, handleFirebaseUpdate]);

  return null; // This component doesn't render anything
}

export default AutosaveComponent;
