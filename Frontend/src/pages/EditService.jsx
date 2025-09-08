// import React, { useState, useEffect } from "react";
// import NavBare from "../components/NavBare";
// import SideBar from "../components/SideBar";
// import axios from "axios";

// const EditService = () => {
//     // const token = localStorage.getItem("token");

//     // const [results, setResults] = useState([]);

//     // useEffect(() => {
//     //     const fetchServices = async () => {
//     //       try {
//     //         const token = localStorage.getItem("token");
//     //         const response = await axios.get("http://localhost:3001/api/services", {
//     //           headers: { Authorization: `Bearer ${token}` },
//     //         });

//     //         console.log("API response:", response.data);

//     //         setResults(response.data || []);
//     //       } catch (error) {
//     //         console.error("Error fetching services:", error);
//     //         setResults([]);
//     //       }
//     //     };

//     //     fetchServices();
//     //   }, []);

//       const token = localStorage.getItem("token");
//       const [results, setResults] = useState({});
//       const [error, setError] = useState("");
//       const [success, setSuccess] = useState("");
//       const [loading, setLoading] = useState(false);
//       const [query, setQuery] = useState("");

//       const [selectedPopup, setSelectedPopup] = useState(null);
//       const [deleteStep, setDeleteStep] = useState(null); // 'service' or 'bureau'
//       const [services, setServices] = useState([]);
//       const [bureaus, setBureaus] = useState([]);
//       const [selectedItem, setSelectedItem] = useState(null); // Changed from selectedItemId
//       const [formValues, setFormValues] = useState({
//         service_name: "",

// service_place:"",

// sCreatedDate
// : "",

// sDescription
// : "",
//       });

//       // Function to reset form values
//       const resetFormValues = () => {
//         setFormValues({
//           service_name: "",

// service_place:"",

// sCreatedDate
// : "",

// sDescription
// : "",
//         });
//       };

//       // Function to reset delete state
//       const resetDeleteState = () => {
//         setDeleteStep(null);
//         setSelectedItem(null);
//         setServices([]);
//         setBureaus([]);
//         setQuery(""); // Reset query
//       };

//       // Function to fetch user profile data
//       const fetchUserProfile = async () => {
//         try {
//           const response = await axios.get(
//             "http://localhost:3001/api/users/profile",
//             {
//               headers: { Authorization: `Bearer ${token}` },
//             }
//           );
//           setResults(response.data || {});
//         } catch (error) {
//           console.error("Error fetching params:", error);
//           setResults({});
//         }
//       };

//       // Function to fetch services
//       const fetchServices = async () => {
//         setLoading(true);
//         try {
//           const response = await axios.get(
//             "http://localhost:3001/api/services",
//             {
//               headers: { Authorization: `Bearer ${token}` },
//             }
//           );
//           setServices(response.data || []);
//         } catch (error) {
//           console.error("Error fetching services:", error);
//           setServices([]);
//           setError("Impossible de charger les services.");
//         } finally {
//           setLoading(false);
//         }
//       };

//       const handleChange = (e) => {
//         const { id, value } = e.target;
//         setFormValues((prev) => ({
//           ...prev,
//           [id]: value,
//         }));
//       };

//       const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError("");
//         setSuccess("");

//         try {
//           const response = await axios.put(
//             "http://localhost:3001/api/services",
//             { ...formValues },
//             {
//               headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );

//           if (response.status === 200) {
//             setSuccess("Mise à jour effectuée avec succès !");
//             await fetchUserProfile();
//           }

//           setTimeout(() => setSuccess(""), 4000);
//         } catch (err) {
//           console.error("Update error:", err);
//           setError("Impossible de mettre à jour. Réessayez plus tard.");
//         } finally {
//           setLoading(false);

//         }
//       };

//       useEffect(() => {
//         fetchServices;
//       }, [token]);

