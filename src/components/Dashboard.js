import DeckList from "./DeckList";
import Footer from "./Footer";
import Header from "./Header";
import UserStats from "./UserStats";

function Dashboard() {
  return (
    <div className="bg-white">
      <Header />
      <main className="mx-auto px-10 max-w-7xl mt-4 mb-8">
        <UserStats />
        <DeckList />
      </main>
      <Footer />
    </div>
  );
}

export default Dashboard;
