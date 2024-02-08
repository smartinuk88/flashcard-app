import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { useUser } from "../helpers/Context";

function UserStats() {
  const { userData } = useUser();

  return (
    <div className="grid md:grid-cols-5 items-start w-full rounded-lg  shadow-md mb-20">
      <div className="md:col-span-3 bg-gradient-to-tl from-primary-blue to-secondary-blue h-full p-10">
        <p className="text-2xl">Keep it up,</p>
        <p className="text-8xl font-extrabold text-white">
          {userData.displayName}
        </p>
      </div>
      <div className="md:col-span-2 flex items-center justify-between md:flex-col md:items-start md:justify-center p-10 md:space-y-8 bg-white h-full border border-primary-blue">
        <div className="flex items-center space-x-1">
          <p className="text-lg md:text-xl">Current Streak: </p>
          <p className="text-primary-blue text-4xl md:text-5xl font-bold">
            {userData.reviewStreak}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <p className="text-lg md:text-xl">Total Cards Reviewed: </p>
          <p className="text-primary-blue text-4xl md:text-5xl font-bold">
            {userData.cardsReviewed}
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserStats;