//   return (
//     <div className="grid grid-cols-4">
//       <div className="grid col-span-1">
//         <SideBar />
//       </div>
//       <div className="grid col-span-3">
//         <div className="flex flex-col">
//           <NavBare />
//           <div className="m-auto">
//             <h1 className="text-primary-green font-semibold text-2xl">Les informations de la chemise</h1>
//             <form action="" onClick={handleSubmit}>
//               <div>
//                 <label htmlFor="nom">Nom :</label>
//                 <input type="text" id="nom" value={services.service_name}/>
//               </div>
//               <div>
//                 <label htmlFor="placement">Archivé dans :</label>
//                 <input type="text" id="placement" value={services.service_place}/>
//               </div>
//                <div>
//                 <label htmlFor="dCreation">Crée le :</label>
//                 <input type="text" id="dCreation" value={services.sCreatedDate}/>
//               </div>
//                <div>
//                 <label htmlFor="desccription">Description :</label>
//                 <input type="text" id="desccription" value={services.sDescription} />
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditService;
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import NavBare from "../components/NavBare";
// import SideBar from "../components/SideBar";
// import axios from "axios";

// const EditService = () => {
//   const token = localStorage.getItem("token");

//   const { serviceId } = useParams();
//   const navigate = useNavigate();

//   const [service, setService] = useState(null);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);

//   const [formValues, setFormValues] = useState({
//     service_name: "",
//     service_place: "",
//     sCreatedDate: "",
//     sDescription: "",
//   });

//   const getServiceId = (s) =>
//     Number(s?.id_service ?? s?.service_id ?? s?.serviceId ?? s?.service ?? NaN);

//   // Function to fetch specific service details
//   const fetchServiceDetails = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `http://localhost:3001/api/services`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       const sid = Number(serviceId);
//       const svc =
//         ( []).find(
//           (s) => Number(s?.id_service ?? s?.service_id ?? s?.id) === sid
//         ) || null;

//       setService(svc);
//       console.log(response.data)

//       const serviceData = response.data;
//       setService(serviceData);

//       // Populate form with current service data
//       setFormValues({
//         service_name: serviceData.service_name || "",
//         service_place: serviceData.service_place || "",
//         sCreatedDate: serviceData.sCreatedDate || "",
//         sDescription: serviceData.sDescription || "",
//       });
//     } catch (error) {
//       console.error("Error fetching service details:", error);
//       setError("Impossible de charger les détails du service.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { id, value } = e.target;
//     setFormValues((prev) => ({
//       ...prev,
//       [id]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       const response = await axios.put(
//         `http://localhost:3001/api/services/${serviceId}`,
//         { ...formValues },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.status === 200) {
//         setSuccess("Service mis à jour avec succès !");
//         setIsEditing(false);
//         // Refresh service details
//         await fetchServiceDetails();
//       }

//       setTimeout(() => setSuccess(""), 4000);
//     } catch (err) {
//       console.error("Update error:", err);
//       setError("Impossible de mettre à jour le service. Réessayez plus tard.");
//       setTimeout(() => setError(""), 4000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     // Reset form to original values
//     if (service) {
//       setFormValues({
//         service_name: service.service_name || "",
//         service_place: service.service_place || "",
//         sCreatedDate: service.sCreatedDate || "",
//         sDescription: service.sDescription || "",
//       });
//     }
//     setIsEditing(false);
//     setError("");
//     setSuccess("");
//   };

//   const handleBack = () => {
//     navigate(-1); // Go back to previous page
//   };

//   useEffect(() => {
//     if (serviceId && token) {
//       fetchServiceDetails();
//     }
//   }, [serviceId, token]);

