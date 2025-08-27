import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavBare from "../components/NavBare";
import SideBar from "../components/SideBar";
import { IoAddCircleOutline } from "react-icons/io5";

const Service = () => {
  const services = [
    "Le Service de l’Architecture et de la Construction",
    "Le Service de l’Administration et des Moyens",
    "Le Service du Suivi des Marchés Publics",
    "Le Service de l’Urbanisme et des Aménagements Urbains",
  ];
  const [results, setResults] = useState([]);

  const handleSearch = (query) => {
    if (query.trim() === "") {
      setResults(services);
    } else {
      const filtered = services.filter((service) =>
        service.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    }
  };

  useEffect(() => {
    setResults(services);
  }, []);

  return (
    <div className="grid grid-cols-3">
      <div className="grid col-span-1">
        <SideBar />
      </div>
      <div className="grid col-span-2">
        <div className="flex flex-col">
          <NavBare onSearch={handleSearch} />
          <div className="flex justify-center items-center h-[60%] w-[80%] m-auto">
            {results.length > 0 ? (
              <ul className="grid grid-cols-3 gap-2 h-full font-semibold">
                {results.map((service, index) => (
                  <li
                    key={index}
                    className="flex justify-center items-center text-center hover:border-2 hover:border-primary-green hover:rounded-lg"
                  >
                    <Link className="size-full flex justify-center items-center">
                      <p>{service}</p>
                    </Link>
                  </li>
                ))}

                <li className="flex justify-center items-center text-center hover:border-2 hover:border-primary-green hover:rounded-lg">
                  <Link className="size-full flex justify-center items-center flex-col">
                    <IoAddCircleOutline className="size-[40px] mx-auto mb-5" />
                    <p>Ajouter un Service</p>
                  </Link>
                </li>
              </ul>
            ) : (
              <p className="mt-2 text-red-500 font-medium">
                Aucun résultat trouvé
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Service;
