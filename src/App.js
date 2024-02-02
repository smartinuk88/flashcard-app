import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import ErrorPage from "./pages/ErrorPage";
import DeckDash from "./pages/DeckDash";
import NotFound from "./pages/NotFound";
import { UserProvider } from "./helpers/Context";

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Dashboard />} errorElement={<ErrorPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route
          path="decks/:deckId"
          element={<DeckDash />}
          errorElement={<ErrorPage />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </UserProvider>
  );
}

export default App;