//   if (loading && !service) {
//     return (
//       <div className="grid grid-cols-4 min-h-screen">
//         <div className="grid col-span-1">
//           <SideBar />
//         </div>
//         <div className="grid col-span-3">
//           <div className="flex flex-col">
//             <NavBare />
//             <div className="m-auto p-8">
//               <div className="text-center">Chargement...</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!service && !loading) {
//     return (
//       <div className="grid grid-cols-4 min-h-screen">
//         <div className="grid col-span-1">
//           <SideBar />
//         </div>
//         <div className="grid col-span-3">
//           <div className="flex flex-col">
//             <NavBare />
//             <div className="m-auto p-8">
//               <div className="text-center text-red-600">Service non trouvé</div>
//               <button
//                 onClick={handleBack}
//                 className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
//               >
//                 Retour
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-4 min-h-screen">
//       <div className="grid col-span-1">
//         <SideBar />
//       </div>
//       <div className="grid col-span-3">
//         <div className="flex flex-col">
//           <NavBare />
//           <div className="p-8 max-w-2xl mx-auto w-full">
//             {/* Header */}
//             <div className="flex justify-between items-center mb-6">
//               <h1 className="text-primary-green font-semibold text-2xl">
//                 Détails du Service
//               </h1>
//               <button
//                 onClick={handleBack}
//                 className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
//               >
//                 Retour
//               </button>
//             </div>

//             {/* Success/Error Messages */}
//             {success && (
//               <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
//                 {success}
//               </div>
//             )}
//             {error && (
//               <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
//                 {error}
//               </div>
//             )}

//             {/* Service Details Form */}
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="space-y-4">
//                 <div>
//                   <label
//                     htmlFor="service_name"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     Nom du Service :
//                   </label>
//                   <input
//                     type="text"
//                     id="service_name"
//                     value={formValues.service_name}
//                     onChange={handleChange}
//                     disabled={!isEditing}
//                     className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green ${
//                       !isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
//                     }`}
//                   />
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="service_place"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     Archivé dans :
//                   </label>
//                   <input
//                     type="text"
//                     id="service_place"
//                     value={formValues.service_place}
//                     onChange={handleChange}
//                     disabled={!isEditing}
//                     className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green ${
//                       !isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
//                     }`}
//                   />
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="sCreatedDate"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     Créé le :
//                   </label>
//                   <input
//                     type="date"
//                     id="sCreatedDate"
//                     value={formValues.sCreatedDate}
//                     onChange={handleChange}
//                     disabled={!isEditing}
//                     className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green ${
//                       !isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
//                     }`}
//                   />
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="sDescription"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     Description :
//                   </label>
//                   <textarea
//                     id="sDescription"
//                     value={formValues.sDescription}
//                     onChange={handleChange}
//                     disabled={!isEditing}
//                     rows="4"
//                     className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green ${
//                       !isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
//                     }`}
//                   />
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex justify-end space-x-4 pt-4">
//                 {!isEditing ? (
//                   <button
//                     type="button"
//                     onClick={() => setIsEditing(true)}
//                     className="px-6 py-2 bg-primary-green text-white rounded-md hover:bg-primary-green-dark focus:outline-none focus:ring-2 focus:ring-primary-green"
//                   >
//                     Modifier
//                   </button>
//                 ) : (
//                   <>
//                     <button
//                       type="button"
//                       onClick={handleCancel}
//                       className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
//                     >
//                       Annuler
//                     </button>
//                     <button
//                       type="submit"
//                       disabled={loading}
//                       className="px-6 py-2 bg-primary-green text-white rounded-md hover:bg-primary-green-dark focus:outline-none focus:ring-2 focus:ring-primary-green disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       {loading ? "Sauvegarde..." : "Sauvegarder"}
//                     </button>
//                   </>
//                 )}
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditService;
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import NavBare from "../components/NavBare";
// import SideBar from "../components/SideBar";
// import axios from "axios";

// const EditService = () => {
//   const token = localStorage.getItem("token");

//   const { serviceId } = useParams();
//   const navigate = useNavigate();

//   const [service, setService] = useState(null);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);

//   const [formValues, setFormValues] = useState({
//     service_name: "",
//     service_place: "",
//     sCreatedDate: "",
//     sDescription: "",
//   });

//   // Fetch one service details
//   const fetchServiceDetails = async () => {
//     setLoading(true);
//     try {

//       const response = await axios.get(
//         `http://localhost:3001/api/services/${serviceId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       console.log("Full response:", response);
//       console.log("Response data:", response.data);
//       console.log("Response data type:", typeof response.data);
//       console.log("Response data keys:", Object.keys(response.data || {}));
//       // const svc = response.data;
//       // if (!svc) {
//       //   setService(null);
//       //   setError("Service non trouvé.");
//       //   return;
//       // }
//        let svc = response.data;
      
