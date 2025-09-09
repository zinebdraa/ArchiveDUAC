// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import NavBare from "../components/NavBare";
// import SideBar from "../components/SideBar";
// import axios from "axios";

// import { IoIosAdd } from "react-icons/io";
// import { FaCheckCircle } from "react-icons/fa";
// import { HiOutlineDownload } from "react-icons/hi";
// import { TiStarOutline } from "react-icons/ti";
// import { TbTrashX } from "react-icons/tb";
// import { GoCircle } from "react-icons/go";
// import { IoFolderOutline } from "react-icons/io5";
// import { TbFolderOpen } from "react-icons/tb";
// import { MdEdit } from "react-icons/md";
// import { IoIosCheckmarkCircleOutline } from "react-icons/io";

// const Chemise = () => {
//   const token = localStorage.getItem("token");

//   const { bureauId } = useParams();
//   const [bureau, setBureau] = useState(null);

//   const [results, setResults] = useState([]);
//   const [selected, setSelected] = useState([]);

//   const fetchBureau = async () => {
//     if (!bureauId) {
//       setBureau(null);
//       return;
//     }
//     try {
//       const { data: all } = await axios.get(
//         "http://localhost:3001/api/bureaus",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const bid = Number(bureauId);
//       const svc =
//         (all || []).find(
//           (b) => Number(b?.id_bureau ?? b?.bureau_id ?? bureau?.id) === sid
//         ) || null;

//       setBureau(svc);
//     } catch (error) {
//       console.error("Error fetching bureaux:", error);
//       setBureau(null);
//     }
//   };

//   // Fetch chemises from API instead of JSON
//   const fetchChemises = async () => {
//     try {
//       const res = await axios.get("http://localhost:3001/api/chemises", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const allChemises = res.data;

//       // Filter if bureauId exists
//       const filtered = bureauId
//         ? allChemises.filter((c) => c.bureauId === Number(bureauId))
//         : allChemises;

//       setResults(filtered);
//     } catch (err) {
//       console.error("Error fetching chemises:", err);
//     }
//   };

//   useEffect(() => {
//     fetchChemises();
//     fetchBureau()
//   }, [bureauId]);

//   // Delete chemise by ID
//   const handleDelete = async (id) => {
//     if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette chemise ?")) return;

//     try {
//       await axios.delete(`http://localhost:3001/api/chemises/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // Remove from UI without refetching everything
//       setResults((prev) => prev.filter((c) => c.id_chemise !== id));
//       setSelected((prev) => prev.filter((selectedId) => selectedId !== id));

//     } catch (err) {
//       console.error("Error deleting chemise:", err);
//       alert("Impossible de supprimer cette chemise.");
//     }
//   };

//   const handleSearch = (query) => {
//     if (query.trim() === "") {
//       fetchChemises();
//     } else {
//       const filtered = results.filter((chemise) =>
//         chemise.chemise_name.toLowerCase().includes(query.toLowerCase())
//       );
//       setResults(filtered);
//     }
//   };

//   const toggleSelect = (id) => {
//     setSelected((prev) =>
//       prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
//     );
//   };

//   return (
//     <div className="grid grid-cols-4">
//       <div className="col-span-1">
//         <SideBar />
//       </div>

//       <div className="col-span-3">
//         <div className="flex flex-col gap-4">
//           <NavBare onSearch={handleSearch} />

//           <div className="mx-auto w-[95%]">
//             {/* Top actions */}
//             <div className="bg-primary-green text-white rounded-md py-2 px-3 w-full">
//               <ul className="flex items-center justify-between">
//                 <li className="flex items-center bg-secondary-green px-3 py-1 rounded-lg cursor-pointer">
//                   <IoIosAdd className="size-[30px] mr-2" />
//                   New
//                 </li>
//                 <li className="flex items-center px-3 py-1 rounded-lg hover:bg-secondary-green cursor-pointer">
//                   <FaCheckCircle className="mr-2 size-[20px]" />
//                   {selected.length > 0 && `(${selected.length})`} sélectionné
//                 </li>
//                 <li className="flex items-center px-3 py-1 rounded-lg hover:bg-secondary-green cursor-pointer">
//                   <HiOutlineDownload className="mr-2 size-[25px]" />
//                   Télécharger
//                 </li>
//                 <li className="flex items-center px-3 py-1 rounded-lg hover:bg-secondary-green cursor-pointer">
//                   <TiStarOutline className="mr-2 size-[25px]" />
//                   favoré
//                 </li>
//                 <li className="flex items-center px-3 py-1 rounded-lg hover:bg-secondary-green cursor-pointer">
//                   <TbTrashX className="mr-2 size-[25px]" />
//                   Supprimer
//                 </li>
//               </ul>
//             </div>

