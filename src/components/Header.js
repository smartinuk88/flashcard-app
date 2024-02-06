import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useUser } from "../helpers/Context";

function Header() {
  const { userData, handleSignOut } = useUser();

  return (
    <header className="sticky flex justify-between items-center w-full h-12 px-6 py-3 bg-white">
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
    </header>
  );
}

export default Header;
