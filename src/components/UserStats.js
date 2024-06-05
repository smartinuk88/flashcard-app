import { useUser } from "../helpers/Context";

function UserStats() {
  const { userData } = useUser();

  const getFirstName = (displayName, maxLength = 12) => {
    // Extract the first name up to the first space
    const firstName = displayName.match(/^[^\s]+/)[0];
    // Return the first name, truncated to the maxLength if necessary
    return firstName.length > maxLength
      ? `${firstName.substring(0, maxLength)}...`
      : firstName;
  };

  const firstName = userData.displayName
    ? getFirstName(userData.displayName)
    : "User";

  return (
    <div className="grid md:grid-cols-5 items-start w-full shadow-md mb-20 overflow-hidden">
      <div className="md:col-span-3 bg-one md:h-full p-10 max-w-full">
        <p className="text-2xl">Keep it up,</p>
        <p className="text-6xl lg:text-8xl font-extrabold text-white break-words">
          {firstName}
        </p>
      </div>
      <div className="md:col-span-2 space-x-8 md:space-x-0 flex items-center justify-between md:flex-col md:items-start md:justify-center p-10 md:space-y-8 bg-white h-full border border-one">
        <div className="flex items-center space-x-1">
          <p className="text-lg md:text-xl">Current Streak: </p>
          <p className="text-one text-4xl md:text-5xl font-bold">
            {userData.reviewStreak}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <p className="text-lg md:text-xl">Total Cards Reviewed: </p>
          <p className="text-one text-4xl md:text-5xl font-bold">
            {userData.cardsReviewed}
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserStats;