//             {/* Table Header */}
//             <div className="grid grid-cols-[40px_40px_1fr_1fr_1fr_150px] items-center py-2 px-3 my-3 font-medium border-b">
//               <div>
//                 <GoCircle />
//               </div>
//               <div>
//                 <IoFolderOutline />
//               </div>
//               <div>Nom</div>
//               <div>Bureau</div>
//               <div>Créé</div>
//               <div className="text-center">Actions</div>
//             </div>

//             {/* Table Rows */}
//             {results.length > 0 ? (
//               <div>
//                 {results.map((chemise) => (
//                   <div
//                     key={chemise.id_chemise}
//                     className="grid grid-cols-[40px_40px_1fr_1fr_1fr_150px] items-center py-2 px-3 border-b text-sm hover:bg-gray-50"
//                   >
//                     <div onClick={() => toggleSelect(chemise.id_chemise)} className="cursor-pointer">
//                       {selected.includes(chemise.id_chemise) ? (
//                         <IoIosCheckmarkCircleOutline className="text-primary-green size-[20px]" />
//                       ) : (
//                         <GoCircle className="size-[16px]" />
//                       )}
//                     </div>
//                     <div>
//                       <TbFolderOpen className="size-[20px]" />
//                     </div>
//                     <div>{chemise.chemise_name}</div>
//                     <div>{chemise.bureau_name}</div>
//                     <div>{chemise.cCreatedDate}</div>
//                     <div className="flex justify-center space-x-2">
//                       <HiOutlineDownload className="size-[20px] cursor-pointer" />
//                       <MdEdit className="size-[20px] cursor-pointer" />
//                       <TiStarOutline className="size-[20px] cursor-pointer" />
//                       <TbTrashX
//                         className="size-[20px] text-red-500 cursor-pointer"
//                         onClick={() => handleDelete(chemise.id_chemise)}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="m-auto text-red-500 font-normal">Aucun résultat trouvé</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chemise;
// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import NavBare from "../components/NavBare";
// import SideBar from "../components/SideBar";
// import axios from "axios";

// import { IoIosAdd } from "react-icons/io";
// import { FaCheckCircle } from "react-icons/fa";
// import { HiOutlineDownload } from "react-icons/hi";
// import { TiStarOutline } from "react-icons/ti";
// import { TbTrashX } from "react-icons/tb";
// import { GoCircle } from "react-icons/go";
// import { IoFolderOutline } from "react-icons/io5";
// import { TbFolderOpen } from "react-icons/tb";
// import { MdEdit } from "react-icons/md";
// import { IoIosCheckmarkCircleOutline } from "react-icons/io";
// import { CgAddR, CgCornerDownLeft } from "react-icons/cg";

// const Chemise = () => {
//   const token = localStorage.getItem("token");

//   const { bureauId } = useParams();
//   const [bureau, setBureau] = useState(null);

//   const [results, setResults] = useState([]);
//   const [selected, setSelected] = useState([]);

//   const getChemiseBureauId = (b) =>
//     Number(b?.id_service ?? b?.service_id ?? b?.serviceId ?? b?.service ?? NaN);

//   // Apply filters: by serviceId (if present) then by search query
//   const applyFilters = (list, query, brId) => {
//     let out = Array.isArray(list) ? [...list] : [];
//     if (brId) {
//       const bid = Number(brId);
//       out = out.filter((c) => getChemiseBureauId(c) === bid);
//     }
//     if (query?.trim()) {
//       const q = query.toLowerCase();
//       out = out.filter((c) =>
//         String(c?.bureau_name ?? c?.name ?? "")
//           .toLowerCase()
//           .includes(q)
//       );
//     }
//     return out;
//   };

//   const fetchBureau = async () => {
//     if (!bureauId) {
//       setBureau(null);
//       return;
//     }
//     try {
//       const { data: all } = await axios.get(
//         "http://localhost:3001/api/bureaus",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const bid = Number(bureauId);
//       const svc =
//         (all || []).find(
//           (b) => Number(b?.id_bureau ?? b?.bureau_id ?? bureau?.id) === bid
//         ) || null;

//       setBureau(svc);
//     } catch (error) {
//       console.error("Error fetching bureaux:", error);
//       setBureau(null);
//     }
//   };

//   // Fetch chemises from API
//   const fetchChemises = async () => {
//     try {
//       const res = await axios.get("http://localhost:3001/api/chemises", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const allChemises = res.data;

//       // Filter if bureauId exists
//       const filtered = bureauId
//         ? allChemises.filter((c) => c.bureauId === Number(bureauId))
//         : allChemises;

//       setResults(filtered);
//     } catch (err) {
//       console.error("Error fetching chemises:", err);
//     }
//   };

//   useEffect(() => {
//       setResults(applyFilters(chemises, search, bureauId));
//     }, [bureaux, search, bureauId]);

//   useEffect(() => {
//     fetchChemises();
//     fetchBureau()
//   }, [bureauId]);

//   // Delete chemise by ID
//   const handleDelete = async (id) => {
//     if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette chemise ?")) return;

