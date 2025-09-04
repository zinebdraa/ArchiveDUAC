// import { useState } from "react";
// import axios from "axios";
// import services from "../data/services.json";
// import bureaux from "../data/bureaux.json";
// import { Combobox } from "@headlessui/react";
// import { FaCheck } from "react-icons/fa";
// import { HiMiniChevronUpDown } from "react-icons/hi2";

// const AddChemise = () => {
//   const token = localStorage.getItem("token");

//   const [services, setServices] = useState([]); // ✅ services from API
//   const [success, setSuccess] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [chemise_name, setName] = useState("");
//   const [errName, setErrName] = useState("");
//   const [chemise_place, setPlacement] = useState("");
//   const [errPlacement, setErrPlacement] = useState("");
//   const [cCreatedDate, setCreation] = useState("");
//   const [errCreation, setErrCreation] = useState("");
//   const [cDescription, setDescription] = useState("");

//   const [selectedService, setSelectedService] = useState(null);
//   const [errSelectedService, setErrSelectedService] = useState("");
//   const [bureau_name, setSelectedBureau] = useState(null);
//   const [errSelectedBureau, setErrSelectedBureau] = useState("");

//   const [serviceQuery, setServiceQuery] = useState("");
//   const [bureauQuery, setBureauQuery] = useState("");

//   // Filter services
//   const filteredServices =
//     serviceQuery === ""
//       ? services
//       : services.filter((s) =>
//           s.name.toLowerCase().includes(serviceQuery.toLowerCase())
//         );

//   // Filter bureaux of the selected service
//   const bureauxOfService = selectedService
//     ? bureaux.filter((b) => b.serviceId === selectedService.id)
//     : [];

//   const filteredBureaux =
//     bureauQuery === ""
//       ? bureauxOfService
//       : bureauxOfService.filter((b) =>
//           b.name.toLowerCase().includes(bureauQuery.toLowerCase())
//         );

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!selectedService) setErrSelectedService("entrer le nom du service");
//     if (!bureau_name) setErrSelectedBureau("entrer le nom du bureau");
//     if (!chemise_name) setErrName("Merci d'entrer le nom de la chemise");
//     if (!chemise_place)
//       setErrPlacement("Merci d'entrer le placement de la chemise");
//     if (!cCreatedDate)
//       setErrCreation("Merci d'entrer la date de création de la chemise");

//     // if (name && placement && creation && selectedService && selectedBureau) {
//     //   console.log("✅ Success", {
//     //     name,
//     //     placement,
//     //     creation,
//     //     description,
//     //     service: selectedService,
//     //     bureau: selectedBureau,
//     //   });
//     //   clearForm();
//     // }
//     setLoading(true);
//     try {
//       const response = await axios.post(
//         "http://localhost:3001/api/bureaus",
//         {
//           chemise_name,
//           chemise_place,
//           cCreatedDate,
//           cDescription,
//           bureau_name: bureau_name.bureau_name,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.status === 201 || response.status === 200) {
//         console.log("Bureau added:", response.data);
//         setSuccess("Bureau ajouté avec succès !");
//         clearForm();
//       }
//     } catch (err) {
//       console.error("Add Bureau error:", err);
//       setError("Impossible d’ajouter Bureau. Réessayez plus tard.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const clearForm = () => {
//     setName("");
//     setErrName("");
//     setPlacement("");
//     setErrPlacement("");
//     setCreation("");
//     setErrCreation("");
//     setDescription("");
//     setSelectedService(null);
//     setSelectedBureau(null);
//     setServiceQuery("");
//     setBureauQuery("");
//   };

