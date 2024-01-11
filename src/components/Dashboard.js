import DeckList from "./DeckList";
import Header from "./Header";
import UserStats from "./UserStats";

function Dashboard() {
  return (
    <div className="bg-white">
      <Header />
      <main className="m-w-6xl mx-auto">
        <UserStats />
        <DeckList />
      </main>
    </div>
  );
}

export default Dashboard;
