import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import ErrorPage from "./pages/ErrorPage";
import DeckDash from "./pages/DeckDash";
import NotFound from "./pages/NotFound";
import { UserProvider, useUser } from "./helpers/Context";
import PrivateRoute from "./components/PrivateRoute";
import AutosaveComponent from "./components/AutosaveComponent";

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
          errorElement={<ErrorPage />}
        />
        <Route path="/signin" element={<SignIn />} />
        <Route
          path="decks/:deckId"
          element={
            <PrivateRoute>
              <DeckDash />
            </PrivateRoute>
          }
          errorElement={<ErrorPage />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </UserProvider>
  );
}

export default App;
