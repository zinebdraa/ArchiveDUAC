import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import services from "../data/services.json";

const AddBureau = () => {
  const [selected, setSelected] = useState("");

  const handleChange = (e) => {
    const serviceId = e.target.value;
    setSelected(serviceId);
  };

  return (
    <div>
      <h1>Remplir le formulaire</h1>
      <form action="">
        <label htmlFor="service-select" className="mr-2 font-medium">
          Choisir un service :
        </label>
        <select
          id="service-select"
          value={selected}
          onChange={handleChange}
          className="border rounded-md px-3 py-2"
        >
          <option value="">-- Tous les services --</option>

          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>

        <label htmlFor="name"></label>
        <input type="text" id="name" />
        <label htmlFor="placement"></label>
        <input type="text" id="placement" />
        <label htmlFor="creation"></label>
        <input type="date" id="creation" />
        <label htmlFor="description"></label>
        <input type="text" id="description" />
      </form>
    </div>
  );
};

export default AddBureau;
