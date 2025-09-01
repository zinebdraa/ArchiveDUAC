import { useState } from "react";
import services from "../data/services.json";
import { Combobox } from "@headlessui/react";
import { FaCheck } from "react-icons/fa";
import { HiMiniChevronUpDown } from "react-icons/hi2";

const AddBureau = () => {
  const [name, setName] = useState("");
  const [errName, setErrName] = useState("");
  const [placement, setPlacement] = useState("");
  const [errPlacement, setErrPlacement] = useState("");
  const [creation, setCreation] = useState("");
  const [errCreation, setErrCreation] = useState("");
  const [description, setDescription] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [errSelectedService, setErrSelectedService] = useState("");
  const [query, setQuery] = useState("");

  // Filter services by query
  const filteredServices =
    query === ""
      ? services
      : services.filter((s) =>
          s.name.toLowerCase().includes(query.toLowerCase())
        );

  const handleNameChange = (e) => {
    setName(e.target.value);
    setErrName("");
  };

  const handlePlacementChange = (e) => {
    setPlacement(e.target.value);
    setErrPlacement("");
  };
  const handleCreationChange = (e) => {
    setCreation(e.target.value);
    setErrCreation("");
  };
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedService) setErrSelectedService("Merci d'entrer le nom du service");
    if (!name) setErrName("Merci d'entrer le nom du bureau");
    if (!placement) setErrPlacement("Merci d'entrer le placement du bureau");
    if (!creation)
      setErrCreation("Merci d'entrer la date de création du bureau");

    if (name && placement && creation && selectedService) {
      console.log("Success", {
        name,
        placement,
        creation,
        description,
        service: selectedService,
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
    setQuery("");
  };

  return (
    <div className="m-auto">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        {/* Service Combobox */}
        <div className="flex  items-center ">
          <label htmlFor="service" className="font-medium w-[200px]">
            Service lié <span className="text-red-500">*</span> :
          </label>
          <Combobox value={selectedService} onChange={setSelectedService}>
            <div className="relative w-full">
              <div className="relative cursor-default overflow-hidden rounded-md border border-gray-300 bg-white text-left shadow-sm focus-within:ring-1 focus-within:ring-primary-green sm:text-sm">
                <Combobox.Input
                  id="service"
                  className="w-full border-none py-2 pl-3 pr-10 leading-5 text-gray-900 focus:ring-0"
                  displayValue={(service) => service?.name || ""}
                  onChange={(event) => setQuery(event.target.value)}
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
                              <FaCheck className="h-5 w-5" aria-hidden="true" />
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
              <p className="text-red-500 text-xs block">{errSelectedService}</p>
            )}
        </div>

        {/* Bureau Name */}
        <div>
          <label htmlFor="name" className="font-medium mr-20">
            Nom <span className="text-red-500">*</span> :
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            placeholder="Entrez le nom"
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
            onChange={handlePlacementChange}
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
            onChange={handleCreationChange}
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
            onChange={handleDescriptionChange}
            className="border border-gray-300 rounded p-2 min-w-[250px] focus:outline-none focus:ring-2 focus:ring-primary-green"
          />
        </div>

        <button
          type="submit"
          className="rounded-xl bg-primary-green text-white shadow-2xl font-bold px-7 py-2"
        >
          Ajouter Bureau
        </button>
      </form>
    </div>
  );
};

export default AddBureau;
