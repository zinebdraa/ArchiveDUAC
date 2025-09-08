import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Account/Login";
import SideBar from "./components/SideBar";
import NavBare from "./components/NavBare";
import Service from "./pages/Service";
import Bureaux from "./pages/Bureaux";
import AddService from "./pages/AddService";
import AddPage from "./pages/AddPage";
import ResetPassword from "./Account/ResetPassword";
import NewPassword from "./Account/NewPassword";
import Chemise from "./pages/Chemise";
import Document from "./pages/Document";
import Parametre from "./pages/Parametre";
import EditService from "./pages/EditService";
import EditBureau from "./pages/EditBureau";
import EditChemise from "./pages/EditChemise";
import EditDocument from "./pages/EditDocument";
import Test from "./test";

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
        <Route path="/" element={<Login />} />
        <Route path="/services" element={<Service />} />
        <Route path="/editService/:serviceId" element={<EditService />} />
        <Route path="/bureaux" element={<Bureaux />} />
        <Route path="/editBureau/:bureauId" element={<EditBureau />} />
        <Route path="/bureaux/:serviceId" element={<Bureaux />} />
        <Route path="/addPage" element={<AddPage />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/newPassword" element={<NewPassword />} />
        <Route path="/chemise" element={<Chemise />} />
        <Route path="/chemise/:bureauId" element={<Chemise />} />
        <Route path="/editChemise/:chemiseID" element={<EditChemise />} />
        <Route path="/document" element={<Document />} />
        <Route path="/document/:chemiseId" element={<Document />} />
        <Route path="/editDocument/:documentId" element={<EditDocument />} />
        <Route path="/parametre" element={<Parametre />} />
      </Routes>
      {/* <Test/> */}
    </>
  );
}

export default App;
