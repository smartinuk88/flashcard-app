import { useEffect, useState } from "react";
import { auth, provider, signInWithGoogle } from "./firebase-config";

function App() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <button className="block" onClick={signInWithGoogle}>
        Sign In
      </button>
      <button className="block">Sign Out</button>
    </div>
  );
}

export default App;