//   return (
//     <div className="m-auto">
//       <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
//         {/* Service Combobox */}
//         <div className="flex gap-2">
//           <div className="flex items-center  max-w-sm">
//             <label htmlFor="service" className="font-medium w-[150px]">
//               Service lié <span className="text-red-500">*</span> :
//             </label>
//             <Combobox
//               value={selectedService}
//               onChange={(s) => {
//                 setSelectedService(s);
//                 setSelectedBureau(null);
//               }}
//             >
//               <div className="relative w-full">
//                 <div className="relative cursor-default overflow-hidden rounded-md border border-gray-300 bg-white text-left shadow-sm focus-within:ring-1 focus-within:ring-primary-green sm:text-sm">
//                   <Combobox.Input
//                     id="service"
//                     className="w-full border-none py-2 pl-3 pr-10 leading-5 text-gray-900 focus:ring-0"
//                     displayValue={(service) => service?.name || ""}
//                     onChange={(event) => setServiceQuery(event.target.value)}
//                     placeholder="-- Choisir un service --"
//                   />
//                   <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
//                     <HiMiniChevronUpDown
//                       className="h-5 w-5 text-gray-400"
//                       aria-hidden="true"
//                     />
//                   </Combobox.Button>
//                 </div>
//                 {filteredServices.length > 0 && (
//                   <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10">
//                     {filteredServices.map((service) => (
//                       <Combobox.Option
//                         key={service.id}
//                         value={service}
//                         className={({ active }) =>
//                           `relative cursor-default select-none py-2 pl-10 pr-4 ${
//                             active
//                               ? "bg-primary-green text-white"
//                               : "text-gray-900"
//                           }`
//                         }
//                       >
//                         {({ selected, active }) => (
//                           <>
//                             <span
//                               className={`block truncate ${
//                                 selected ? "font-medium" : "font-normal"
//                               }`}
//                             >
//                               {service.name}
//                             </span>
//                             {selected && (
//                               <span
//                                 className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
//                                   active ? "text-white" : "text-primary-green"
//                                 }`}
//                               >
//                                 <FaCheck
//                                   className="h-5 w-5"
//                                   aria-hidden="true"
//                                 />
//                               </span>
//                             )}
//                           </>
//                         )}
//                       </Combobox.Option>
//                     ))}
//                   </Combobox.Options>
//                 )}
//               </div>
//             </Combobox>
//             {errSelectedService && (
//               <p className="text-red-500 text-xs">{errSelectedService}</p>
//             )}
//           </div>

//           {/* Bureau Combobox */}
//           {selectedService && (
//             <div className="flex items-center  max-w-sm">
//               <label htmlFor="bureau" className="font-medium w-[150px]">
//                 Bureau lié <span className="text-red-500">*</span> :
//               </label>
//               <Combobox value={bureau_name} onChange={setSelectedBureau}>
//                 <div className="relative w-full">
//                   <div className="relative cursor-default overflow-hidden rounded-md border border-gray-300 bg-white text-left shadow-sm focus-within:ring-1 focus-within:ring-primary-green sm:text-sm">
//                     <Combobox.Input
//                       id="bureau"
//                       className="w-full border-none py-2 pl-3 pr-10 leading-5 text-gray-900 focus:ring-0"
//                       displayValue={(bureau) => bureau?.name || ""}
//                       onChange={(event) => setBureauQuery(event.target.value)}
//                       placeholder="-- Choisir un bureau --"
//                     />
//                     <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
//                       <HiMiniChevronUpDown
//                         className="h-5 w-5 text-gray-400"
//                         aria-hidden="true"
//                       />
//                     </Combobox.Button>
//                   </div>
//                   {filteredBureaux.length > 0 && (
//                     <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10">
//                       {filteredBureaux.map((bureau) => (
//                         <Combobox.Option
//                           key={bureau.id}
//                           value={bureau}
//                           className={({ active }) =>
//                             `relative cursor-default select-none py-2 pl-10 pr-4 ${
//                               active
//                                 ? "bg-primary-green text-white"
//                                 : "text-gray-900"
//                             }`
//                           }
//                         >
//                           {({ selected, active }) => (
//                             <>
//                               <span
//                                 className={`block truncate ${
//                                   selected ? "font-medium" : "font-normal"
//                                 }`}
//                               >
//                                 {bureau.name}
//                               </span>
//                               {selected && (
//                                 <span
//                                   className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
//                                     active ? "text-white" : "text-primary-green"
//                                   }`}
//                                 >
//                                   <FaCheck
//                                     className="h-5 w-5"
//                                     aria-hidden="true"
//                                   />
//                                 </span>
//                               )}
//                             </>
//                           )}
//                         </Combobox.Option>
//                       ))}
//                     </Combobox.Options>
//                   )}
//                 </div>
//               </Combobox>
//               {errSelectedBureau && (
//                 <p className="text-red-500 text-xs">{errSelectedBureau}</p>
//               )}
//             </div>
//           )}
//         </div>
//         {/* Name */}
//         <div>
//           <label htmlFor="name" className="font-medium mr-20">
//             Nom <span className="text-red-500">*</span> :
//           </label>
//           <input
//             type="text"
//             id="name"
//             value={chemise_name}
//             onChange={(e) => {
//               setName(e.target.value);
//               setErrName("");
//             }}
//             placeholder="Entrez le nom"
//             className="border border-gray-300 rounded p-2 min-w-[250px] focus:outline-none focus:ring-2 focus:ring-primary-green"
//           />
//           {errName && <p className="text-red-500 text-xs">{errName}</p>}
//         </div>

