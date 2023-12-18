import { useEffect, useState } from "react";
import { auth, handleSignInWithGoogle, handleSignOut } from "./firebase-config";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });

    return () => {
      listen();
    };
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <button className="block" onClick={handleSignInWithGoogle}>
        Sign In
      </button>
      <button className="block" onClick={handleSignOut}>
        Sign Out
      </button>
      <p>{authUser ? `Signed In as ${authUser.email}` : "Signed Out"}</p>
    </div>
  );
}

export default App;
