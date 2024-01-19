import DeckList from "../components/DeckList";
import Footer from "../components/Footer";
import Header from "../components/Header";
import UserStats from "../components/UserStats";

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