//     try {
//       await axios.delete(`http://localhost:3001/api/chemises/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // Remove from UI without refetching everything
//       setResults((prev) => prev.filter((c) => c.id_chemise !== id));
//       setSelected((prev) => prev.filter((selectedId) => selectedId !== id));

//     } catch (err) {
//       console.error("Error deleting chemise:", err);
//       alert("Impossible de supprimer cette chemise.");
//     }
//   };

//   // Bulk delete selected chemises
//   const handleBulkDelete = async () => {
//     if (selected.length === 0) {
//       alert("Aucune chemise sélectionnée.");
//       return;
//     }

//     const confirmMessage = `Êtes-vous sûr de vouloir supprimer ${selected.length} chemise(s) sélectionnée(s) ?`;
//     if (!window.confirm(confirmMessage)) return;

//     try {
//       // Delete all selected chemises
//       const deletePromises = selected.map(id =>
//         axios.delete(`http://localhost:3001/api/chemises/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//       );

//       await Promise.all(deletePromises);

//       // Remove deleted chemises from UI
//       setResults((prev) => prev.filter((c) => !selected.includes(c.id_chemise)));
//       setSelected([]);

//       alert(`${selected.length} chemise(s) supprimée(s) avec succès.`);

//     } catch (err) {
//       console.error("Error bulk deleting chemises:", err);
//       alert("Erreur lors de la suppression des chemises sélectionnées.");
//     }
//   };

//   const handleSearch = (query) => {
//     if (query.trim() === "") {
//       fetchChemises();
//     } else {
//       const filtered = results.filter((chemise) =>
//         chemise.chemise_name.toLowerCase().includes(query.toLowerCase())
//       );
//       setResults(filtered);
//     }
//   };

//   const toggleSelect = (id) => {
//     setSelected((prev) =>
//       prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
//     );
//   };

//   return (
//     <div className="grid grid-cols-4">
//       <div className="col-span-1">
//         <SideBar />
//       </div>

//       <div className="col-span-3">
//         <div className="flex flex-col gap-4">
//           <NavBare onSearch={handleSearch} />
// <div className="flex justify-start items-center my-auto ml-8">
//             {bureauId && (
//               <Link to="/bureaux">
//                 <CgCornerDownLeft className="size-[30px] border-2 border-primary-green bg-green-4 text-primary-green" />
//               </Link>
//             )}
//             <p className="ml-6 font-medium text-lg border-b-[1.5px] border-primary-green">
//               {bureauId
//                 ? bureau
//                   ? `Chemise du bureau ${
//                       chemise?.bureau_name ?? chemise?.name ?? ""
//                     }`
//                   : "Chemise du bureau"
//                 : "Tous les Chemise"}
//             </p>
//           </div>
//           <div className="mx-auto w-[95%]">
//             {/* Top actions */}
//             <div className="bg-primary-green text-white rounded-md py-2 px-3 w-full">
//               <ul className="flex items-center justify-between">
//                 <li className="flex items-center bg-secondary-green px-3 py-1 rounded-lg cursor-pointer">
//                   <IoIosAdd className="size-[30px] mr-2" />
//                   New
//                 </li>
//                 <li className="flex items-center px-3 py-1 rounded-lg hover:bg-secondary-green cursor-pointer">
//                   <FaCheckCircle className="mr-2 size-[20px]" />
//                   {selected.length > 0 && `(${selected.length})`} sélectionné
//                 </li>
//                 <li className="flex items-center px-3 py-1 rounded-lg hover:bg-secondary-green cursor-pointer">
//                   <HiOutlineDownload className="mr-2 size-[25px]" />
//                   Télécharger
//                 </li>
//                 <li className="flex items-center px-3 py-1 rounded-lg hover:bg-secondary-green cursor-pointer">
//                   <TiStarOutline className="mr-2 size-[25px]" />
//                   favoré
//                 </li>
//                 <li
//                   className={`flex items-center px-3 py-1 rounded-lg cursor-pointer ${
//                     selected.length > 0
//                       ? 'hover:bg-red-600 bg-red-500'
//                       : 'hover:bg-secondary-green opacity-50'
//                   }`}
//                   onClick={handleBulkDelete}
//                 >
//                   <TbTrashX className="mr-2 size-[25px]" />
//                   Supprimer
//                 </li>
//               </ul>
//             </div>

//             {/* Table Header */}
//             <div className="grid grid-cols-[40px_40px_1fr_1fr_1fr_150px] items-center py-2 px-3 my-3 font-medium border-b">
//               <div>
//                 <GoCircle />
//               </div>
//               <div>
//                 <IoFolderOutline />
//               </div>
//               <div>Nom</div>
//               <div>Bureau</div>
//               <div>Créé</div>
//               <div className="text-center">Actions</div>
//             </div>

