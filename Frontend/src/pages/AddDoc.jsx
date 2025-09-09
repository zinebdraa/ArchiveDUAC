import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Combobox } from "@headlessui/react";
import { FaCheck } from "react-icons/fa";
import { HiMiniChevronUpDown } from "react-icons/hi2";

const AddDoc = () => {
  const token = localStorage.getItem("token");

  const [services, setServices] = useState([]);
  const [bureaux, setBureaux] = useState([]);
  const [chemises, setChemises] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingBureaux, setLoadingBureaux] = useState(false);
  const [loadingChemise, setLoadingChemise] = useState(false);

  const [document_name, setName] = useState("");
  const [errName, setErrName] = useState("");
  const [document_place, setPlacement] = useState("");
  const [errPlacement, setErrPlacement] = useState("");
  const [dCreatedDate, setCreation] = useState("");
  const [errCreation, setErrCreation] = useState("");
  const [dDescription, setDescription] = useState("");
  const [document, setFile] = useState(null);
  const [errFile, setErrFile] = useState("");

  const [selectedService, setSelectedService] = useState(null);
  const [errSelectedService, setErrSelectedService] = useState("");
  const [selectedBureau, setSelectedBureau] = useState(null);
  const [errSelectedBureau, setErrSelectedBureau] = useState("");
  const [selectedChemise, setSelectedChemise] = useState(null);
  const [errSelectedChemise, setErrSelectedChemise] = useState("");

  const [serviceQuery, setServiceQuery] = useState("");
  const [bureauQuery, setBureauQuery] = useState("");
  const [chemiseQuery, setChemiseQuery] = useState("");
  const fileInputRef = useRef(null);

  // Fetching Data
  useEffect(() => {
    fetchServices();
  }, []);

  // Fetch bureaux when a service is selected
  useEffect(() => {
    if (selectedService) {
      fetchBureaux(selectedService.id_service);
    } else {
      setBureaux([]);
    }
  }, [selectedService]);

  // Fetch chemise when a bureau is selected
  useEffect(() => {
    if (selectedBureau) {
      fetchChemises(selectedBureau.id_bureau);
    } else {
      setChemises([]); 
    }
  }, [selectedBureau]);

  const fetchServices = async () => {
    try {
      setLoadingServices(true);
      const response = await axios.get("http://localhost:3001/api/services", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setServices(response.data);
    } catch (err) {
      console.error("Error fetching services:", err);
      setError("Impossible de charger les services. Réessayez plus tard.");
    } finally {
      setLoadingServices(false);
    }
  };

  const fetchBureaux = async (serviceId) => {
    try {
      setLoadingBureaux(true);
      const response = await axios.get(`http://localhost:3001/api/bureaus`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Filter bureaux by service_id on the client side
      const filteredBureaux = response.data.filter(
        (bureau) => bureau.service_id === serviceId
      );
      setBureaux(filteredBureaux);
    } catch (err) {
      console.error("Error fetching bureaux:", err);
      setError("Impossible de charger les bureaux. Réessayez plus tard.");
      setBureaux([]);
    } finally {
      setLoadingBureaux(false);
    }
  };

  const fetchChemises = async (bureauId) => {
    try {
      setLoadingChemise(true);
      const response = await axios.get(`http://localhost:3001/api/chemises`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Filter chemises by service_id on the client side
      const filteredChemises = response.data.filter(
        (chemise) => chemise.bureau_id === bureauId
      );
      setChemises(filteredChemises);
    } catch (err) {
      console.error("Error fetching chemises:", err);
      setError("Impossible de charger les chemises. Réessayez plus tard.");
      setChemises([]);
    } finally {
      setLoadingChemise(false);
    }
  };

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

  const chemisesOfBureau = selectedBureau
    ? chemises.filter((c) => c.bureau_id === selectedBureau.id_bureau)
    : [];

  const filteredChemises =
    chemiseQuery === ""
      ? chemisesOfBureau
      : chemisesOfBureau.filter((c) =>
          c.chemise_name.toLowerCase().includes(chemiseQuery.toLowerCase())
        );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedService) setErrSelectedService("Merci de choisir un service");
    if (!selectedBureau) setErrSelectedBureau("Merci de choisir un bureau");
    if (!selectedChemise) setErrSelectedChemise("Merci de choisir une chemise");
    if (!document_name) setErrName("Merci d'entrer le nom du document");
    if (!document_place)
      setErrPlacement("Merci d'entrer le placement du document");
    if (!dCreatedDate)
      setErrCreation("Merci d'entrer la date de création du document");
    if (!document) setErrFile("Merci d'entrer le document");

    const formData = new FormData();
    formData.append("document_name", document_name);
    formData.append("document_place", document_place);
    formData.append("dCreatedDate", dCreatedDate);
    formData.append("dDescription", dDescription);
    formData.append("chemise_name", selectedChemise.chemise_name);
    formData.append("document", document);

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3001/api/documents/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        console.log("Documment added:", response.data);
        setSuccess("Documment ajoutée avec succès !");
        clearForm();
      }
      setTimeout(() => {
        setSuccess("");
      }, 4000);
    } catch (err) {
      console.error("Add Documment error:", err);
      setError("Impossible d'ajouter le documment. Réessayez plus tard.");
    } finally {
      setLoading(false);
    }

    setTimeout(() => {
      setError("");
    }, 6000);
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
    setFile(null);
    setErrFile("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
                setErrSelectedService(""); 
                setSelectedBureau(null);
                setSelectedChemise(null);
              }}
            >
              <div className="relative w-full">
                <div className="relative cursor-default overflow-hidden rounded-md border border-gray-300 bg-white text-left shadow-sm focus-within:ring-1 focus-within:ring-primary-green sm:text-sm">
                  <Combobox.Input
                    id="service.id_service"
                    className="w-full border-none py-2 pl-3 pr-10 leading-5 text-gray-900 focus:ring-0"
                    displayValue={(service) => service?.service_name || ""}
                    onChange={(event) => setServiceQuery(event.target.value)}
                    placeholder={
                      loadingServices
                        ? "Chargement..."
                        : "-- Choisir un service --"
                    }
                    disabled={loadingServices}
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
                        key={service.id_service}
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
                              {service.service_name}
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
                  setErrSelectedBureau("");
                  setSelectedChemise(null);
                }}
              >
                <div className="relative w-full">
                  <div className="relative cursor-default overflow-hidden rounded-md border border-gray-300 bg-white text-left shadow-sm focus-within:ring-1 focus-within:ring-primary-green sm:text-sm">
                    <Combobox.Input
                      id="bureau"
                      className="w-full border-none py-2 pl-3 pr-10 leading-5 text-gray-900 focus:ring-0"
                      displayValue={(bureau) => bureau?.bureau_name || ""}
                      onChange={(event) => setBureauQuery(event.target.value)}
                      placeholder={
                        loadingBureaux
                          ? "Chargement..."
                          : "-- Choisir un bureau --"
                      }
                      disabled={loadingBureaux}
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
                          key={bureau.id_bureau}
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
                                {bureau.bureau_name}
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
                  {!loadingBureaux &&
                    selectedService &&
                    filteredBureaux.length === 0 && (
                      <div className="absolute mt-1 w-full rounded-md bg-white py-2 px-3 text-sm text-gray-500 shadow-lg ring-1 ring-black/5">
                        Aucun bureau trouvé pour ce service
                      </div>
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
                  setErrSelectedChemise("");
                }}
              >
                <div className="relative w-full">
                  <div className="relative cursor-default overflow-hidden rounded-md border border-gray-300 bg-white text-left shadow-sm focus-within:ring-1 focus-within:ring-primary-green sm:text-sm">
                    <Combobox.Input
                      id="chemise"
                      className="w-full border-none py-2 pl-3 pr-10 leading-5 text-gray-900 focus:ring-0"
                      displayValue={(chemise) => chemise?.chemise_name || ""}
                      onChange={(event) => setChemiseQuery(event.target.value)}
                      placeholder={
                        loadingChemise
                          ? "Chargement..."
                          : "-- Choisir une chemise --"
                      }
                      disabled={loadingChemise}
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
                          key={chemise.id_chemise}
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
                                {chemise.chemise_name}
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
                  {!loadingChemise &&
                    selectedBureau &&
                    filteredChemises.length === 0 && (
                      <div className="absolute mt-1 w-full rounded-md bg-white py-2 px-3 text-sm text-gray-500 shadow-lg ring-1 ring-black/5">
                        Aucune chemise trouvé pour ce bureau
                      </div>
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
            value={document_name}
            onChange={(e) => {
              setName(e.target.value);
              setErrName("");
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
            value={document_place}
            onChange={(e) => {
              setPlacement(e.target.value);
              setErrPlacement("");
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
            value={dCreatedDate}
            onChange={(e) => {
              setCreation(e.target.value);
              setErrCreation("");
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
            value={dDescription}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 rounded p-2 min-w-[250px] focus:outline-none focus:ring-2 focus:ring-primary-green"
          />
        </div>
        <div className="flex items-center">
          <label htmlFor="description" className="font-medium mr-10">
            Le fichier <span className="text-red-500">*</span>:
          </label>
          <input
            type="file"
            ref={fileInputRef}
            placeholder="Veuillez entrer le document"
            onChange={(e) => setFile(e.target.files[0])}
            className="border border-gray-300 rounded p-2 min-w-[250px] focus:outline-none focus:ring-2 focus:ring-primary-green"
          />
          {errFile && <p className="text-red-500 text-xs">{errFile}</p>}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-secondary-green text-sm">{success}</p>}

        <button
          type="submit"
          disabled={loading || loadingServices || loadingBureaux}
          className="rounded-xl bg-primary-green text-white shadow-2xl font-bold px-7 py-2"
        >
          {loading ? "Ajout en cours..." : "Ajouter Document"}
        </button>
      </form>
    </div>
  );
};

export default AddDoc;
