import { React, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import services from "../data/services.json";

const AddService = () => {
  const [name, setName] = useState("");
  const [errName, setErrName] = useState("");
  const [placement, setPlacement] = useState("");
  const [errPlacement, setErrPlacement] = useState("");
  const [creation, setCreation] = useState("");
  const [errCreation, setErrCreation] = useState("");
  const [description, setDescription] = useState("");

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

    if (!name) {
      setErrName("merci d'entrer le nom du service ");
    }
    if (!placement) {
      setErrPlacement("merci d'entrer le placement du service ");
    }
    if (!creation) {
      setErrCreation("merci d'entrer la date du creation du service ");
    }

    if (name && placement && creation) {
      console.log("success");
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
  };

  return (
    <div className=" m-auto">
      <form action="" className=" flex  flex-col gap-5" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="font-medium mr-20">
            Nom <span className="text-red-500">*</span> :
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
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
            value={placement}
            onChange={handlePlacementChange}
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
            value={creation}
            onChange={handleCreationChange}
            placeholder="Entrez la date"
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
            value={description}
            onChange={handleDescriptionChange}
            className="border border-gray-300 rounded p-2 min-w-[250px] focus:outline-none focus:ring-2 focus:ring-primary-green"
          />
        </div>
        <button type="submit" className="rounded-xl bg-primary-green text-white shadow-2xl font-bold px-7 py-2">
          Add Service
         </button>
      </form>
    </div>
  );
};

export default AddService;
