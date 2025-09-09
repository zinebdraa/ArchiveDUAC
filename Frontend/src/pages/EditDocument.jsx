import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import NavBare from "../components/NavBare";
import SideBar from "../components/SideBar";
import { CgCornerDownLeft } from "react-icons/cg";

const EditDocument = () => {
  const token = localStorage.getItem("token");

  const { documentId } = useParams();
  const navigate = useNavigate();

  const [document, setDocument] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formValues, setFormValues] = useState({
    document_name: "",
    document_place: "",
    dCreatedDate: "",
    dDescription: "",
    document: null,
  });

  // Fetch one document details
  const fetchDocumentDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3001/api/documents/${documentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      let svc = response.data;

      if (response.data && response.data.document) {
        svc = response.data.document;
      } else if (response.data && response.data.data) {
        svc = response.data.data;
      }

      if (!svc || (typeof svc === "object" && Object.keys(svc).length === 0)) {
        setDocument(null);
        setError("document non trouvé.");
        return;
      }

      setDocument(svc);

      setFormValues({
        document_name: svc.document_name || "",
        document_place: svc.document_place || "",
        dCreatedDate: svc.dCreatedDate || "",
        dDescription: svc.dDescription || "",
      });

      setError("");
    } catch (error) {
      console.error("Error fetching document details:", error);
      console.error("Error response:", error.response);

      if (error.response) {
        if (error.response.status === 404) {
          setError("Document non trouvé.");
        } else {
          setError(
            `Erreur du serveur: ${error.response.status} - ${
              error.response.data?.message || "Erreur inconnue"
            }`
          );
        }
      } else if (error.request) {
        setError("Impossible de contacter le serveur.");
      } else {
        setError("Erreur lors de la récupération du document.");
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
        `http://localhost:3001/api/documents/${documentId}`,
        { ...formValues },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccess("Document mis à jour avec succès !");
        setIsEditing(false);
        await fetchDocumentDetails();
      }

      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("Update error:", err);
      setError("Impossible de mettre à jour le document. Réessayez plus tard.");
      setTimeout(() => setError(""), 4000);
    } finally {
      setLoading(false);
    }
    setTimeout(() => {
      setError("");
    }, 6000);
  };

  const handleCancel = () => {
    if (document) {
      setFormValues({
        document_name: document.document_name || "",
        document_place: document.document_place || "",
        dCreatedDate: document.dCreatedDate || "",
        dDescription: document.dDescription || "",
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
    if (documentId && token) {
      fetchDocumentDetails();
    } else {
      console.log("Missing documentId or token:", {
        documentId,
        token: !!token,
      });
    }
  }, [documentId, token]);

  if (loading && !document) {
    return (
      <div className="grid grid-cols-4 h-screen">
        <div className="grid col-span-1">
          <SideBar />
        </div>
        <div className="grid col-span-3 overflow-y-auto">
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

  if (!document && !loading) {
    return (
      <div className="grid grid-cols-4 h-screen">
        <div className="grid col-span-1 h-screen">
          <SideBar />
        </div>
        <div className="grid col-span-3 overflow-y-auto">
          <div className="flex flex-col">
            <NavBare />
            <div className="m-auto p-8">
              <div className="text-center text-red-600">
                Document non trouvé
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
    <div className="grid grid-cols-4 h-screen">
      <div className="grid col-span-1 h-screen ">
        <SideBar />
      </div>
      <div className="grid col-span-3 overflow-y-auto">
        <div className="flex flex-col">
          <NavBare />
          <div className="p-8 max-w-2xl mx-auto w-full">
            {/* Header */}
            <div className="flex justify-start items-center my-auto ml-[-50px] mb-[50px]">
              {documentId && (
                <button onClick={() => navigate(-1)}>
                  <CgCornerDownLeft className="size-[30px] border-2 border-primary-green bg-green-4 text-primary-green" />
                </button>
              )}
              <p className="ml-6 font-medium text-lg border-b-[1.5px] border-primary-green">
                {documentId
                  ? document
                    ? `Détails du document ${
                        document?.document_name ?? document?.name ?? ""
                      }`
                    : "Détails du document"
                  : "Détails du document"}
              </p>
            </div>

            {/* Success/Error Messages */}
            {success && <div className="mb-2  text-green-700 ">{success}</div>}
            {error && <div className="mb-4  text-red-700 ">{error}</div>}

            {/* document Details Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <label
                    htmlFor="document_name"
                    className="block text-sm font-medium text-gray-700 mb-1 w-[150px]"
                  >
                    Nom :
                  </label>
                  <input
                    type="text"
                    id="document_name"
                    value={formValues.document_name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green ${
                      !isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                    }`}
                  />
                </div>

                <div className="flex items-center">
                  <label
                    htmlFor="document_place"
                    className="block text-sm font-medium text-gray-700 mb-1 w-[150px]"
                  >
                    Archivé dans :
                  </label>
                  <input
                    type="text"
                    id="document_place"
                    value={formValues.document_place}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green ${
                      !isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                    }`}
                  />
                </div>

                <div className="flex">
                  <label
                    htmlFor="sCreatedDate"
                    className="block text-sm font-medium text-gray-700 mb-1 w-[150px]"
                  >
                    Créé le :
                  </label>
                  <input
                    type="date"
                    id="sCreatedDate"
                    value={formValues.dCreatedDate}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green ${
                      !isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                    }`}
                  />
                </div>

                <div className="flex items-center">
                  <label
                    htmlFor="sDescription"
                    className="block text-sm font-medium text-gray-700 mb-1 w-[150px]"
                  >
                    Description :
                  </label>
                  <textarea
                    id="sDescription"
                    value={formValues.dDescription}
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
                      className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors "
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-primary-green text-white rounded-md hover:bg-secondary-green transition-colors focus:outline-none focus:ring-2 focus:ring-primary-green disabled:opacity-50 disabled:cursor-not-allowed"
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

export default EditDocument;
