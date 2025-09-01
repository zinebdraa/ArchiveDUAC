import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import NavBare from "../components/NavBare";
import SideBar from "../components/SideBar";
import bureauxData from "../data/bureaux.json";
import services from "../data/services.json";
import { CgAddR } from "react-icons/cg";
import { CgCornerDownLeft } from "react-icons/cg";

const Bureaux = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const { serviceId } = useParams();

  const service = serviceId
    ? services.find((s) => s.id === Number(serviceId))
    : null;

  const bureaux = serviceId
    ? bureauxData.filter((b) => b.serviceId === Number(serviceId))
    : bureauxData;

  const handleSearch = (query) => {
    if (query.trim() === "") {
      setResults(bureaux);
    } else {
      const filtered = bureaux.filter((bureau) =>
        bureau.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    }
  };

  const handleAddService = () => {
    navigate("/addPage?type=bureau"); // Use navigate function, not Navigate component
  };

  useEffect(() => {
    setResults(bureaux);
  }, []);

  return (
    <div className="grid grid-cols-4">
      <div className="grid col-span-1">
        <SideBar />
      </div>
      <div className="grid col-span-3">
        <div className="flex flex-col">
          <NavBare onSearch={handleSearch} />
          <div className="flex justify-start items-center my-auto ml-8">
            {serviceId && (
              <Link to="/services">
                <CgCornerDownLeft className="size-[30px]  border-2 border-primary-green bg-green-4 text-primary-green" />
              </Link>
            )}

            <p className="ml-6 font-medium text-lg border-b-[1.5px] border-primary-green">
              {service ? ` ${service.name}` : "Tous les Bureaux"}
            </p>
          </div>
          <div className="flex justify-center items-center h-[60%] w-[80%] m-auto">
            {results.length > 0 ? (
              <ul className="grid grid-cols-2 gap-2 h-full font-semibold">
                {results.map((bureau) => (
                  <li
                    key={bureau.id}
                    className="flex justify-center items-center text-center border-2 border-primary-green rounded-lg bg-green-4 hover:bg-primary-green hover:text-green-4"
                  >
                    <Link className="size-full flex justify-center items-center">
                      <p>{bureau.name}</p>
                    </Link>
                  </li>
                ))}

                <li className="flex justify-center items-center text-center border-2 border-primary-green rounded-lg bg-green-4 hover:bg-primary-green hover:text-green-4">
                  <button
                    className="size-full flex justify-center items-center m-auto "
                    onClick={handleAddService}
                  >
                    <CgAddR className="size-[30px] mr-3 font-thin " />
                    <p>Ajouter un Bureau</p>
                  </button>
                </li>
              </ul>
            ) : (
              <p className="mt-2 text-red-500 font-normal">
                Aucun résultat trouvé
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bureaux;