//             {/* Table Rows */}
//             {results.length > 0 ? (
//               <div>
//                 {results.map((chemise) => (
//                   <div
//                     key={chemise.id_chemise}
//                     className="grid grid-cols-[40px_40px_1fr_1fr_1fr_150px] items-center py-2 px-3 border-b text-sm hover:bg-gray-50"
//                   >
//                     <div onClick={() => toggleSelect(chemise.id_chemise)} className="cursor-pointer">
//                       {selected.includes(chemise.id_chemise) ? (
//                         <IoIosCheckmarkCircleOutline className="text-primary-green size-[20px]" />
//                       ) : (
//                         <GoCircle className="size-[16px]" />
//                       )}
//                     </div>
//                     <div>
//                       <TbFolderOpen className="size-[20px]" />
//                     </div>
//                     <div>{chemise.chemise_name}</div>
//                     <div>{chemise.bureau_name}</div>
//                     <div>{chemise.cCreatedDate}</div>
//                     <div className="flex justify-center space-x-2">
//                       <HiOutlineDownload className="size-[20px] cursor-pointer" />
//                       <MdEdit className="size-[20px] cursor-pointer" />
//                       <TiStarOutline className="size-[20px] cursor-pointer" />
//                       <TbTrashX
//                         className="size-[20px] text-red-500 cursor-pointer"
//                         onClick={() => handleDelete(chemise.id_chemise)}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="m-auto text-red-500 font-normal">Aucun résultat trouvé</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chemise;
// import React, { useState, useEffect } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import NavBare from "../components/NavBare";
// import SideBar from "../components/SideBar";
// import axios from "axios";

// import { IoIosAdd } from "react-icons/io";
// import { FaCheckCircle } from "react-icons/fa";
// import { HiOutlineDownload } from "react-icons/hi";
// import { TiStarOutline } from "react-icons/ti";
// import { TbTrashX } from "react-icons/tb";
// import { GoCircle } from "react-icons/go";
// import { IoFolderOutline } from "react-icons/io5";
// import { TbFolderOpen } from "react-icons/tb";
// import { MdEdit } from "react-icons/md";
// import { IoIosCheckmarkCircleOutline } from "react-icons/io";
// import { CgAddR, CgCornerDownLeft } from "react-icons/cg";

// const Chemise = () => {
//   const token = localStorage.getItem("token");
//   const { serviceId } = useParams();
//   const { bureauId } = useParams();
//   const navigate = useNavigate();

//   const [service, setService] = useState(null);
//   const [bureau, setBureau] = useState(null);
//   const [results, setResults] = useState([]);
//   const [selected, setSelected] = useState([]);
//   const [search, setSearch] = useState(""); // Added missing search state

//   const getChemiseBureauId = (c) =>
//     Number(c?.id_bureau ?? c?.bureau_id ?? c?.bureauId ?? NaN);

//   const fetchService = async () => {
//     if (!serviceId) {
//       setBureau(null);
//       return;
//     }
//     try {
//       const { data: all } = await axios.get(
//         "http://localhost:3001/api/services",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const sid = Number(serviceId);
//       const src =
//         (all || []).find(
//           (s) => Number(s?.id_service ?? s?.service_id ?? s?.id) === sid
//         ) || null;

//       setService(src);
//     } catch (error) {
//       console.error("Error fetching services:", error);
//       setService(null);
//     }
//   };

//   const fetchBureau = async () => {
//     if (!bureauId) {
//       setBureau(null);
//       return;
//     }
//     try {
//       const { data: all } = await axios.get(
//         "http://localhost:3001/api/bureaus",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const bid = Number(bureauId);
//       const brx =
//         (all || []).find(
//           (b) => Number(b?.id_bureau ?? b?.bureau_id ?? b?.id) === bid
//         ) || null;

//       setBureau(brx);
//     } catch (error) {
//       console.error("Error fetching bureaux:", error);
//       setBureau(null);
//     }
//   };

//   // Fetch chemises from API
//   const fetchChemises = async () => {
//     try {
//       const res = await axios.get("http://localhost:3001/api/chemises", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const allChemises = res.data;

//       // Filter if bureauId exists
//       const filtered = bureauId
//         ? allChemises.filter((c) => getChemiseBureauId(c) === Number(bureauId))
//         : allChemises;

//       setResults(filtered);
//     } catch (err) {
//       console.error("Error fetching chemises:", err);
//     }
//   };

//   const handleAddChemise = () => {
//     navigate("/addPage?type=chemise");
//   };

//   // Initial data fetch
//   useEffect(() => {
//     fetchChemises();
//     fetchBureau();
//     fetchService();
//   }, [bureauId]);

//   // Apply filters when search or bureauId changes
//   useEffect(() => {
//     if (search.trim() === "") {
//       fetchChemises(); // Refetch to get unfiltered data
//     } else {
//       const filtered = results.filter((chemise) =>
//         String(chemise?.chemise_name ?? chemise?.name ?? "")
//           .toLowerCase()
//           .includes(search.toLowerCase())
//       );
//       setResults(filtered);
//     }
//   }, [search]);

