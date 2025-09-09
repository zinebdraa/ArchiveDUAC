import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import NavBare from "../components/NavBare";
import SideBar from "../components/SideBar";
import axios from "axios";
import { CgAddR, CgCornerDownLeft } from "react-icons/cg";
import { CiCircleInfo } from "react-icons/ci";

const Bureaux = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams();

  const [bureaux, setBureaux] = useState([]);
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");
  const [service, setService] = useState(null);

  //normalize service id field on bureau objects
  const getBureauServiceId = (b) =>
    Number(b?.id_service ?? b?.service_id ?? b?.serviceId ?? b?.service ?? NaN);

  // Apply filters: by serviceId (if present) then by search query
  const applyFilters = (list, query, svcId) => {
    let out = Array.isArray(list) ? [...list] : [];
    if (svcId) {
      const sid = Number(svcId);
      out = out.filter((b) => getBureauServiceId(b) === sid);
    }
    if (query?.trim()) {
      const q = query.toLowerCase();
      out = out.filter((b) =>
        String(b?.bureau_name ?? b?.name ?? "")
          .toLowerCase()
          .includes(q)
      );
    }
    return out;
  };

  const fetchBureaux = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:3001/api/bureaus", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Save raw data then compute filtered
      const list = Array.isArray(data) ? data : [];
      setBureaux(list);
      setResults(applyFilters(list, search, serviceId));
    } catch (error) {
      console.error("Error fetching bureaux:", error);
      setBureaux([]);
      setResults([]);
    }
  };

  const fetchService = async () => {
    if (!serviceId) {
      setService(null);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const { data: all } = await axios.get(
        "http://localhost:3001/api/services",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const sid = Number(serviceId);
      const svc =
        (all || []).find(
          (s) => Number(s?.id_service ?? s?.service_id ?? s?.id) === sid
        ) || null;

      setService(svc);
    } catch (error) {
      console.error("Error fetching service:", error);
      setService(null);
    }
  };

  useEffect(() => {
    fetchBureaux();
    fetchService();
  }, [serviceId]);

  // Re-apply filters when raw data or search changes
  useEffect(() => {
    setResults(applyFilters(bureaux, search, serviceId));
  }, [bureaux, search, serviceId]);

  const handleSearch = (query) => setSearch(query ?? "");

  const handleAddBureau = () => {
    navigate("/addPage?type=bureau");
  };

  return (
    <div className="grid grid-cols-4 h-screen">
      <div className="grid col-span-1 h-screen">
        <SideBar />
      </div>
      <div className="grid col-span-3 overflow-y-auto">
        <div className="flex flex-col">
          <NavBare onSearch={handleSearch} />
          <div className="flex justify-start items-center my-auto ml-8">
            {serviceId && (
              <Link to="/services">
                <CgCornerDownLeft className="size-[30px] border-2 border-primary-green bg-green-4 text-primary-green" />
              </Link>
            )}
            <p className="ml-6 font-medium text-lg border-b-[1.5px] border-primary-green">
              {serviceId
                ? service
                  ? `Bureaux du service ${
                      service?.service_name ?? service?.name ?? ""
                    }`
                  : "Bureaux du service"
                : "Tous les Bureaux"}
            </p>
          </div>

          <div className="flex justify-center items-center h-[60%] w-[80%] m-auto">
            {results.length > 0 ? (
              <ul className="grid grid-cols-2 gap-2 h-full font-semibold">
                {results.map((bureau) => (
                  <li
                    key={bureau.id_bureau ?? bureau.id}
                    className="relative flex justify-center items-center text-center border-2 border-primary-green rounded-lg bg-green-4 hover:bg-primary-green hover:text-green-4"
                  >
                    <Link
                      to={`/editBureau/${bureau.id_bureau}`}
                      className="absolute left-3 top-[20px] -translate-y-1/2 z-10"
                    >
                      <CiCircleInfo className="hover:scale-110 transition-transform" />
                    </Link>
                    <Link
                      to={`/chemise/${bureau.id_bureau}`}
                      className="size-full flex justify-center items-center"
                    >
                      <p>{bureau.bureau_name}</p>
                    </Link>
                  </li>
                ))}

                <li className="flex justify-center items-center text-center border-2 border-primary-green rounded-lg bg-green-4 hover:bg-primary-green hover:text-green-4">
                  <button
                    className="size-full flex justify-center items-center m-auto"
                    onClick={handleAddBureau}
                  >
                    <CgAddR className="size-[30px] mr-3 font-thin" />
                    <p>Ajouter un Bureau</p>
                  </button>
                </li>
              </ul>
            ) : (
              <div>
                <p className="mt-2 text-red-500 font-normal">
                  Aucun résultat trouvé
                </p>
                <div className="p-4 flex justify-center items-center text-center border-2 border-primary-green rounded-lg bg-green-4 hover:bg-primary-green hover:text-green-4">
                  <button
                    className="size-full flex justify-center items-center m-auto"
                    onClick={handleAddBureau}
                  >
                    <CgAddR className="size-[30px] mr-3 font-thin" />
                    <p>Ajouter un Bureau</p>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bureaux;
