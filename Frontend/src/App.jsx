import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Account/Login";
import SideBar from "./components/SideBar";
import NavBare from "./components/NavBare";
import Service from "./pages/Service";

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
      {/* <SideBar/> */}
      {/* <NavBare/> */}
      {/* <Service/> */}
      
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/services" element={<Service />} />
        {/* <Route path="/bureaus" element={<Bureaus />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} /> */}
      </Routes>
    
    </>
  );
}

export default App;
