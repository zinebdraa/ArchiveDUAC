import React, { useState } from "react";
import axios from "axios";

const AddService = () => {
  const token = localStorage.getItem("token");
  const [service_name, setName] = useState("");
  const [errName, setErrName] = useState("");
  const [service_place, setPlacement] = useState("");
  const [errPlacement, setErrPlacement] = useState("");
  const [sCreatedDate, setCreation] = useState("");
  const [errCreation, setErrCreation] = useState("");
  const [sDescription, setDescription] = useState("");
  const [error, setError] = useState(""); 
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let valid = true;
    if (!service_name) {
      setErrName("merci d'entrer le nom du service ");
      valid = false;
    }
    if (!service_place) {
      setErrPlacement("merci d'entrer le placement du service ");
      valid = false;
    }
    if (!sCreatedDate) {
      setErrCreation("merci d'entrer la date du creation du service ");
      valid = false;
    }

    if (!valid) return;

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3001/api/services",
        { service_name, service_place, sCreatedDate, sDescription },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        console.log("Service added:", response.data);
        setSuccess("Service ajouté avec succès !");
        clearForm();
      }

      setTimeout(() => {
          setSuccess("");
        }, 4000);
    } catch (err) {
      console.error("Add service error:", err);
      setError("Impossible d’ajouter le service. Réessayez plus tard.");
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
    setError("");
  };

  return (
    <div className="m-auto">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="font-medium mr-20">
            Nom <span className="text-red-500">*</span> :
          </label>
          <input
            type="text"
            id="name"
            value={service_name}
            onChange={(e) => {
              setName(e.target.value);
              setErrName("");
            }}
            placeholder="Entrez le nom "
            className="border border-gray-300 rounded p-2 min-w-[250px] focus:outline-none focus:ring-2 focus:ring-primary-green"
          />
          {errName && <p className="text-red-500 text-xs">{errName}</p>}
        </div>

        <div>
          <label htmlFor="placement" className="font-medium mr-5">
            Archivé dans <span className="text-red-500">*</span> :
          </label>
          <input
            type="text"
            id="placement"
            value={service_place}
            onChange={(e) => {
              setPlacement(e.target.value);
              setErrPlacement("");
            }}
            placeholder="Entrez son place dans l’archive"
            className="border border-gray-300 rounded p-2 min-w-[250px] focus:outline-none focus:ring-2 focus:ring-primary-green"
          />
          {errPlacement && (
            <p className="text-red-500 text-xs">{errPlacement}</p>
          )}
        </div>

        <div>
          <label htmlFor="creation" className="font-medium mr-16">
            Crée le <span className="text-red-500">*</span> :
          </label>
          <input
            type="date"
            id="creation"
            value={sCreatedDate}
            onChange={(e) => {
              setCreation(e.target.value);
              setErrCreation("");
            }}
            className="border border-gray-300 rounded p-2 min-w-[250px] focus:outline-none focus:ring-2 focus:ring-primary-green"
          />
          {errCreation && <p className="text-red-500 text-xs">{errCreation}</p>}
        </div>

        <div className="flex items-center">
          <label htmlFor="description" className="font-medium mr-10">
            Description :
          </label>
          <textarea
            id="description"
            placeholder="Une petite description"
            value={sDescription}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 rounded p-2 min-w-[250px] focus:outline-none focus:ring-2 focus:ring-primary-green"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-secondary-green text-sm">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-primary-green text-white shadow-2xl font-bold px-7 py-2 disabled:opacity-50"
        >
          {loading ? "Ajout en cours..." : "Add Service"}
        </button>
      </form>
    </div>
  );
};

export default AddService;
