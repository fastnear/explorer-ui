import { useState } from "react";
import Logo from "/app.png";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <a
        href="https://fastnear.com"
        target="_blank"
        className="flex items-center justify-center"
      >
        <img src={Logo} className="logo" alt="FASTNEAR logo" />
      </a>
      <h1 className="text-7xl font-bold">FA{"A".repeat(count)}STNEAR</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>FASTER!</button>
      </div>
    </>
  );
}

export default App;
