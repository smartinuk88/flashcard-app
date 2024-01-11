import StatSummary from "./StatSummary";
import StreakList from "./StreakList";
function UserStats() {
  return (
    <div className="flex flex-col items-center m-8">
      <StreakList />
      <StatSummary />
    </div>
  );
}

export default UserStats;