//         {/* Placement */}
//         <div>
//           <label htmlFor="placement" className="font-medium mr-5">
//             Archivé dans <span className="text-red-500">*</span> :
//           </label>
//           <input
//             type="text"
//             id="placement"
//             value={chemise_place}
//             onChange={(e) => {
//               setPlacement(e.target.value);
//               setErrPlacement("");
//             }}
//             placeholder="Entrez son emplacement"
//             className="border border-gray-300 rounded p-2 min-w-[250px] focus:outline-none focus:ring-2 focus:ring-primary-green"
//           />
//           {errPlacement && (
//             <p className="text-red-500 text-xs">{errPlacement}</p>
//           )}
//         </div>

//         {/* Creation Date */}
//         <div>
//           <label htmlFor="creation" className="font-medium mr-16">
//             Créé le <span className="text-red-500">*</span> :
//           </label>
//           <input
//             type="date"
//             id="creation"
//             value={cCreatedDate}
//             onChange={(e) => {
//               setCreation(e.target.value);
//               setErrCreation("");
//             }}
//             className="border border-gray-300 rounded p-2 min-w-[250px] focus:outline-none focus:ring-2 focus:ring-primary-green"
//           />
//           {errCreation && <p className="text-red-500 text-xs">{errCreation}</p>}
//         </div>

//         {/* Description */}
//         <div className="flex items-center">
//           <label htmlFor="description" className="font-medium mr-10">
//             Description :
//           </label>
//           <textarea
//             id="description"
//             placeholder="Une petite description"
//             value={cDescription}
//             onChange={(e) => setDescription(e.target.value)}
//             className="border border-gray-300 rounded p-2 min-w-[250px] focus:outline-none focus:ring-2 focus:ring-primary-green"
//           />
//         </div>
//         {error && <p className="text-red-500 text-sm">{error}</p>}
//         {success && <p className="text-secondary-green text-sm">{success}</p>}
//         <button
//           type="submit"
//           className="rounded-xl bg-primary-green text-white shadow-2xl font-bold px-7 py-2"
//         >
//           {loading ? "Ajout en cours..." : "Ajouter Chemise"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddChemise;
import { useState, useEffect } from "react";
import axios from "axios";
import { Combobox } from "@headlessui/react";
import { FaCheck } from "react-icons/fa";
import { HiMiniChevronUpDown } from "react-icons/hi2";

