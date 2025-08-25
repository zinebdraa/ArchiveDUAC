import { useEffect, useState } from "react";
import "./App.css";
import Login from "./Account/Login";
import SideBar from "./components/SideBar";

function App() {
  const [pong, setPong] = useState("");

  useEffect(() => {
    if (window.api?.ping) {
      window.api.ping().then(setPong);
    }
  }, []);

  return (
    <>
      {/* <div className="bg-black bold text-red-500 ">
        <h1>Electron + React + Vite</h1>
        <p>IPC test: {pong}</p>
      </div> */}
      {/* <Login/> */}
      <SideBar/>
    </>
  );
}

export default App;
