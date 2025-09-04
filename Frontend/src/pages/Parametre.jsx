// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import NavBare from "../components/NavBare";
// import SideBar from "../components/SideBar";

// const Parametre = () => {
//   const token = localStorage.getItem("token");
//   const [results, setResults] = useState([]);
//   const [error, setError] = useState(""); 
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [selectedPopup, setSelectedPopup] = useState(null);
//   const [formValues, setFormValues] = useState({
//     username: "",
//     password: "",
//     phone: "",
//     email: "",
//     newPassword: "",
//     confirmPassword: "",
//     formats: "",
//   });

//   const handleClose = () => {
//     setSelectedPopup(null);
//   };

//   const handleChange = (e) => {
//     const { id, value } = e.target;
//     setFormValues((prev) => ({
//       ...prev,
//       [id]: value,
//     }));
//   };

//   const handleSubmit = async(e) => {
//     e.preventDefault();
//     console.log("Submitted values:", formValues, "for:", selectedPopup);
//     try {
//       const response = await axios.post(
//         "http://localhost:3001/api/services",
//         { username, password, phone, email },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.status === 201 || response.status === 200) {
//         console.log("Service added:", response.data);
//         setSuccess("Service ajouté avec succès !");
//         setFormValues("")
//       }

//       setTimeout(() => {
//           setSuccess("");
//         }, 4000);
//     } catch (err) {
//       console.error("Add service error:", err);
//       setError("Impossible d’ajouter le service. Réessayez plus tard.");
//     } finally {
//       setLoading(false);
//     }
//     handleClose();
//   };

//   useEffect(() => {
//     const fetchParams = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:3001/api/users/profile",
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         console.log("API response:", response.data);
//         // 👇 use response.data directly (it's an array)
//         setResults(response.data || []);
//       } catch (error) {
//         console.error("Error fetching params:", error);
//         setResults([]); // fallback to empty
//       }
//     };

//     fetchParams();
//   }, []);

  
//   const renderPopupContent = () => {
//     switch (selectedPopup) {
//       case "username":
//         return (
//           <form onSubmit={handleSubmit} className="flex flex-col gap-2">
//             <label htmlFor="username">
//               Entrez le nouveau nom d’utilisateur :
//             </label>
//             <input
//               type="text"
//               id="username"
//               value={formValues.username}
//               onChange={handleChange}
//               className="border p-2 rounded"
//             />
//             <label htmlFor="password">Entrez le mot de passe :</label>
//             <input
//               type="password"
//               id="password"
//               value={formValues.password}
//               onChange={handleChange}
//               className="border p-2 rounded"
//             />
//             <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
//               Confirmer
//             </button>
//           </form>
//         );

//       case "phone":
//         return (
//           <form onSubmit={handleSubmit} className="flex flex-col gap-2">
//             <label htmlFor="phone">
//               Entrez le nouveau numéro de téléphone :
//             </label>
//             <input
//               type="text"
//               id="phone"
//               value={formValues.phone}
//               onChange={handleChange}
//               className="border p-2 rounded"
//             />
//             <label htmlFor="password">Entrez le mot de passe :</label>
//             <input
//               type="password"
//               id="password"
//               value={formValues.password}
//               onChange={handleChange}
//               className="border p-2 rounded"
//             />
//             <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
//               Confirmer
//             </button>
//           </form>
//         );

//       case "email":
//         return (
//           <form onSubmit={handleSubmit} className="flex flex-col gap-2">
//             <label htmlFor="email">Entrez la nouvelle adresse e-mail :</label>
//             <input
//               type="email"
//               id="email"
//               value={formValues.email}
//               onChange={handleChange}
//               className="border p-2 rounded"
//             />
//             <label htmlFor="password">Entrez le mot de passe :</label>
//             <input
//               type="password"
//               id="password"
//               value={formValues.password}
//               onChange={handleChange}
//               className="border p-2 rounded"
//             />
//             <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
//               Confirmer
//             </button>
//           </form>
//         );

//       case "password":
//         return (
//           <form onSubmit={handleSubmit} className="flex flex-col gap-2">
//             <label htmlFor="password">Entrez l’ancien mot de passe :</label>
//             <input
//               type="password"
//               id="password"
//               value={formValues.password}
//               onChange={handleChange}
//               className="border p-2 rounded"
//             />
//             <label htmlFor="newPassword">
//               Entrez le nouveau mot de passe :
//             </label>
//             <input
//               type="password"
//               id="newPassword"
//               value={formValues.newPassword}
//               onChange={handleChange}
//               className="border p-2 rounded"
//             />
//             <label htmlFor="confirmPassword">
//               Confirmez le nouveau mot de passe :
//             </label>
//             <input
//               type="password"
//               id="confirmPassword"
//               value={formValues.confirmPassword}
//               onChange={handleChange}
//               className="border p-2 rounded"
//             />
//             <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
//               Confirmer
//             </button>
//           </form>
//         );

