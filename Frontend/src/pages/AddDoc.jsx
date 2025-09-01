// AddDoc.jsx
import { useState } from "react";
import services from "../data/services.json";
import bureaux from "../data/bureaux.json";
import chemises from "../data/chemises.json";
import { Combobox } from "@headlessui/react";
import { FaCheck } from "react-icons/fa";
import { HiMiniChevronUpDown } from "react-icons/hi2";

const AddDoc = () => {
  const [name, setName] = useState("");
  const [errName, setErrName] = useState("");
  const [placement, setPlacement] = useState("");
  const [errPlacement, setErrPlacement] = useState("");
  const [creation, setCreation] = useState("");
  const [errCreation, setErrCreation] = useState("");
  const [description, setDescription] = useState("");

  const [selectedService, setSelectedService] = useState(null);
  const [errSelectedService, setErrSelectedService] = useState("");
  const [selectedBureau, setSelectedBureau] = useState(null);
  const [errSelectedBureau, setErrSelectedBureau] = useState("");
  const [selectedChemise, setSelectedChemise] = useState(null);
  const [errSelectedChemise, setErrSelectedChemise] = useState("");

  const [serviceQuery, setServiceQuery] = useState("");
  const [bureauQuery, setBureauQuery] = useState("");
  const [chemiseQuery, setChemiseQuery] = useState("");

  // Filter services
  const filteredServices =
    serviceQuery === ""
      ? services
      : services.filter((s) =>
          s.name.toLowerCase().includes(serviceQuery.toLowerCase())
        );

  // Filter bureaux of the selected service
  const bureauxOfService = selectedService
    ? bureaux.filter((b) => b.serviceId === selectedService.id)
    : [];

  const filteredBureaux =
    bureauQuery === ""
      ? bureauxOfService
      : bureauxOfService.filter((b) =>
          b.name.toLowerCase().includes(bureauQuery.toLowerCase())
        );

  // Filter chemises of the selected bureau
  const chemisesOfBureau = selectedBureau
    ? chemises.filter((c) => c.bureauId === selectedBureau.id)
    : [];

  const filteredChemises =
    chemiseQuery === ""
      ? chemisesOfBureau
      : chemisesOfBureau.filter((c) =>
          c.name.toLowerCase().includes(chemiseQuery.toLowerCase())
        );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedService) setErrSelectedService("Merci de choisir un service");
    if (!selectedBureau) setErrSelectedBureau("Merci de choisir un bureau");
    if (!selectedChemise) setErrSelectedChemise("Merci de choisir une chemise");
    if (!name) setErrName("Merci d'entrer le nom du document");
    if (!placement)
      setErrPlacement("Merci d'entrer le placement du document");
    if (!creation)
      setErrCreation("Merci d'entrer la date de création du document");

    if (
      name &&
      placement &&
      creation &&
      selectedService &&
      selectedBureau &&
      selectedChemise
    ) {
      console.log("✅ Success", {
        name,
        placement,
        creation,
        description,
        service: selectedService,
        bureau: selectedBureau,
        chemise: selectedChemise,
      });
      clearForm();
    }
  };

  const clearForm = () => {
    setName("");
    setErrName("");
    setPlacement("");
    setErrPlacement("");
    setCreation("");
    setErrCreation("");
    setDescription("");
    setSelectedService(null);
    setSelectedBureau(null);
    setSelectedChemise(null);
    setServiceQuery("");
    setBureauQuery("");
    setChemiseQuery("");
  };

  return (
    <div className="m-auto">
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        {/* Service Combobox */}
        <div className="flex  gap-1">
          <div className="flex items-center max-w-sm">
            <label htmlFor="service" className="font-medium w-[150px]">
              Service lié <span className="text-red-500">*</span> :
            </label>
            <Combobox
              value={selectedService}
              onChange={(s) => {
                setSelectedService(s);
                setErrSelectedService(""); // ✅ clear error on select
                setSelectedBureau(null);
                setSelectedChemise(null);
              }}
            >
              <div className="relative w-full">
                <div className="relative cursor-default overflow-hidden rounded-md border border-gray-300 bg-white text-left shadow-sm focus-within:ring-1 focus-within:ring-primary-green sm:text-sm">
                  <Combobox.Input
                    id="service"
                    className="w-full border-none py-2 pl-3 pr-10 leading-5 text-gray-900 focus:ring-0"
                    displayValue={(service) => service?.name || ""}
                    onChange={(event) => setServiceQuery(event.target.value)}
                    placeholder="-- Choisir un service --"
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <HiMiniChevronUpDown
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </Combobox.Button>
                </div>
                {filteredServices.length > 0 && (
                  <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10">
                    {filteredServices.map((service) => (
                      <Combobox.Option
                        key={service.id}
                        value={service}
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
                              {service.name}
                            </span>
                            {selected && (
                              <span
                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                  active ? "text-white" : "text-primary-green"
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
            {errSelectedService && (
              <p className="text-red-500 text-xs">{errSelectedService}</p>
            )}
          </div>

          {/* Bureau Combobox */}
          {selectedService && (
            <div className="flex items-center max-w-sm">
              <label htmlFor="bureau" className="font-medium w-[150px]">
                Bureau lié <span className="text-red-500">*</span> :
              </label>
              <Combobox
                value={selectedBureau}
                onChange={(b) => {
                  setSelectedBureau(b);
                  setErrSelectedBureau(""); // ✅ clear error on select
                  setSelectedChemise(null);
                }}
              >
                <div className="relative w-full">
                  <div className="relative cursor-default overflow-hidden rounded-md border border-gray-300 bg-white text-left shadow-sm focus-within:ring-1 focus-within:ring-primary-green sm:text-sm">
                    <Combobox.Input
                      id="bureau"
                      className="w-full border-none py-2 pl-3 pr-10 leading-5 text-gray-900 focus:ring-0"
                      displayValue={(bureau) => bureau?.name || ""}
                      onChange={(event) => setBureauQuery(event.target.value)}
                      placeholder="-- Choisir un bureau --"
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <HiMiniChevronUpDown
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </Combobox.Button>
                  </div>
                  {filteredBureaux.length > 0 && (
                    <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10">
                      {filteredBureaux.map((bureau) => (
                        <Combobox.Option
                          key={bureau.id}
                          value={bureau}
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
                                {bureau.name}
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
              {errSelectedBureau && (
                <p className="text-red-500 text-xs">{errSelectedBureau}</p>
              )}
            </div>
          )}

          {/* Chemise Combobox */}
          {selectedBureau && (
            <div className="flex items-center max-w-sm">
              <label htmlFor="chemise" className="font-medium w-[150px]">
                Chemise liée <span className="text-red-500">*</span> :
              </label>
              <Combobox
                value={selectedChemise}
                onChange={(c) => {
                  setSelectedChemise(c);
                  setErrSelectedChemise(""); // ✅ clear error on select
                }}
              >
                <div className="relative w-full">
                  <div className="relative cursor-default overflow-hidden rounded-md border border-gray-300 bg-white text-left shadow-sm focus-within:ring-1 focus-within:ring-primary-green sm:text-sm">
                    <Combobox.Input
                      id="chemise"
                      className="w-full border-none py-2 pl-3 pr-10 leading-5 text-gray-900 focus:ring-0"
                      displayValue={(chemise) => chemise?.name || ""}
                      onChange={(event) => setChemiseQuery(event.target.value)}
                      placeholder="-- Choisir une chemise --"
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <HiMiniChevronUpDown
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </Combobox.Button>
                  </div>
                  {filteredChemises.length > 0 && (
                    <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10">
                      {filteredChemises.map((chemise) => (
                        <Combobox.Option
                          key={chemise.id}
                          value={chemise}
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
                                {chemise.name}
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
              {errSelectedChemise && (
                <p className="text-red-500 text-xs">{errSelectedChemise}</p>
              )}
            </div>
          )}
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="font-medium mr-20">
            Nom <span className="text-red-500">*</span> :
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrName(""); // ✅ clear error on typing
            }}
            placeholder="Entrez le nom du document"
            className="border border-gray-300 rounded p-2 min-w-[250px] focus:outline-none focus:ring-2 focus:ring-primary-green"
          />
          {errName && <p className="text-red-500 text-xs">{errName}</p>}
        </div>

        {/* Placement */}
        <div>
          <label htmlFor="placement" className="font-medium mr-5">
            Archivé dans <span className="text-red-500">*</span> :
          </label>
          <input
            type="text"
            id="placement"
            value={placement}
            onChange={(e) => {
              setPlacement(e.target.value);
              setErrPlacement(""); // ✅ clear error on typing
            }}
            placeholder="Entrez son emplacement"
            className="border border-gray-300 rounded p-2 min-w-[250px] focus:outline-none focus:ring-2 focus:ring-primary-green"
          />
          {errPlacement && (
            <p className="text-red-500 text-xs">{errPlacement}</p>
          )}
        </div>

        {/* Creation Date */}
        <div>
          <label htmlFor="creation" className="font-medium mr-16">
            Créé le <span className="text-red-500">*</span> :
          </label>
          <input
            type="date"
            id="creation"
            value={creation}
            onChange={(e) => {
              setCreation(e.target.value);
              setErrCreation(""); // ✅ clear error on typing
            }}
            className="border border-gray-300 rounded p-2 min-w-[250px] focus:outline-none focus:ring-2 focus:ring-primary-green"
          />
          {errCreation && <p className="text-red-500 text-xs">{errCreation}</p>}
        </div>

        {/* Description */}
        <div className="flex items-center">
          <label htmlFor="description" className="font-medium mr-10">
            Description :
          </label>
          <textarea
            id="description"
            placeholder="Une petite description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 rounded p-2 min-w-[250px] focus:outline-none focus:ring-2 focus:ring-primary-green"
          />
        </div>

        <button
          type="submit"
          className="rounded-xl bg-primary-green text-white shadow-2xl font-bold px-7 py-2"
        >
          Ajouter Document
        </button>
      </form>
    </div>
  );
};

export default AddDoc;