//   // Delete chemise by ID
//   const handleDelete = async (id) => {
//     if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette chemise ?"))
//       return;

//     try {
//       await axios.delete(`http://localhost:3001/api/chemises/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // Remove from UI without refetching everything
//       setResults((prev) => prev.filter((c) => c.id_chemise !== id));
//       setSelected((prev) => prev.filter((selectedId) => selectedId !== id));
//     } catch (err) {
//       console.error("Error deleting chemise:", err);
//       alert("Impossible de supprimer cette chemise.");
//     }
//   };

//   // Bulk delete selected chemises
//   const handleBulkDelete = async () => {
//     if (selected.length === 0) {
//       alert("Aucune chemise sélectionnée.");
//       return;
//     }

//     const confirmMessage = `Êtes-vous sûr de vouloir supprimer ${selected.length} chemise(s) sélectionnée(s) ?`;
//     if (!window.confirm(confirmMessage)) return;

//     try {
//       // Delete all selected chemises
//       const deletePromises = selected.map((id) =>
//         axios.delete(`http://localhost:3001/api/chemises/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//       );

//       await Promise.all(deletePromises);

//       // Remove deleted chemises from UI
//       setResults((prev) =>
//         prev.filter((c) => !selected.includes(c.id_chemise))
//       );
//       setSelected([]);

//       alert(`${selected.length} chemise(s) supprimée(s) avec succès.`);
//     } catch (err) {
//       console.error("Error bulk deleting chemises:", err);
//       alert("Erreur lors de la suppression des chemises sélectionnées.");
//     }
//   };

//   const handleSearch = (query) => {
//     setSearch(query); // Update search state, let useEffect handle the filtering
//   };

//   const toggleSelect = (id) => {
//     setSelected((prev) =>
//       prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
//     );
//   };

//   const headerText = bureauId
//     ? `Chemise du service ${service?.service_name ?? "..."} / bureau ${
//         bureau?.bureau_name ?? ""
//       }`
//     : "Toutes les chemises";

//   return (
//     <div className="grid grid-cols-4">
//       <div className="col-span-1">
//         <SideBar />
//       </div>

//       <div className="col-span-3">
//         <div className="flex flex-col gap-4">
//           <NavBare onSearch={handleSearch} />

//           <div className="flex justify-start items-center my-auto ml-8">
//             {bureauId && (
//               <button onClick={() => navigate(-1)}>
//                 <CgCornerDownLeft className="size-[30px] border-2 border-primary-green bg-green-4 text-primary-green" />
//               </button>
//             )}
//             <p className="ml-6 font-medium text-lg border-b-[1.5px] border-primary-green">
//               {headerText}
//             </p>
//           </div>

//           <div className="mx-auto w-[95%]">
//             {/* Top actions */}
//             <div className="bg-primary-green text-white rounded-md py-2 px-3 w-full">
//               <ul className="flex items-center justify-between">
//                 <li className="flex items-center bg-secondary-green px-3 py-1 rounded-lg cursor-pointer">
//                   <button
//                     onClick={handleAddChemise}
//                     className="flex items-center bg-secondary-green px-3 py-1 rounded-lg cursor-pointer"
//                   >
//                     <IoIosAdd className="size-[30px] mr-2" />
//                     New
//                   </button>
//                 </li>
//                 <li className="flex items-center px-3 py-1 rounded-lg hover:bg-secondary-green cursor-pointer">
//                   <FaCheckCircle className="mr-2 size-[20px]" />
//                   {selected.length > 0 && `(${selected.length})`} sélectionné
//                 </li>
//                 <li className="flex items-center px-3 py-1 rounded-lg hover:bg-secondary-green cursor-pointer">
//                   <HiOutlineDownload className="mr-2 size-[25px]" />
//                   Télécharger
//                 </li>
//                 {/* <li className="flex items-center px-3 py-1 rounded-lg hover:bg-secondary-green cursor-pointer">
//                   <TiStarOutline className="mr-2 size-[25px]" />
//                   Favoré
//                 </li> */}
//                 <li
//                   className={`flex items-center px-3 py-1 rounded-lg cursor-pointer ${
//                     selected.length > 0
//                       ? "hover:bg-red-600 bg-red-500"
//                       : "hover:bg-secondary-green opacity-50"
//                   }`}
//                   onClick={handleBulkDelete}
//                 >
//                   <TbTrashX className="mr-2 size-[25px]" />
//                   Supprimer
//                 </li>
//               </ul>
//             </div>

//             {/* Table Header */}
//             <div className="grid grid-cols-[40px_40px_1fr_1fr_1fr_150px] items-center py-2 px-3 my-3 font-medium border-b">
//               <div>
//                 <GoCircle />
//               </div>
//               <div>
//                 <IoFolderOutline />
//               </div>
//               <div>Nom</div>
//               <div>Bureau</div>
//               <div>Créé</div>
//               <div className="text-center">Actions</div>
//             </div>

