import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function StreakList() {
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <div className="flex justify-around w-2/5 py-6 px-8 rounded-xl bg-gradient-to-tl from-primary-blue to-secondary-blue shadow-sm">
      {daysOfWeek.map((day) => (
        <div className="flex flex-col items-center justify-center space-y-2">
          <p>{day}</p>
          <FontAwesomeIcon className="text-xl" icon={faCircleCheck} />
        </div>
      ))}
    </div>
  );
}

export default StreakList;
