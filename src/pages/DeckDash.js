import { useLocation } from "react-router-dom";

function DeckDash() {
  const { state } = useLocation();
  return (
    <div>
      <h1>DeckDash</h1>
      <p>{state.title}</p>
      <p>{state.description}</p>
      {state.collection.map((card) => (
        <p>{card}</p>
      ))}
    </div>
  );
}

export default DeckDash;