//             {/* Table Rows */}
//             {results.length > 0 ? (
//               <div>
//                 {results.map((chemise) => (
//                   <div
//                     key={chemise.id_chemise}
//                     className="grid grid-cols-[40px_40px_1fr_1fr_1fr_150px] items-center py-2 px-3 border-b text-sm hover:bg-gray-50"
//                   >
//                     <div
//                       onClick={() => toggleSelect(chemise.id_chemise)}
//                       className="cursor-pointer"
//                     >
//                       {selected.includes(chemise.id_chemise) ? (
//                         <IoIosCheckmarkCircleOutline className="text-primary-green size-[20px]" />
//                       ) : (
//                         <GoCircle className="size-[16px]" />
//                       )}
//                     </div>
//                     <div>
//                       <TbFolderOpen className="size-[20px]" />
//                     </div>
//                     <div>{chemise.chemise_name}</div>
//                     <div>{chemise.bureau_name}</div>
//                     <div>
//                       {new Date(chemise.cCreatedDate).toLocaleDateString()}
//                     </div>
//                     <div className="flex justify-center space-x-2">
//                       <HiOutlineDownload className="size-[20px] cursor-pointer hover:text-blue-600" />
//                       <MdEdit className="size-[20px] cursor-pointer hover:text-green-600" />
//                       {/* <TiStarOutline className="size-[20px] cursor-pointer hover:text-yellow-600" /> */}
//                       <TbTrashX
//                         className="size-[20px] text-red-500 cursor-pointer hover:text-red-700"
//                         onClick={() => handleDelete(chemise.id_chemise)}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-8">
//                 <p className="text-gray-500 font-normal">
//                   Aucun résultat trouvé
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chemise;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import NavBare from "../components/NavBare";
import SideBar from "../components/SideBar";
import axios from "axios";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import { IoIosAdd } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";
import { HiOutlineDownload } from "react-icons/hi";
import { TbTrashX } from "react-icons/tb";
import { GoCircle } from "react-icons/go";
import { IoFolderOutline } from "react-icons/io5";
import { TbFolderOpen } from "react-icons/tb";
import { MdEdit } from "react-icons/md";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { CgCornerDownLeft } from "react-icons/cg";

