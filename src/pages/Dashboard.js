import DeckList from "../components/DeckList";
import Footer from "../components/Footer";
import Header from "../components/Header";
import UserStats from "../components/UserStats";
import { useUser } from "../helpers/Context";

function Dashboard() {
  const { loading, authUser, userData } = useUser();
  if (loading || !authUser || !userData) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow mx-auto px-5 sm:px-10 max-w-7xl h-full mt-1 sm:mt-2 mb-8 sm:mb-11">
        <UserStats />
        <DeckList />
      </main>
      <Footer />
    </div>
  );
}

export default Dashboard;
