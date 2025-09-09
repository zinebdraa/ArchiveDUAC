// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import NavBare from "../components/NavBare";
// import SideBar from "../components/SideBar";
// // import services from "../data/services.json";
// import { IoAddCircleOutline } from "react-icons/io5";
// import { CiCircleInfo } from "react-icons/ci";

// const Service = () => {
//   const navigate = useNavigate();
//   const [results, setResults] = useState([]);
//   const[services, setServices] = useState([]);

//   const handleSearch = (query) => {
//     if (query.trim() === "") {
//       setResults(services);
//     } else {
//       const filtered = services.filter((service) =>
//         service.toLowerCase().includes(query.toLowerCase())
//       );
//       setResults(filtered);
//     }
//   };

//   const handleAddService = () => {
//     navigate("/addPage?type=service");
//   };

//   useEffect(() => {
//     const fetchServices = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get("http://localhost:3001/api/services", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         console.log("API response:", response.data);

//         setResults(response.data || []);
//       } catch (error) {
//         console.error("Error fetching services:", error);
//         setResults([]);
//       }
//     };

//     fetchServices();
//   }, []);

//   return (
//     <div className="grid grid-cols-4 h-screen">
//       <div className="grid col-span-1 h-screen">
//         <SideBar />
//       </div>
//       <div className="grid col-span-3 overflow-y-auto">
//         <div className="flex flex-col">
//           <NavBare onSearch={handleSearch} />
//           <div className="flex justify-center items-center h-[60%] w-[80%] m-auto">
//             {results.length > 0 ? (
//               <ul className="grid grid-cols-3 gap-2 h-full font-semibold">
//                 {results.map((service) => (
//                   <li
//                     key={service.id_service}
//                     className="flex justify-center relative items-center text-center border-2 border-primary-green rounded-lg hover:text-white hover:bg-primary-green"
//                   >
//                     <Link
//                       to={`/editService/${service.id_service}`}
//                       className="absolute left-3 top-[20px] -translate-y-1/2 z-10"
//                     >
//                       <CiCircleInfo className="hover:scale-110 transition-transform" />
//                     </Link>
//                     <Link
//                       to={`/bureaux/${service.id_service}`}
//                       className="size-full flex justify-center items-center"
//                     >
//                       <p>{service.service_name}</p>
//                     </Link>
//                   </li>
//                 ))}
//                 <li className="flex justify-center items-center text-center hover:border-2 hover:border-primary-green hover:rounded-lg">
//                   <button
//                     onClick={handleAddService}
//                     className="size-full flex justify-center items-center flex-col hover:bg-gray-50 transition-colors duration-200"
//                   >
//                     <IoAddCircleOutline className="size-[40px] mx-auto mb-5" />
//                     <p>Ajouter un Service</p>
//                   </button>
//                 </li>
//               </ul>
//             ) : (
//               <div>
//                 <p className="mt-2 text-red-500 font-medium">
//                   Aucun résultat trouvé
//                 </p>
//                 <div className="p-4 flex justify-center items-center text-center hover:border-2 hover:border-primary-green hover:rounded-lg">
//                   <button
//                     onClick={handleAddService}
//                     className="size-full flex justify-center items-center flex-col hover:bg-gray-50 transition-colors duration-200"
//                   >
//                     <IoAddCircleOutline className="size-[40px] mx-auto mb-5" />
//                     <p>Ajouter un Service</p>
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Service;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import NavBare from "../components/NavBare";
import SideBar from "../components/SideBar";
import { IoAddCircleOutline } from "react-icons/io5";
import { CiCircleInfo } from "react-icons/ci";

const Service = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [services, setServices] = useState([]);

  // Accept either a string or an event (robust for different NavBare implementations)
  const handleSearch = (query) => {
    const q =
      typeof query === "string"
        ? query
        : query?.target?.value ?? ""; // if NavBare passes an event
    if (q.trim() === "") {
      setResults(services);
      return;
    }
    const filtered = services.filter((service) =>
      (service?.service_name ?? "").toLowerCase().includes(q.toLowerCase())
    );
    setResults(filtered);
  };

  const handleAddService = () => {
    navigate("/addPage?type=service");
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3001/api/services", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("API response:", response.data);

        // Support different response shapes: array, { services: [...] }, { data: [...] }
        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.services ?? response.data?.data ?? [];

        setServices(data);
        setResults(data);
      } catch (error) {
        console.error("Error fetching services:", error);
        setServices([]);
        setResults([]);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="grid grid-cols-4 h-screen">
      <div className="grid col-span-1 h-screen">
        <SideBar />
      </div>
      <div className="grid col-span-3 overflow-y-auto">
        <div className="flex flex-col">
          <NavBare onSearch={handleSearch} />
          <div className="flex justify-center items-center h-[60%] w-[80%] m-auto">
            {results.length > 0 ? (
              <ul className="grid grid-cols-3 gap-2 h-full font-semibold">
                {results.map((service) => (
                  <li
                    key={service.id_service ?? service.id ?? service.service_name}
                    className="flex justify-center relative items-center text-center border-2 border-primary-green rounded-lg hover:text-white hover:bg-primary-green"
                  >
                    <Link
                      to={`/editService/${service.id_service ?? service.id}`}
                      className="absolute left-3 top-[20px] -translate-y-1/2 z-10"
                    >
                      <CiCircleInfo className="hover:scale-110 transition-transform" />
                    </Link>
                    <Link
                      to={`/bureaux/${service.id_service ?? service.id}`}
                      className="w-full flex justify-center items-center"
                    >
                      <p>{service.service_name}</p>
                    </Link>
                  </li>
                ))}
                <li className="flex justify-center items-center text-center hover:border-2 hover:border-primary-green hover:rounded-lg">
                  <button
                    onClick={handleAddService}
                    className="w-full flex justify-center items-center flex-col hover:bg-gray-50 transition-colors duration-200"
                  >
                    <IoAddCircleOutline className="text-[40px] mx-auto mb-5" />
                    <p>Ajouter un Service</p>
                  </button>
                </li>
              </ul>
            ) : (
              <div>
                <p className="mt-2 text-red-500 font-medium">
                  Aucun résultat trouvé
                </p>
                <div className="p-4 flex justify-center items-center text-center hover:border-2 hover:border-primary-green hover:rounded-lg">
                  <button
                    onClick={handleAddService}
                    className="w-full flex justify-center items-center flex-col hover:bg-gray-50 transition-colors duration-200"
                  >
                    <IoAddCircleOutline className="text-[40px] mx-auto mb-5" />
                    <p>Ajouter un Service</p>
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

export default Service;
