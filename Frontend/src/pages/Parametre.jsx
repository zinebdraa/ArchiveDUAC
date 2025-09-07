import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBare from "../components/NavBare";
import SideBar from "../components/SideBar";
import { Combobox } from "@headlessui/react";
import { FaCheck } from "react-icons/fa";
import { HiMiniChevronUpDown } from "react-icons/hi2";

const Parametre = () => {
  const token = localStorage.getItem("token");
  const [results, setResults] = useState({});
  const [error, setError] = useState(""); 
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  const [selectedPopup, setSelectedPopup] = useState(null);
  const [deleteStep, setDeleteStep] = useState(null); // 'service' or 'bureau'
  const [services, setServices] = useState([]);
  const [bureaus, setBureaus] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // Changed from selectedItemId
  const [formValues, setFormValues] = useState({
    user_name: "",
    password: "",
    user_num: "",
    user_email: "",
    new_password: "",
    confirmPassword: "",
    formats: "",
  });

  // Function to reset form values
  const resetFormValues = () => {
    setFormValues({
      user_name: "",
      password: "",
      user_num: "",
      user_email: "",
      new_password: "",
      confirmPassword: "",
      formats: "",
    });
  };

  // Function to reset delete state
  const resetDeleteState = () => {
    setDeleteStep(null);
    setSelectedItem(null); // Changed from selectedItemId
    setServices([]);
    setBureaus([]);
    setQuery(""); // Reset query
  };

  // Function to fetch user profile data
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/users/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setResults(response.data || {});
    } catch (error) {
      console.error("Error fetching params:", error);
      setResults({});
    }
  };

  // Function to fetch services
  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3001/api/services",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setServices(response.data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
      setServices([]);
      setError("Impossible de charger les services.");
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch bureaus
  const fetchBureaus = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3001/api/bureaus",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBureaus(response.data || []);
    } catch (error) {
      console.error("Error fetching bureaus:", error);
      setBureaus([]);
      setError("Impossible de charger les bureaux.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle delete type selection
  const handleDeleteTypeSelect = async (type) => {
    setDeleteStep(type);
    setError("");
    setQuery(""); // Reset query when switching types
    setSelectedItem(null); // Reset selection
    if (type === 'service') {
      await fetchServices();
    } else if (type === 'bureau') {
      await fetchBureaus();
    }
  };

  // Function to delete service or bureau
  const handleDelete = async () => {
    if (!selectedItem || !deleteStep) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const endpoint = deleteStep === 'service' 
        ? `http://localhost:3001/api/services/${selectedItem.id}`
        : `http://localhost:3001/api/bureaus/${selectedItem.id}`;

      const response = await axios.delete(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200 || response.status === 204) {
        setSuccess(`${deleteStep === 'service' ? 'Service' : 'Bureau'} supprimé avec succès !`);
        
        // Refresh the lists
        if (deleteStep === 'service') {
          await fetchServices();
        } else {
          await fetchBureaus();
        }
        
        setSelectedItem(null); // Reset selection
        setQuery(""); // Reset query
      }

      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("Delete error:", err);
      setError(`Impossible de supprimer le ${deleteStep === 'service' ? 'service' : 'bureau'}. Réessayez plus tard.`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedPopup(null);
    setError("");
    setSuccess("");
    resetFormValues();
    resetDeleteState();
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.put(
        "http://localhost:3001/api/auth/profile", 
        { ...formValues },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccess("Mise à jour effectuée avec succès !");
        await fetchUserProfile();
      }

      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("Update error:", err);
      setError("Impossible de mettre à jour. Réessayez plus tard.");
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  // Function to handle popup opening with form reset
  const handlePopupOpen = (popupType) => {
    resetFormValues();
    resetDeleteState();
    setSelectedPopup(popupType);
  };

  useEffect(() => {
    fetchUserProfile();
  }, [token]);

  const renderPopupContent = () => {
    switch (selectedPopup) {
      case "username":
        return (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <label htmlFor="username">Entrez le nouveau nom d'utilisateur :</label>
            <input
              type="text"
              id="user_name"
              value={formValues.user_name}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <label htmlFor="password">Entrez le mot de passe :</label>
            <input
              type="password"
              id="password"
              value={formValues.password}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <button disabled={loading} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
              {loading ? "En cours..." : "Confirmer"}
            </button>
          </form>
        );

      case "phone":
        return (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <label htmlFor="phone">Entrez le nouveau numéro de téléphone :</label>
            <input
              type="text"
              id="user_num"
              value={formValues.user_num}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <label htmlFor="password">Entrez le mot de passe :</label>
            <input
              type="password"
              id="password"
              value={formValues.password}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <button disabled={loading} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
              {loading ? "En cours..." : "Confirmer"}
            </button>
          </form>
        );

      case "email":
        return (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <label htmlFor="email">Entrez la nouvelle adresse e-mail :</label>
            <input
              type="email"
              id="user_email"
              value={formValues.user_email}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <label htmlFor="password">Entrez le mot de passe :</label>
            <input
              type="password"
              id="password"
              value={formValues.password}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <button disabled={loading} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
              {loading ? "En cours..." : "Confirmer"}
            </button>
          </form>
        );

      case "password":
        return (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <label htmlFor="password">Entrez l'ancien mot de passe :</label>
            <input
              type="password"
              id="password"
              value={formValues.password}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <label htmlFor="new_password">Entrez le nouveau mot de passe :</label>
            <input
              type="password"
              id="new_password"
              value={formValues.new_password}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <label htmlFor="confirmPassword">Confirmez le nouveau mot de passe :</label>
            <input
              type="password"
              id="confirmPassword"
              value={formValues.confirmPassword}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <button disabled={loading} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
              {loading ? "En cours..." : "Confirmer"}
            </button>
          </form>
        );

      case "delete":
        if (!deleteStep) {
          // Step 1: Choose what to delete
          return (
            <div className="flex flex-col gap-4">
              <p className="text-red-600 font-semibold mb-2">Que souhaitez-vous supprimer ?</p>
              <button 
                className="bg-red-500 text-white px-4 py-3 rounded hover:bg-red-600 transition-colors"
                onClick={() => handleDeleteTypeSelect('service')}
                disabled={loading}
              >
                {loading ? "Chargement..." : "Supprimer un service"}
              </button>
              <button 
                className="bg-red-700 text-white px-4 py-3 rounded hover:bg-red-800 transition-colors"
                onClick={() => handleDeleteTypeSelect('bureau')}
                disabled={loading}
              >
                {loading ? "Chargement..." : "Supprimer un bureau"}
              </button>
            </div>
          );
        } else {
          // Step 2: Select specific item to delete
          const items = deleteStep === 'service' ? services : bureaus;
          const itemType = deleteStep === 'service' ? 'service' : 'bureau';
          
          // Filter items based on query
          const filteredItems = query === '' 
            ? items 
            : items.filter((item) => {
                const itemName = deleteStep === 'service' 
                  ? (item.service_name || item.name || '')
                  : (item.bureau_name || item.name || '');
                return itemName.toLowerCase().includes(query.toLowerCase());
              });
          
          return (
            <div className="flex flex-col gap-4">
              <button 
                className="text-blue-600 text-sm self-start hover:underline mb-2"
                onClick={() => setDeleteStep(null)}
              >
                ← Retour
              </button>
              
              <p className="text-red-600 font-semibold">
                Sélectionnez le {itemType} à supprimer :
              </p>
              
              {loading ? (
                <p className="text-gray-500">Chargement...</p>
              ) : items.length > 0 ? (
                <>
                  <Combobox value={selectedItem} onChange={setSelectedItem}>
                    <div className="relative w-full">
                      <div className="relative cursor-default overflow-hidden rounded-md border border-gray-300 bg-white text-left shadow-sm focus-within:ring-1 focus-within:ring-primary-green sm:text-sm">
                        <Combobox.Input
                          className="w-full border-none py-2 pl-3 pr-10 leading-5 text-gray-900 focus:ring-0"
                          displayValue={(item) => {
                            if (!item) return "";
                            return deleteStep === 'service' 
                              ? (item.service_name || item.name || "")
                              : (item.bureau_name || item.name || "");
                          }}
                          onChange={(event) => setQuery(event.target.value)}
                          placeholder={`-- Choisir un ${itemType} --`}
                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                          <HiMiniChevronUpDown
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </Combobox.Button>
                      </div>

                      {filteredItems.length > 0 && (
                        <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10">
                          {filteredItems.map((item) => (
                            <Combobox.Option
                              key={item.id_service || item.id_bureau}
                              value={item}
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
                                    {deleteStep === 'service' 
                                      ? (item.service_name || item.name || `Service ${item.id_service}`)
                                      : (item.bureau_name || item.name || `Bureau ${item.id_bureau}`)
                                    }
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
                  
                  <button
                    disabled={loading || !selectedItem}
                    onClick={handleDelete}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? "Suppression en cours..." : `Supprimer le ${itemType}`}
                  </button>
                </>
              ) : (
                <p className="text-gray-500 italic">
                  Aucun {itemType} disponible pour la suppression.
                </p>
              )}
            </div>
          );
        }

      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-4">
      <div className="col-span-1">
        <SideBar />
      </div>

      <div className="col-span-3">
        <div className="flex flex-col gap-4">
          <NavBare />

          <div className="mx-auto w-[95%]">
            <h1 className="text-xl font-bold">Paramètre de l'application</h1>

            {success && <p className="text-green-600">{success}</p>}
            {error && <p className="text-red-600">{error}</p>}

            <ul className="space-y-4">
              <li className="flex justify-between">
                <div>
                  <p>Nom de l'utilisateur</p>
                  <p>{results.user_name}</p>
                </div>
                <button className="text-blue-600" onClick={() => handlePopupOpen("username")}>
                  Changer
                </button>
              </li>
              <li className="flex justify-between">
                <div>
                  <p>Phone number</p>
                  <p>{results.user_num}</p>
                </div>
                <button className="text-blue-600" onClick={() => handlePopupOpen("phone")}>
                  Changer
                </button>
              </li>
              <li className="flex justify-between">
                <div>
                  <p>E-mail</p>
                  <p>{results.user_email}</p>
                </div>
                <button className="text-blue-600" onClick={() => handlePopupOpen("email")}>
                  Changer
                </button>
              </li>
              <li className="flex justify-between">
                <p>Password</p>
                <button className="text-blue-600" onClick={() => handlePopupOpen("password")}>
                  Changer
                </button>
              </li>
              <li className="">
                <p>Formats de fichiers acceptés</p>
                <p>pdf, doc, pptx, xlsx</p>
              </li>
              <li className="flex justify-between">
                <p>Suppression</p>
                <button className="text-red-600" onClick={() => handlePopupOpen("delete")}>
                  Supprimer
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {selectedPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Paramètre</h2>
            {renderPopupContent()}
            <div className="flex justify-end mt-4">
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={handleClose}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Parametre;