//       // If response.data has a service property, use that
//       if (response.data && response.data.service) {
//         svc = response.data.service;
//       }
//       // If response.data has a data property, use that
//       else if (response.data && response.data.data) {
//         svc = response.data.data;
//       }

//       console.log("Extracted service:", svc);

//       // Check if service exists and has expected properties
//       if (!svc || (typeof svc === 'object' && Object.keys(svc).length === 0)) {
//         setService(null);
//         setError("Service non trouvé.");
//         return;
//       }


//       setService(svc);

//       // Populate form with current service data
//       setFormValues({
//         service_name: svc.service_name || "",
//         service_place: svc.service_place || "",
//         sCreatedDate: svc.sCreatedDate || "",
//         sDescription: svc.sDescription || "",
//       });
//     // } catch (error) {
//     //   console.error("Error fetching service details:", error);
//     //   setError("Impossible de charger les détails du service.");
//     // } finally {
//     //   setLoading(false);
//     // }
//     }catch (error) {
//       console.error("Error fetching service details:", error);
//       console.error("Error response:", error.response);
      
//       if (error.response) {
//         // Server responded with error status
//         if (error.response.status === 404) {
//           setError("Service non trouvé.");
//         } else {
//           setError(`Erreur du serveur: ${error.response.status} - ${error.response.data?.message || 'Erreur inconnue'}`);
//         }
//       } else if (error.request) {
//         // Request was made but no response received
//         setError("Impossible de contacter le serveur.");
//       } else {
//         // Something else happened
//         setError("Erreur lors de la récupération du service.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { id, value } = e.target;
//     setFormValues((prev) => ({
//       ...prev,
//       [id]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       const response = await axios.put(
//         `http://localhost:3001/api/services/${serviceId}`,
//         { ...formValues },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.status === 200) {
//         setSuccess("Service mis à jour avec succès !");
//         setIsEditing(false);
//         await fetchServiceDetails();
//       }

//       setTimeout(() => setSuccess(""), 4000);
//     } catch (err) {
//       console.error("Update error:", err);
//       setError("Impossible de mettre à jour le service. Réessayez plus tard.");
//       setTimeout(() => setError(""), 4000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     if (service) {
//       setFormValues({
//         service_name: service.service_name || "",
//         service_place: service.service_place || "",
//         sCreatedDate: service.sCreatedDate || "",
//         sDescription: service.sDescription || "",
//       });
//     }
//     setIsEditing(false);
//     setError("");
//     setSuccess("");
//   };

//   const handleBack = () => {
//     navigate(-1);
//   };

//   useEffect(() => {
//     if (serviceId && token) {
//       fetchServiceDetails();
//     }
//   }, [serviceId, token]);

//   if (loading && !service) {
//     return (
//       <div className="grid grid-cols-4 min-h-screen">
//         <div className="grid col-span-1">
//           <SideBar />
//         </div>
//         <div className="grid col-span-3">
//           <div className="flex flex-col">
//             <NavBare />
//             <div className="m-auto p-8">
//               <div className="text-center">Chargement...</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!service && !loading) {
//     return (
//       <div className="grid grid-cols-4 min-h-screen">
//         <div className="grid col-span-1">
//           <SideBar />
//         </div>
//         <div className="grid col-span-3">
//           <div className="flex flex-col">
//             <NavBare />
//             <div className="m-auto p-8">
//               <div className="text-center text-red-600">
//                 Service non trouvé
//               </div>
//               <button
//                 onClick={handleBack}
//                 className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
//               >
//                 Retour
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-4 min-h-screen">
//       <div className="grid col-span-1">
//         <SideBar />
//       </div>
//       <div className="grid col-span-3">
//         <div className="flex flex-col">
//           <NavBare />
//           <div className="p-8 max-w-2xl mx-auto w-full">
//             {/* Header */}
//             <div className="flex justify-between items-center mb-6">
//               <h1 className="text-primary-green font-semibold text-2xl">
//                 Détails du Service
//               </h1>
//               <button
//                 onClick={handleBack}
//                 className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
//               >
//                 Retour
//               </button>
//             </div>