const AddChemise = () => {
  const token = localStorage.getItem("token");

  const [services, setServices] = useState([]);
  const [bureaux, setBureaux] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingBureaux, setLoadingBureaux] = useState(false);

  const [chemise_name, setName] = useState("");
  const [errName, setErrName] = useState("");
  const [chemise_place, setPlacement] = useState("");
  const [errPlacement, setErrPlacement] = useState("");
  const [cCreatedDate, setCreation] = useState("");
  const [errCreation, setErrCreation] = useState("");
  const [cDescription, setDescription] = useState("");

  const [selectedService, setSelectedService] = useState(null);
  const [errSelectedService, setErrSelectedService] = useState("");
  const [bureau_name, setSelectedBureau] = useState(null);
  const [errSelectedBureau, setErrSelectedBureau] = useState("");

  const [serviceQuery, setServiceQuery] = useState("");
  const [bureauQuery, setBureauQuery] = useState("");

  // Fetch services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  // Fetch bureaux when a service is selected
  useEffect(() => {
    if (selectedService) {
      fetchBureaux(selectedService.id_service); // pass the service ID
    } else {
      setBureaux([]); // reset when no service is selected
    }
  }, [selectedService]);

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

  // Filter services based on search query
  const filteredServices =
    serviceQuery === ""
      ? services
      : services.filter((s) =>
          s.service_name.toLowerCase().includes(serviceQuery.toLowerCase())
        );

  // Filter bureaux based on search query
  const filteredBureaux =
    bureauQuery === ""
      ? bureaux
      : bureaux.filter((b) =>
          b.bureau_name.toLowerCase().includes(bureauQuery.toLowerCase())
        );

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setErrSelectedService("");
    setErrSelectedBureau("");
    setErrName("");
    setErrPlacement("");
    setErrCreation("");
    setError("");

    // Validation
    let hasErrors = false;
    if (!selectedService) {
      setErrSelectedService("Entrer le nom du service");
      hasErrors = true;
    }
    if (!bureau_name) {
      setErrSelectedBureau("Entrer le nom du bureau");
      hasErrors = true;
    }
    if (!chemise_name) {
      setErrName("Merci d'entrer le nom de la chemise");
      hasErrors = true;
    }
    if (!chemise_place) {
      setErrPlacement("Merci d'entrer le placement de la chemise");
      hasErrors = true;
    }
    if (!cCreatedDate) {
      setErrCreation("Merci d'entrer la date de création de la chemise");
      hasErrors = true;
    }

    if (hasErrors) return;

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3001/api/chemises",
        {
          chemise_name,
          chemise_place,
          cCreatedDate,
          cDescription,
          bureau_name: bureau_name.bureau_name,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        console.log("Chemise added:", response.data);
        setSuccess("Chemise ajoutée avec succès !");
        clearForm();
      }
      setTimeout(() => {
          setSuccess("");
        }, 4000);
    } catch (err) {
      console.error("Add Chemise error:", err);
      setError("Impossible d'ajouter la chemise. Réessayez plus tard.");
    } finally {
      setLoading(false);
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
    setServiceQuery("");
    setBureauQuery("");
    setError("");
  };

  return (
    <div className="m-auto">
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        {/* Service Combobox */}
        <div className="flex gap-2">
          <div className="flex items-center max-w-sm">
            <label htmlFor="service" className="font-medium w-[150px]">
              Service lié <span className="text-red-500">*</span> :
            </label>
            <Combobox
              value={selectedService}
              onChange={(s) => {
                setSelectedService(s);
                setSelectedBureau(null); // Reset bureau when service changes
                setErrSelectedService("");
              }}
            >
              <div className="relative w-full">
                <div className="relative cursor-default overflow-hidden rounded-md border border-gray-300 bg-white text-left shadow-sm focus-within:ring-1 focus-within:ring-primary-green sm:text-sm">
                  <Combobox.Input
                    id="service"
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
                {!loadingServices && filteredServices.length > 0 && (
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
                value={bureau_name}
                onChange={(b) => {
                  setSelectedBureau(b);
                  setErrSelectedBureau("");
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
                  {!loadingBureaux && filteredBureaux.length > 0 && (
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
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="font-medium mr-20">
            Nom <span className="text-red-500">*</span> :
          </label>
          <input
            type="text"
            id="name"
            value={chemise_name}
            onChange={(e) => {
              setName(e.target.value);
              setErrName("");
            }}
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
            value={chemise_place}
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
            value={cCreatedDate}
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
            value={cDescription}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 rounded p-2 min-w-[250px] focus:outline-none focus:ring-2 focus:ring-primary-green"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-secondary-green text-sm">{success}</p>}

        <button
          type="submit"
          disabled={loading || loadingServices || loadingBureaux}
          className="rounded-xl bg-primary-green text-white shadow-2xl font-bold px-7 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Ajout en cours..." : "Ajouter Chemise"}
        </button>
      </form>
    </div>
  );
};

export default AddChemise;
