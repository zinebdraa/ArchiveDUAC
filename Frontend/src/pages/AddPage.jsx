import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Combobox } from "@headlessui/react";
import { FaCheck, FaArrowLeft } from "react-icons/fa";
import { HiMiniChevronUpDown } from "react-icons/hi2";
import { CgCornerDownLeft } from "react-icons/cg";

import ServiceForm from "./AddService";
import BureauForm from "./AddBureau";
import ChemiseForm from "./AddChemise";
import DocForm from "./AddDoc";
import NavBare from "../components/NavBare";
import SideBar from "../components/SideBar";

const types = [
  { id: 1, value: "service", label: "Service" },
  { id: 2, value: "bureau", label: "Bureau" },
  { id: 3, value: "chemise", label: "Chemise" },
  { id: 4, value: "doc", label: "Document" },
];

const AddPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract type and source from query params
  const params = new URLSearchParams(location.search);
  const initialType = params.get("type") || "";
  const source = params.get("source") || "";

  const [selectedType, setSelectedType] = useState(
    types.find((t) => t.value === initialType) || null
  );
  const [query, setQuery] = useState("");

  const cameFromAjouter = source === "ajouter" || (!source && !initialType);
  const isLocked = Boolean(initialType) && !cameFromAjouter;

  // Filter types based on the scenario
  const getAvailableTypes = () => {
    if (cameFromAjouter) {
      return query === ""
        ? types
        : types.filter((t) =>
            t.label.toLowerCase().includes(query.toLowerCase())
          );
    } else if (initialType) {
      return types.filter((t) => t.value === initialType);
    }
    return types;
  };

  const filteredTypes = getAvailableTypes();

  // Handle back navigation
  const handleGoBack = () => {
    if (!cameFromAjouter) {
      navigate(-1);
    }
  };

  // Render the correct form
  const renderForm = () => {
    switch (selectedType?.value) {
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
    <div className="grid grid-cols-4 h-screen">
      <div className="grid col-span-1 h-screen">
        <SideBar />
      </div>
      <div className="grid col-span-3 overflow-y-auto">
        <div className="flex flex-col">
          <NavBare />
          <div className="w-full flex justify-center items-center m-auto">
            <div className="flex justify-center items-start flex-col w-[80%]">
              {/* Header with optional back button */}
              <div className="flex items-center mb-6">
                {!cameFromAjouter && (
                  <button
                    onClick={handleGoBack}
                    className="mr-4 ml-[-60px] p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
                    title="Retour à la page précédente"
                  >
                    <CgCornerDownLeft className="size-[30px]  border-2 border-primary-green bg-green-4 text-primary-green" />
                  </button>
                )}
                <h1 className="text-4xl font-bold text-primary-green">
                  Remplir le formulaire
                </h1>
              </div>

              <div className="flex items-center mb-7 max-w-sm">
                <label htmlFor="type" className="font-semibold w-[200px]">
                  Ajouter un:
                </label>
                <Combobox
                  value={selectedType}
                  onChange={setSelectedType}
                  disabled={isLocked}
                >
                  <div className="relative w-full">
                    <div className={`relative cursor-default overflow-hidden rounded-md border border-gray-300 bg-white text-left shadow-sm focus-within:ring-1 focus-within:ring-primary-green sm:text-sm ${
                      isLocked ? 'opacity-75 cursor-not-allowed' : ''
                    }`}>
                      <Combobox.Input
                        id="type"
                        className={`w-full border-none py-2 pl-3 pr-10 leading-5 text-gray-900 focus:ring-0 ${
                          isLocked ? 'cursor-not-allowed' : ''
                        }`}
                        displayValue={(type) => type?.label || ""}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="-- Choisir un type --"
                        readOnly={isLocked}
                      />
                      <Combobox.Button 
                        className={`absolute inset-y-0 right-0 flex items-center pr-2 ${
                          isLocked ? 'cursor-not-allowed' : ''
                        }`}
                        disabled={isLocked}
                      >
                        <HiMiniChevronUpDown
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </Combobox.Button>
                    </div>

                    {!isLocked && filteredTypes.length > 0 && (
                      <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10">
                        {filteredTypes.map((type) => (
                          <Combobox.Option
                            key={type.id}
                            value={type}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                active
                                  ? "bg-primary-green text-white"
                                  : "text-gray-900"
                              }`
                            }
                          >
                            {({ selected, active }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected ? "font-medium" : "font-normal"
                                  }`}
                                >
                                  {type.label}
                                </span>
                                {selected && (
                                  <span
                                    className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                      active
                                        ? "text-white"
                                        : "text-primary-green"
                                    }`}
                                  >
                                    <FaCheck
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                )}
                              </>
                            )}
                          </Combobox.Option>
                        ))}
                      </Combobox.Options>
                    )}
                  </div>
                </Combobox>
              </div>

              {renderForm()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPage;