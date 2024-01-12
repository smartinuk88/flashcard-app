import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
function UserStats() {
  return (
    <div className="grid md:grid-cols-2 items-start w-full  shadow-md rounded-xl mb-20">
      <div className="bg-gradient-to-tl from-primary-blue to-secondary-blue h-full p-10">
        <p className="text-2xl">Keep it up,</p>
        <p className="text-8xl font-extrabold text-white">Scott</p>
      </div>
      <div className="flex flex-col p-10 space-y-8 bg-white h-full border border-primary-blue">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2 items-center">
            <p className="text-lg">Current Streak</p>
            <p className="text-primary-blue text-4xl font-bold">15</p>
          </div>
          <div className="flex space-x-2 items-center">
            <p className="text-lg">Total Cards Reviewed</p>
            <p className="text-primary-blue text-4xl font-bold">1508</p>
          </div>
        </div>
        <div className="">
          <p className="text-lg mb-2">Last 30 days</p>
          <div className="grid grid-cols-7 gap border-primary-blue bg-white">
            {Array(30).fill(
              <div>
                <FontAwesomeIcon
                  className="text-xl text-secondary-blue"
                  icon={faCircleCheck}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserStats;
