import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useUser } from "../helpers/Context";

function Header() {
  const { userData, handleSignOut, streakLostMessage } = useUser();

  return (
    <header className="sticky w-full h-14 bg-white">
      <div className="flex justify-between items-center px-6 pt-3 pb-1">
        <Link to={"/"}>
          <p className="text-3xl">
            Flash<span className="font-bold text-primary-blue">Fluent</span>
          </p>
        </Link>

        <p className="hidden md:block">
          Welcome back,{" "}
          <span className="text-primary-blue">{userData.displayName}</span>
        </p>

        <div className="flex space-x-2 justify-between items-center">
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
      <p className="text-center font-semibold bg-red-500 text-white">
        {streakLostMessage}
      </p>
    </header>
  );
}

export default Header;