//             {/* Success/Error Messages */}
//             {success && (
//               <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
//                 {success}
//               </div>
//             )}
//             {error && (
//               <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
//                 {error}
//               </div>
//             )}

//             {/* Service Details Form */}
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="space-y-4">
//                 <div>
//                   <label
//                     htmlFor="service_name"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     Nom du Service :
//                   </label>
//                   <input
//                     type="text"
//                     id="service_name"
//                     value={formValues.service_name}
//                     onChange={handleChange}
//                     disabled={!isEditing}
//                     className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green ${
//                       !isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
//                     }`}
//                   />
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="service_place"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     Archivé dans :
//                   </label>
//                   <input
//                     type="text"
//                     id="service_place"
//                     value={formValues.service_place}
//                     onChange={handleChange}
//                     disabled={!isEditing}
//                     className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green ${
//                       !isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
//                     }`}
//                   />
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="sCreatedDate"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     Créé le :
//                   </label>
//                   <input
//                     type="date"
//                     id="sCreatedDate"
//                     value={formValues.sCreatedDate}
//                     onChange={handleChange}
//                     disabled={!isEditing}
//                     className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green ${
//                       !isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
//                     }`}
//                   />
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="sDescription"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     Description :
//                   </label>
//                   <textarea
//                     id="sDescription"
//                     value={formValues.sDescription}
//                     onChange={handleChange}
//                     disabled={!isEditing}
//                     rows="4"
//                     className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green ${
//                       !isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
//                     }`}
//                   />
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex justify-end space-x-4 pt-4">
//                 {!isEditing ? (
//                   <button
//                     type="button"
//                     onClick={() => setIsEditing(true)}
//                     className="px-6 py-2 bg-primary-green text-white rounded-md hover:bg-primary-green-dark focus:outline-none focus:ring-2 focus:ring-primary-green"
//                   >
//                     Modifier
//                   </button>
//                 ) : (
//                   <>
//                     <button
//                       type="button"
//                       onClick={handleCancel}
//                       className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
//                     >
//                       Annuler
//                     </button>
//                     <button
//                       type="submit"
//                       disabled={loading}
//                       className="px-6 py-2 bg-primary-green text-white rounded-md hover:bg-primary-green-dark focus:outline-none focus:ring-2 focus:ring-primary-green disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       {loading ? "Sauvegarde..." : "Sauvegarder"}
//                     </button>
//                   </>
//                 )}
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditService;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBare from "../components/NavBare";
import SideBar from "../components/SideBar";
import axios from "axios";

