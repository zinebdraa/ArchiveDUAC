import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBare from "../components/NavBare";
import SideBar from "../components/SideBar";

import { Combobox } from "@headlessui/react";
import { FaCheck } from "react-icons/fa";
import { HiMiniChevronUpDown } from "react-icons/hi2";
import { IoPerson } from "react-icons/io5";
import { MdPhone } from "react-icons/md";
import { MdOutlineMailOutline } from "react-icons/md";
import { LuLockKeyhole } from "react-icons/lu";
import { HiOutlineDocumentCheck } from "react-icons/hi2";
import { IoTrashOutline } from "react-icons/io5";
import { FaAngleRight } from "react-icons/fa6";
import { TbXboxX } from "react-icons/tb";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Parametre = () => {
  const token = localStorage.getItem("token");
  const [results, setResults] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  // Password visibility states for different inputs
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [selectedPopup, setSelectedPopup] = useState(null);
  const [deleteStep, setDeleteStep] = useState(null);
  const [services, setServices] = useState([]);
  const [bureaus, setBureaus] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
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

  // Function to reset password visibility states
  const resetPasswordVisibility = () => {
    setShowPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  // Function to reset delete state
  const resetDeleteState = () => {
    setDeleteStep(null);
    setSelectedItem(null);
    setServices([]);
    setBureaus([]);
    setQuery("");
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
      const response = await axios.get("http://localhost:3001/api/services", {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      const response = await axios.get("http://localhost:3001/api/bureaus", {
        headers: { Authorization: `Bearer ${token}` },
      });
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
    setQuery("");
    setSelectedItem(null);
    if (type === "service") {
      await fetchServices();
    } else if (type === "bureau") {
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
      const endpoint =
        deleteStep === "service"
          ? `http://localhost:3001/api/services/${selectedItem.id_service}`
          : `http://localhost:3001/api/bureaus/${selectedItem.id_bureau}`;

      const response = await axios.delete(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200 || response.status === 204) {
        setSuccess(
          `${
            deleteStep === "service" ? "Service" : "Bureau"
          } supprimé avec succès !`
        );

        // Refresh the lists
        if (deleteStep === "service") {
          await fetchServices();
        } else {
          await fetchBureaus();
        }

        setSelectedItem(null);
        setQuery("");
      }

      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("Delete error:", err);
      setError(
        `Impossible de supprimer le ${
          deleteStep === "service" ? "service" : "bureau"
        }. Réessayez plus tard.`
      );
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
    resetPasswordVisibility();
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
    resetPasswordVisibility();
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
            <label htmlFor="username">
              Entrez le nouveau nom d'utilisateur :
            </label>
            <input
              type="text"
              id="user_name"
              value={formValues.user_name}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <label htmlFor="password">Entrez le mot de passe :</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={formValues.password}
                onChange={handleChange}
                className="border p-2 rounded w-[100%]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 z-10"
              >
                {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
              </button>
            </div>
            <button
              disabled={loading}
              className="mt-2 px-4 py-2 bg-primary-green text-white rounded"
            >
              {loading ? "En cours..." : "Confirmer"}
            </button>
          </form>
        );

      case "phone":
        return (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <label htmlFor="phone">
              Entrez le nouveau numéro de téléphone :
            </label>
            <input
              type="text"
              id="user_num"
              value={formValues.user_num}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <label htmlFor="password">Entrez le mot de passe :</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={formValues.password}
                onChange={handleChange}
                className="border p-2 rounded w-[100%]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 z-10"
              >
                {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
              </button>
            </div>
            <button
              disabled={loading}
              className="mt-2 px-4 py-2 bg-primary-green text-white rounded"
            >
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
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={formValues.password}
                onChange={handleChange}
                className="border p-2 rounded w-[100%]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 z-10"
              >
                {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
              </button>
            </div>
            <button
              disabled={loading}
              className="mt-2 px-4 py-2 bg-primary-green text-white rounded"
            >
              {loading ? "En cours..." : "Confirmer"}
            </button>
          </form>
        );

      case "password":
        return (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <label htmlFor="password">Entrez l'ancien mot de passe :</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={formValues.password}
                onChange={handleChange}
                className="border p-2 rounded w-[100%]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 z-10"
              >
                {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
              </button>
            </div>
            <label htmlFor="new_password">
              Entrez le nouveau mot de passe :
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                id="new_password"
                value={formValues.new_password}
                onChange={handleChange}
                className="border p-2 rounded w-[100%]"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 z-10"
              >
                {showNewPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
              </button>
            </div>
            <label htmlFor="confirmPassword">
              Confirmez le nouveau mot de passe :
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={formValues.confirmPassword}
                onChange={handleChange}
                className="border p-2 rounded w-[100%]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 z-10"
              >
                {showConfirmPassword ? (
                  <AiOutlineEye />
                ) : (
                  <AiOutlineEyeInvisible />
                )}
              </button>
            </div>
            <button
              disabled={loading}
              className="mt-2 px-4 py-2 bg-primary-green text-white rounded"
            >
              {loading ? "En cours..." : "Confirmer"}
            </button>
          </form>
        );

      case "delete":
        if (!deleteStep) {
          //  Choose what to delete
          return (
            <div className="flex flex-col gap-4">
              <p className="text-red-600 font-semibold mb-2">
                Que souhaitez-vous supprimer ?
              </p>
              <button
                className="bg-primary-green text-white px-4 py-3 rounded hover:bg-secondary-green transition-colors"
                onClick={() => handleDeleteTypeSelect("service")}
                disabled={loading}
              >
                {loading ? "Chargement..." : "Supprimer un service"}
              </button>
              <button
                className="bg-primary-green text-white px-4 py-3 rounded hover:bg-secondary-green transition-colors"
                onClick={() => handleDeleteTypeSelect("bureau")}
                disabled={loading}
              >
                {loading ? "Chargement..." : "Supprimer un bureau"}
              </button>
            </div>
          );
        } else {
          // Select specific item to delete
          const items = deleteStep === "service" ? services : bureaus;
          const itemType = deleteStep === "service" ? "service" : "bureau";

          // Filter items based on query
          const filteredItems =
            query === ""
              ? items
              : items.filter((item) => {
                  const itemName =
                    deleteStep === "service"
                      ? item.service_name || item.name || ""
                      : item.bureau_name || item.name || "";
                  return itemName.toLowerCase().includes(query.toLowerCase());
                });

          return (
            <div className="flex flex-col gap-4">
              <p className=" font-semibold">
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
                            return deleteStep === "service"
                              ? item.service_name || item.name || ""
                              : item.bureau_name || item.name || "";
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
                                    {deleteStep === "service"
                                      ? item.service_name ||
                                        item.name ||
                                        `Service ${item.id_service}`
                                      : item.bureau_name ||
                                        item.name ||
                                        `Bureau ${item.id_bureau}`}
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
                  <p>
                    <span className="text-red-500">Faire Attention!</span> Tous
                    les bureaus, les chemises et les documents de ce service
                    vont etre supprimé complètement d'une manière définitive!
                  </p>
                  <div className="flex justify-evenly">
                    <button
                      disabled={loading || !selectedItem}
                      onClick={handleDelete}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading
                        ? "Suppression en cours..."
                        : `Supprimer le ${itemType}`}
                    </button>
                    <button
                      className="bg-primary-green hover:bg-secondary-green text-white px-4 py-2 rounded  disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      onClick={() => setDeleteStep(null)}
                    >
                      Annuler
                    </button>
                  </div>
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
    <div className="grid grid-cols-4 h-screen">
      <div className="col-span-1 h-screen">
        <SideBar />
      </div>

      <div className="col-span-3 overflow-y-auto">
        <div className="flex flex-col gap-4">
          <NavBare />

          <div className="mx-auto w-[95%]">
            <h1 className="text-xl font-bold m-auto mb-[50px] mt-[25px]">
              Paramètre de l'application
            </h1>

            {success && <p className="text-green-600">{success}</p>}
            {error && <p className="text-red-600">{error}</p>}

            <ul className="">
              <li className="flex justify-between border-t-[0.5px] border-b-[0.5px] p-2 pt-4 border-primary-green">
                <div className="flex">
                  <IoPerson className="mr-4 text-primary-green size-[20px]" />
                  <div>
                    <p className="font-semibold">Nom de l'utilisateur</p>
                    <p className="text-sm ">{results.user_name}</p>
                  </div>
                </div>
                <button
                  className="text-primary-green flex items-center"
                  onClick={() => handlePopupOpen("username")}
                >
                  Changer
                  <FaAngleRight className="ml-2" />
                </button>
              </li>
              <li className="flex justify-between border-b-[0.5px] p-2 border-primary-green">
                <div className="flex">
                  <MdPhone className="mr-4 text-primary-green size-[20px]" />
                  <div>
                    <p className="font-semibold">Phone number</p>
                    <p className="text-sm ">{results.user_num}</p>
                  </div>
                </div>

                <button
                  className="text-primary-green flex items-center"
                  onClick={() => handlePopupOpen("phone")}
                >
                  Changer
                  <FaAngleRight className="ml-2" />
                </button>
              </li>
              <li className="flex justify-between border-b-[0.5px] p-2 border-primary-green">
                <div className="flex">
                  <MdOutlineMailOutline className="mr-4 text-primary-green size-[20px]" />
                  <div>
                    <p className="font-semibold">E-mail</p>
                    <p className="text-sm ">{results.user_email}</p>
                  </div>
                </div>

                <button
                  className="text-primary-green flex items-center"
                  onClick={() => handlePopupOpen("email")}
                >
                  Changer
                  <FaAngleRight className="ml-2" />
                </button>
              </li>
              <li className="flex justify-between border-b-[0.5px] p-2 border-primary-green">
                <div className="flex">
                  <LuLockKeyhole className="mr-4 text-primary-green size-[20px]" />
                  <div>
                    <p className="font-semibold">Password</p>
                    <p className="text-sm ">********</p>
                  </div>
                </div>

                <button
                  className="text-primary-green flex items-center"
                  onClick={() => handlePopupOpen("password")}
                >
                  Changer
                  <FaAngleRight className="ml-2" />
                </button>
              </li>
              <li className="border-b-[0.5px] p-2 border-primary-green">
                <div className="flex">
                  <HiOutlineDocumentCheck className="mr-4 text-primary-green size-[20px]" />
                  <div>
                    <p className="font-semibold">
                      Formats de fichiers acceptés
                    </p>
                    <p className="text-sm ">pdf, doc, pptx, xlsx</p>
                  </div>
                </div>
              </li>
              <li className="flex justify-between border-b-[0.5px] p-4 pl-2 border-primary-green">
                <div className="flex">
                  <IoTrashOutline className="mr-4 text-primary-green size-[20px]" />
                  <div>
                    <p className="font-semibold">Suppression</p>
                    <p className="text-sm ">
                      supprimer totalement un service ou un bureau
                    </p>
                  </div>
                </div>

                <button
                  className="text-red-600 "
                  onClick={() => handlePopupOpen("delete")}
                >
                  Supprimer
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {selectedPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
          <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg">
            <div className="flex justify-end mt-1">
              <button
                className="  text-red-500  rounded-full "
                onClick={handleClose}
              >
                <TbXboxX className="size-[25px]" />
              </button>
            </div>

            <h2 className="text-lg font-semibold mb-4">Paramètre</h2>
            {renderPopupContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Parametre;
