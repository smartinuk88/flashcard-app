function StatSummary() {
  return (
    <div className="grid grid-cols-2 justify-between items-start my-4 p-8 bg-primary-blue rounded-xl">
      <div>
        <p className="text-2xl">Keep it up,</p>
        <p className="text-6xl font-extrabold text-white">Scott</p>
      </div>
      <div className="min-w-3/5 max-w-lg">
        <div className="flex flex-col items-center">
          <p className="text-lg">Current Streak</p>
          <p className="text-white text-4xl font-bold">15</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-lg">Total Cards Reviewed</p>
          <p className="text-white text-4xl font-bold">1508</p>
        </div>
      </div>
    </div>
  );
}

export default StatSummary;