//       case "formats":
//         return (
//           <form onSubmit={handleSubmit} className="flex flex-col gap-2">
//             <label htmlFor="formats">
//               Formats de fichiers acceptés (séparés par virgule):
//             </label>
//             <input
//               type="text"
//               id="formats"
//               value={formValues.formats}
//               onChange={handleChange}
//               className="border p-2 rounded"
//               placeholder=".pdf, .docx, .jpg"
//             />
//             <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
//               Confirmer
//             </button>
//           </form>
//         );

//       case "delete":
//         return (
//           <div>
//             <p className="text-red-600 font-semibold">
//               Supprimer un service ou un bureau
//             </p>
//             <button>Supprimer un service</button>
//             <button>Supprimer un bureau</button>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="grid grid-cols-4">
//       <div className="col-span-1">
//         <SideBar />
//       </div>

//       <div className="col-span-3">
//         <div className="flex flex-col gap-4">
//           <NavBare />

//           <div className="mx-auto w-[95%]">
//             <h1 className="text-xl font-bold">Paramètre de l’application</h1>
//             <ul className="space-y-4">
//               <li className="flex justify-between">
//                 <div>
//                   <p>Nom de l’utilisateur</p>
//                   <p>{results.user_name}</p>
//                 </div>

//                 <button
//                   className="text-blue-600"
//                   onClick={() => setSelectedPopup("username")}
//                 >
//                   Changer
//                 </button>
//               </li>
//               <li className="flex justify-between">
//                 <div>
//                   <p>Phone number</p>
//                   <p>{results.user_num}/</p>
//                 </div>

//                 <button
//                   className="text-blue-600"
//                   onClick={() => setSelectedPopup("phone")}
//                 >
//                   Changer
//                 </button>
//               </li>
//               <li className="flex justify-between">
//                 <div>
//                   <p>E-mail</p>
//                   <p>{results.user_email}</p>
//                 </div>

//                 <button
//                   className="text-blue-600"
//                   onClick={() => setSelectedPopup("email")}
//                 >
//                   Changer
//                 </button>
//               </li>
//               <li className="flex justify-between">
//                 <p>Password</p>
//                 <button
//                   className="text-blue-600"
//                   onClick={() => setSelectedPopup("password")}
//                 >
//                   Changer
//                 </button>
//               </li>
//               <li className="flex justify-between">
//                 <p>Formats de fichiers acceptés</p>
//                 <button
//                   className="text-blue-600"
//                   onClick={() => setSelectedPopup("formats")}
//                 >
//                   Modifier
//                 </button>
//               </li>
//               <li className="flex justify-between">
//                 <p>Suppression</p>
//                 <button
//                   className="text-red-600"
//                   onClick={() => setSelectedPopup("delete")}
//                 >
//                   Supprimer
//                 </button>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>

//       {/* Popup Modal */}
//       {selectedPopup && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg">
//             <h2 className="text-lg font-semibold mb-4">Paramètre</h2>
//             {renderPopupContent()}
//             <div className="flex justify-end mt-4">
//               <button
//                 className="px-4 py-2 bg-gray-300 rounded"
//                 onClick={handleClose}
//               >
//                 Annuler
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Parametre;
import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBare from "../components/NavBare";
import SideBar from "../components/SideBar";

