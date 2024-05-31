import { useState } from "react";
import Logo from "/app.png";
import "./App.scss";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://fastnear.com" target="_blank">
          <img src={Logo} className="logo" alt="FASTNEAR logo" />
        </a>
      </div>
      <h1>FA{"A".repeat(count)}STNEAR</h1>
      <div>
        <button
          className="btn btn-primary"
          onClick={() => setCount((count) => count + 1)}
        >
          FASTER!
        </button>
      </div>
    </>
  );
}

export default App;