const EditService = () => {
  const token = localStorage.getItem("token");

  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formValues, setFormValues] = useState({
    service_name: "",
    service_place: "",
    sCreatedDate: "",
    sDescription: "",
  });

  // Fetch one service details
  const fetchServiceDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3001/api/services/${serviceId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Debug: Log the entire response to see the structure
      console.log("Full response:", response);
      console.log("Response data:", response.data);
      console.log("Response data type:", typeof response.data);
      console.log("Response data keys:", Object.keys(response.data || {}));

      // The service data might be nested in response.data
      // Common patterns: response.data, response.data.service, response.data.data
      let svc = response.data;
      
      // If response.data has a service property, use that
      if (response.data && response.data.service) {
        svc = response.data.service;
      }
      // If response.data has a data property, use that
      else if (response.data && response.data.data) {
        svc = response.data.data;
      }

      console.log("Extracted service:", svc);

      // Check if service exists and has expected properties
      if (!svc || (typeof svc === 'object' && Object.keys(svc).length === 0)) {
        setService(null);
        setError("Service non trouvé.");
        return;
      }

      setService(svc);

      // Populate form with current service data
      setFormValues({
        service_name: svc.service_name || "",
        service_place: svc.service_place || "",
        sCreatedDate: svc.sCreatedDate || "",
        sDescription: svc.sDescription || "",
      });

      // Clear any previous errors
      setError("");
      
    } catch (error) {
      console.error("Error fetching service details:", error);
      console.error("Error response:", error.response);
      
      if (error.response) {
        // Server responded with error status
        if (error.response.status === 404) {
          setError("Service non trouvé.");
        } else {
          setError(`Erreur du serveur: ${error.response.status} - ${error.response.data?.message || 'Erreur inconnue'}`);
        }
      } else if (error.request) {
        // Request was made but no response received
        setError("Impossible de contacter le serveur.");
      } else {
        // Something else happened
        setError("Erreur lors de la récupération du service.");
      }
    } finally {
      setLoading(false);
    }
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
        `http://localhost:3001/api/services/${serviceId}`,
        { ...formValues },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccess("Service mis à jour avec succès !");
        setIsEditing(false);
        await fetchServiceDetails();
      }

      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("Update error:", err);
      setError("Impossible de mettre à jour le service. Réessayez plus tard.");
      setTimeout(() => setError(""), 4000);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (service) {
      setFormValues({
        service_name: service.service_name || "",
        service_place: service.service_place || "",
        sCreatedDate: service.sCreatedDate || "",
        sDescription: service.sDescription || "",
      });
    }
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (serviceId && token) {
      fetchServiceDetails();
    } else {
      console.log("Missing serviceId or token:", { serviceId, token: !!token });
    }
  }, [serviceId, token]);

  if (loading && !service) {
    return (
      <div className="grid grid-cols-4 min-h-screen">
        <div className="grid col-span-1">
          <SideBar />
        </div>
        <div className="grid col-span-3">
          <div className="flex flex-col">
            <NavBare />
            <div className="m-auto p-8">
              <div className="text-center">Chargement...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!service && !loading) {
    return (
      <div className="grid grid-cols-4 min-h-screen">
        <div className="grid col-span-1">
          <SideBar />
        </div>
        <div className="grid col-span-3">
          <div className="flex flex-col">
            <NavBare />
            <div className="m-auto p-8">
              <div className="text-center text-red-600">
                Service non trouvé
              </div>
              <button
                onClick={handleBack}
                className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Retour
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 min-h-screen">
      <div className="grid col-span-1">
        <SideBar />
      </div>
      <div className="grid col-span-3">
        <div className="flex flex-col">
          <NavBare />
          <div className="p-8 max-w-2xl mx-auto w-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-primary-green font-semibold text-2xl">
                Détails du Service
              </h1>
              <button
                onClick={handleBack}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Retour
              </button>
            </div>

            {/* Success/Error Messages */}
            {success && (
              <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                {success}
              </div>
            )}
            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {/* Service Details Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="service_name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nom du Service :
                  </label>
                  <input
                    type="text"
                    id="service_name"
                    value={formValues.service_name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green ${
                      !isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                    }`}
                  />
                </div>

                <div>
                  <label
                    htmlFor="service_place"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Archivé dans :
                  </label>
                  <input
                    type="text"
                    id="service_place"
                    value={formValues.service_place}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green ${
                      !isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                    }`}
                  />
                </div>

                <div>
                  <label
                    htmlFor="sCreatedDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Créé le :
                  </label>
                  <input
                    type="date"
                    id="sCreatedDate"
                    value={formValues.sCreatedDate}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green ${
                      !isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                    }`}
                  />
                </div>

                <div>
                  <label
                    htmlFor="sDescription"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description :
                  </label>
                  <textarea
                    id="sDescription"
                    value={formValues.sDescription}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows="4"
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green ${
                      !isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                    }`}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-4">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 bg-primary-green text-white rounded-md hover:bg-primary-green-dark focus:outline-none focus:ring-2 focus:ring-primary-green"
                  >
                    Modifier
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-primary-green text-white rounded-md hover:bg-primary-green-dark focus:outline-none focus:ring-2 focus:ring-primary-green disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Sauvegarde..." : "Sauvegarder"}
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditService;
