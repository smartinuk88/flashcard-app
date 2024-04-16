import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useUser } from "../helpers/Context";

function Header() {
  const {
    userData,
    pendingFlashcardUpdates,
    handleSignOut,
    handleFirebaseUpdate,
    streakLostMessage,
    dataSyncMessage,
  } = useUser();

  return (
    <header className="sticky w-full h-14 pt-1 bg-white">
      <div className="flex justify-between items-center px-6">
        <Link to={"/"}>
          <p className="text-3xl">
            Flash<span className="font-bold text-primary-blue">Fluent</span>
          </p>
        </Link>

        <div>
          <p
            className={`text-center font-semibold ${
              dataSyncMessage.success ? "text-green-500" : "text-red-500"
            }`}
          >
            {dataSyncMessage.message}
          </p>
        </div>

        <div className="flex space-x-2 justify-between items-center">
          {Object.keys(pendingFlashcardUpdates).length ? (
            <FontAwesomeIcon
              onClick={() => handleFirebaseUpdate()}
              className="cursor-pointer"
              icon={faFloppyDisk}
            />
          ) : null}
          <p>
            <FontAwesomeIcon icon={faFire} /> {userData.reviewStreak}
          </p>
          <button
            className="font-bold border rounded-full py-1 px-4"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
      </div>
      <p className="text-center font-semibold text-white bg-red-500">
        {streakLostMessage}
      </p>
    </header>
  );
}

export default Header;
