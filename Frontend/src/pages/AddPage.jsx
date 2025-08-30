// src/pages/AddPage.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ServiceForm from "./AddService";
import BureauForm from "./AddBureau";
import NavBare from "../components/NavBare";
import SideBar from "../components/SideBar";
// import ChemiseForm from "../forms/ChemiseForm";
// import DocForm from "../forms/DocForm";

const AddPage = () => {
  const location = useLocation();

  // Extract type from query params (ex: /add?type=service)
  const params = new URLSearchParams(location.search);
  const initialType = params.get("type") || "";

  const [selectedType, setSelectedType] = useState(initialType);

  // If user came from a specific tab, lock dropdown
  const isLocked = Boolean(initialType);

  // Render the correct form
  const renderForm = () => {
    switch (selectedType) {
      case "service":
        return <ServiceForm />;
      case "bureau":
        return <BureauForm />;
      case "chemise":
        return <ChemiseForm />;
      case "doc":
        return <DocForm />;
      default:
        return <p className="text-gray-500">Please select a type.</p>;
    }
  };

  return (
    <div className="grid grid-cols-4">
      <div className="grid col-span-1">
        <SideBar />
      </div>
      <div className="grid col-span-3">
        <div className="flex flex-col">
          <NavBare  />
          <div className="flex justify-start items-center my-auto ml-8">
            {/* {serviceId && (
              <Link to="/services">
                <CgCornerDownLeft className="size-[30px]  border-2 border-primary-green bg-green-4 text-primary-green" />
              </Link>
            )} */}
            <h1 className="text-xl font-bold mb-4">Ajouter</h1>

            {/* Dropdown to select type */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              disabled={isLocked}
              className="border p-2 rounded mb-6"
            >
              <option value="">-- Choisir un type --</option>
              <option value="service">Service</option>
              <option value="bureau">Bureau</option>
              <option value="chemise">Chemise</option>
              <option value="doc">Document</option>
            </select>

            {/* Dynamic form */}
            {renderForm()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPage;