const Chemise = () => {
  const token = localStorage.getItem("token");
  const { bureauId } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [bureau, setBureau] = useState(null);
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");

  const getChemiseBureauId = (c) =>
    Number(c?.id_bureau ?? c?.bureau_id ?? c?.bureauId ?? NaN);

  // Fetch bureau and then its service
  const fetchBureau = async () => {
    if (!bureauId) return;
    try {
      const { data: all } = await axios.get(
        "http://localhost:3001/api/bureaus",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const bid = Number(bureauId);
      const brx = (all || []).find(
        (b) => Number(b?.id_bureau ?? b?.bureau_id ?? b?.id) === bid
      );
      setBureau(brx || null);

      // If bureau has a service_id, fetch its service
      if (brx?.service_id) {
        fetchService(brx.service_id);
      }
    } catch (error) {
      console.error("Error fetching bureaux:", error);
      setBureau(null);
    }
  };

  // Fetch service by ID
  const fetchService = async (sid) => {
    if (!sid) return;
    try {
      const { data: all } = await axios.get(
        "http://localhost:3001/api/services",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const src = (all || []).find(
        (s) => Number(s?.id_service ?? s?.service_id ?? s?.id) === Number(sid)
      );
      setService(src || null);
    } catch (error) {
      console.error("Error fetching services:", error);
      setService(null);
    }
  };

  // Fetch chemises
  const fetchChemises = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/chemises", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allChemises = res.data;

      // If bureauId is present, filter chemises for that bureau
      const filtered = bureauId
        ? allChemises.filter((c) => getChemiseBureauId(c) === Number(bureauId))
        : allChemises;

      setResults(filtered);
    } catch (err) {
      console.error("Error fetching chemises:", err);
    }
  };

  const handleAddChemise = () => {
    navigate("/addPage?type=chemise");
  };

  useEffect(() => {
    fetchChemises();
    fetchBureau();
  }, [bureauId]);

  useEffect(() => {
    if (search.trim() === "") {
      fetchChemises();
    } else {
      setResults((prev) =>
        prev.filter((chemise) =>
          String(chemise?.chemise_name ?? "")
            .toLowerCase()
            .includes(search.toLowerCase())
        )
      );
    }
  }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette chemise ?"))
      return;

    try {
      await axios.delete(`http://localhost:3001/api/chemises/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults((prev) => prev.filter((c) => c.id_chemise !== id));
      setSelected((prev) => prev.filter((sid) => sid !== id));
    } catch (err) {
      console.error("Error deleting chemise:", err);
      alert("Impossible de supprimer cette chemise.");
    }
  };

  const handleBulkDelete = async () => {
    if (selected.length === 0) {
      alert("Aucune chemise sélectionnée.");
      return;
    }
    if (!window.confirm(`Supprimer ${selected.length} chemise(s) ?`)) return;

    try {
      await Promise.all(
        selected.map((id) =>
          axios.delete(`http://localhost:3001/api/chemises/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      setResults((prev) =>
        prev.filter((c) => !selected.includes(c.id_chemise))
      );
      setSelected([]);
      alert(`${selected.length} chemise(s) supprimée(s).`);
    } catch (err) {
      console.error("Error bulk deleting chemises:", err);
      alert("Erreur lors de la suppression.");
    }
  };

  const handleSearch = (query) => setSearch(query);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Handle row click to navigate to documents
  const handleRowClick = (id, e) => {
    // Don't navigate if clicking on action buttons or selection checkbox
    if (e.target.closest('button, a, [role="button"]')) {
      return;
    }
    navigate(`/document/${id}`);
  };

  // Header text logic
  const headerText = bureauId
    ? service && bureau
      ? `Chemise du service ${service.service_name} / bureau ${bureau.bureau_name}`
      : "Chargement..."
    : "Toutes les chemises";

  // Download all documents of a chemise as ZIP
  // const handleDownloadChemise = async (chemise) => {
  //   try {
  //     const { data: allDocs } = await axios.get(
  //       "http://localhost:3001/api/documents",
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     console.log("Chemise id:", chemise.id_chemise);
  //     console.log("All documents:", allDocs);

  //     const docs = allDocs.filter(
  //       (d) =>
  //         Number(d.chemise_id ?? d.id_chemise ?? d.chemiseId) ===
  //         chemise.id_chemise
  //     );

  //     if (docs.length === 0) {
  //       alert("Cette chemise ne contient aucun document.");
  //       return;
  //     }

  //     const zip = new JSZip();

  //     await Promise.all(
  //       docs.map(async (doc) => {
  //         try {
  //           const response = await fetch(doc.document_data, {
  //             headers: { Authorization: `Bearer ${token}` },
  //           });
  //           const blob = await response.blob();
  //           const ext = doc.document_type || "";
  //           const filename = doc.document_name || `document.${ext}`;
  //           zip.file(filename, blob);
  //         } catch (err) {
  //           console.error("Erreur de téléchargement:", doc.document_name, err);
  //         }
  //       })
  //     );

  //     const content = await zip.generateAsync({ type: "blob" });
  //     saveAs(content, `${chemise.chemise_name || "chemise"}.zip`);
  //   } catch (err) {
  //     console.error("Erreur lors du téléchargement de la chemise:", err);
  //     alert("Impossible de télécharger cette chemise.");
  //   }
  // };

  const handleDownloadChemise = async (chemise) => {
    try {
      const { data: allDocs } = await axios.get(
        "http://localhost:3001/api/documents",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // filter docs by chemise_name
      const docs = allDocs.filter(
        (d) => d.chemise_name === chemise.chemise_name
      );

      console.log("Chemise:", chemise.chemise_name);
      console.log("Documents found:", docs);

      if (docs.length === 0) {
        alert("Cette chemise ne contient aucun document.");
        return;
      }

      const zip = new JSZip();
      for (const doc of docs) {
        // here you'd normally fetch the file binary (e.g. axios.get with responseType: "blob")
        // but since you only have document_name/place now, we’ll just add a placeholder
        zip.file(
          `${doc.document_name}.txt`,
          `Placeholder for ${doc.document_name}`
        );
      }
//       for (const doc of docs) {
// const folder = zip.folder(chemise.chemise_name);

//   try {
//     const response = await axios.get(
//       `http://localhost:3001/api/documents/${doc.id_document}/download`,
//       {
//         headers: { Authorization: `Bearer ${token}` },
//         responseType: "blob", // this is key!
//       }
//     );

//     // Use the original document type/extension
//     const extension = doc.document_type || "txt";

//     // Add the real file to the zip
//     folder.file(`${doc.document_name}.${extension}`, response.data);
//   } catch (err) {
//     console.error(`Error downloading file ${doc.document_name}:`, err);
//     // fallback: still include a note
//     folder.file(
//       `${doc.document_name}_ERROR.txt`,
//       `Impossible de télécharger ${doc.document_name}`
//     );
//   }
// }


      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${chemise.chemise_name}.zip`);
    } catch (err) {
      console.error("Error downloading chemise:", err);
      alert("Erreur lors du téléchargement de la chemise.");
    }
  };

  const handleBulkDownload = async () => {
    if (selected.length === 0) {
      alert("Aucune chemise sélectionnée.");
      return;
    }

    try {
      const { data: allDocs } = await axios.get(
        "http://localhost:3001/api/documents",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const zip = new JSZip();

      // Loop over each selected chemise
      for (const chemiseId of selected) {
        const chemise = results.find((c) => c.id_chemise === chemiseId);
        if (!chemise) continue;

        // Filter documents for this chemise
        const docs = allDocs.filter(
          (d) => d.chemise_name === chemise.chemise_name
        );

        if (docs.length === 0) continue;

        // Create a folder inside the zip for this chemise
        const folder = zip.folder(chemise.chemise_name);

        for (const doc of docs) {
          // Placeholder file (replace with actual file content later)
          folder.file(
            `${doc.document_name}.txt`,
            `Placeholder for ${doc.document_name}`
          );
        }
      }

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `chemises_selectionnees.zip`);
    } catch (err) {
      console.error("Error bulk downloading chemises:", err);
      alert("Erreur lors du téléchargement des chemises.");
    }
  };

  return (
    <div className="grid grid-cols-4 h-screen">
      <div className="col-span-1 h-screen">
        <SideBar />
      </div>

      <div className="col-span-3 overflow-y-auto">
        <div className="flex flex-col gap-4">
          <NavBare onSearch={handleSearch} />

          <div className="flex justify-start items-center my-auto ml-8">
            {bureauId && (
              <button onClick={() => navigate(-1)}>
                <CgCornerDownLeft className="size-[30px] border-2 border-primary-green bg-green-4 text-primary-green" />
              </button>
            )}
            <p className="ml-6 font-medium text-lg border-b-[1.5px] border-primary-green">
              {headerText}
            </p>
          </div>

          <div className="mx-auto w-[95%]">
            {/* Top actions */}
            <div className="bg-primary-green text-white rounded-md py-2 px-3 w-full">
              <ul className="flex items-center justify-between">
                <li>
                  <button
                    onClick={handleAddChemise}
                    className="flex items-center bg-secondary-green px-3 py-1 rounded-lg cursor-pointer"
                  >
                    <IoIosAdd className="size-[30px] mr-2" />
                    New
                  </button>
                </li>
                <li className="flex items-center px-3 py-1 rounded-lg hover:bg-secondary-green cursor-pointer">
                  <FaCheckCircle className="mr-2 size-[20px]" />
                  {selected.length > 0 && `(${selected.length})`} sélectionné
                </li>

                <li
                  className={`flex items-center px-3 py-1 rounded-lg cursor-pointer ${
                    selected.length > 0
                      ? "hover:bg-green-3 bg-secondary-green text-white"
                      : "hover:bg-secondary-green opacity-50"
                  }`}
                  onClick={handleBulkDownload}
                >
                  <HiOutlineDownload className="mr-2 size-[25px]" />
                  Télécharger
                </li>
                <li
                  className={`flex items-center px-3 py-1 rounded-lg cursor-pointer ${
                    selected.length > 0
                      ? "hover:bg-red-600 bg-red-500"
                      : "hover:bg-secondary-green opacity-50"
                  }`}
                  onClick={handleBulkDelete}
                >
                  <TbTrashX className="mr-2 size-[25px]" />
                  Supprimer
                </li>
              </ul>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-[40px_40px_1fr_1fr_1fr_150px] items-center py-2 px-3 my-3 font-medium border-b">
              <div>
                <GoCircle />
              </div>
              <div>
                <IoFolderOutline />
              </div>
              <div>Nom</div>
              <div>Bureau</div>
              <div>Créé</div>
              <div className="text-center">Actions</div>
            </div>

            {/* Table Rows */}
            {results.length > 0 ? (
              <div>
                {results.map((chemise) => (
                  <div
                    key={chemise.id_chemise}
                    className="grid grid-cols-[40px_40px_1fr_1fr_1fr_150px] items-center py-2 px-3 border-b text-sm hover:bg-gray-50 cursor-pointer"
                    onClick={(e) => handleRowClick(chemise.id_chemise, e)}
                  >
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelect(chemise.id_chemise);
                      }}
                      className="cursor-pointer"
                    >
                      {selected.includes(chemise.id_chemise) ? (
                        <IoIosCheckmarkCircleOutline className="text-primary-green size-[20px]" />
                      ) : (
                        <GoCircle className="size-[16px]" />
                      )}
                    </div>
                    <div>
                      <TbFolderOpen className="size-[20px]" />
                    </div>
                    <div>{chemise.chemise_name}</div>
                    <div>{chemise.bureau_name}</div>
                    <div>
                      {new Date(chemise.cCreatedDate).toLocaleDateString()}
                    </div>
                    <div
                      className="flex justify-center space-x-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <HiOutlineDownload
                        className="size-[20px] cursor-pointer hover:text-blue-600"
                        onClick={() => handleDownloadChemise(chemise)}
                      />
                      <Link to={`/editChemise/${chemise.id_chemise}`}>
                        <MdEdit className="size-[20px] cursor-pointer hover:text-green-600" />
                      </Link>
                      <TbTrashX
                        className="size-[20px] text-red-500 cursor-pointer hover:text-red-700"
                        onClick={() => handleDelete(chemise.id_chemise)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 font-normal">
                  Aucun résultat trouvé
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chemise;