const Parametre = () => {
  const token = localStorage.getItem("token");
  const [results, setResults] = useState({});
  const [error, setError] = useState(""); 
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedPopup, setSelectedPopup] = useState(null);
  const [formValues, setFormValues] = useState({
    user_name: "",
    password: "",
    user_num: "",
    user_email: "",
    new_password: "",
    confirmPassword: "",
    formats: "",
  });

  const handleClose = () => {
    setSelectedPopup(null);
    setError("");
    setSuccess("");
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
        setResults(response.data); // refresh displayed values
        // setFormValues({
        //   user_name: "",
        //   password: "",
        //   user_num: "",
        //   user_email: "",
        //   newPassword: "",
        //   confirmPassword: "",
        //   formats: "",
        // });
        
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

  useEffect(() => {
    const fetchParams = async () => {
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

    fetchParams();
  }, [token]);

  const renderPopupContent = () => {
    switch (selectedPopup) {
      case "username":
        return (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <label htmlFor="username">Entrez le nouveau nom d’utilisateur :</label>
            <input
              type="text"
              id="user_name"
              value={formValues.user_name}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <label htmlFor="password">Entrez le mot de passe :</label>
            <input
              type="password"
              id="password"
              value={formValues.password}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <button disabled={loading} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
              {loading ? "En cours..." : "Confirmer"}
            </button>
          </form>
        );

      case "phone":
        return (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <label htmlFor="phone">Entrez le nouveau numéro de téléphone :</label>
            <input
              type="text"
              id="user_num"
              value={formValues.user_num}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <label htmlFor="password">Entrez le mot de passe :</label>
            <input
              type="password"
              id="password"
              value={formValues.password}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <button disabled={loading} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
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
            <input
              type="password"
              id="password"
              value={formValues.password}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <button disabled={loading} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
              {loading ? "En cours..." : "Confirmer"}
            </button>
          </form>
        );

      case "password":
        return (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <label htmlFor="password">Entrez l’ancien mot de passe :</label>
            <input
              type="password"
              id="password"
              value={formValues.password}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <label htmlFor="new_password">Entrez le nouveau mot de passe :</label>
            <input
              type="password"
              id="new_password"
              value={formValues.new_password}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <label htmlFor="confirmPassword">Confirmez le nouveau mot de passe :</label>
            <input
              type="password"
              id="confirmPassword"
              value={formValues.confirmPassword}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <button disabled={loading} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
              {loading ? "En cours..." : "Confirmer"}
            </button>
          </form>
        );

      case "formats":
        return (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <label htmlFor="formats">Formats de fichiers acceptés (séparés par virgule):</label>
            <input
              type="text"
              id="formats"
              value={formValues.formats}
              onChange={handleChange}
              className="border p-2 rounded"
              placeholder=".pdf, .docx, .jpg"
            />
            <button disabled={loading} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
              {loading ? "En cours..." : "Confirmer"}
            </button>
          </form>
        );

      case "delete":
        return (
          <div className="flex flex-col gap-2">
            <p className="text-red-600 font-semibold">Supprimer un service ou un bureau</p>
            <button className="bg-red-500 text-white px-3 py-2 rounded">Supprimer un service</button>
            <button className="bg-red-700 text-white px-3 py-2 rounded">Supprimer un bureau</button>
          </div>
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchParams = async () => {
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

    fetchParams();
  }, [token]);

  return (
    <div className="grid grid-cols-4">
      <div className="col-span-1">
        <SideBar />
      </div>

      <div className="col-span-3">
        <div className="flex flex-col gap-4">
          <NavBare />

          <div className="mx-auto w-[95%]">
            <h1 className="text-xl font-bold">Paramètre de l’application</h1>

            {success && <p className="text-green-600">{success}</p>}
            {error && <p className="text-red-600">{error}</p>}

            <ul className="space-y-4">
              <li className="flex justify-between">
                <div>
                  <p>Nom de l’utilisateur</p>
                  <p>{results.user_name}</p>
                </div>
                <button className="text-blue-600" onClick={() => setSelectedPopup("username")}>
                  Changer
                </button>
              </li>
              <li className="flex justify-between">
                <div>
                  <p>Phone number</p>
                  <p>{results.user_num}</p>
                </div>
                <button className="text-blue-600" onClick={() => setSelectedPopup("phone")}>
                  Changer
                </button>
              </li>
              <li className="flex justify-between">
                <div>
                  <p>E-mail</p>
                  <p>{results.user_email}</p>
                </div>
                <button className="text-blue-600" onClick={() => setSelectedPopup("email")}>
                  Changer
                </button>
              </li>
              <li className="flex justify-between">
                <p>Password</p>
                <button className="text-blue-600" onClick={() => setSelectedPopup("password")}>
                  Changer
                </button>
              </li>
              <li className="flex justify-between">
                <p>Formats de fichiers acceptés</p>
                <button className="text-blue-600" onClick={() => setSelectedPopup("formats")}>
                  Modifier
                </button>
              </li>
              <li className="flex justify-between">
                <p>Suppression</p>
                <button className="text-red-600" onClick={() => setSelectedPopup("delete")}>
                  Supprimer
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {selectedPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Paramètre</h2>
            {renderPopupContent()}
            <div className="flex justify-end mt-4">
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={handleClose}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Parametre;
