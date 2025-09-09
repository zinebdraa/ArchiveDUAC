import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import NavBare from "../components/NavBare";
import SideBar from "../components/SideBar";
import axios from "axios";

import { HiOutlineDownload } from "react-icons/hi";
import { TbTrashX } from "react-icons/tb";
import { GoCircle } from "react-icons/go";
import { IoFolderOutline } from "react-icons/io5";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { BiSolidFilePng } from "react-icons/bi";
import { BsFiletypeJpg } from "react-icons/bs";
import { IoEye } from "react-icons/io5";
import { CgCornerDownLeft } from "react-icons/cg";
import { IoClose } from "react-icons/io5";
import { BsFiletypeTxt } from "react-icons/bs";
import { AiOutlineFileGif } from "react-icons/ai";

import pdf from "../assets/pdf.svg";
import docx from "../assets/doc.svg";
import excel from "../assets/excel.svg";
import pptx from "../assets/pptx.svg";

// Helper function to get MIME type
const getMimeType = (fileType) => {
  const mimeTypes = {
    pdf: "application/pdf",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    txt: "text/plain",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  };
  return mimeTypes[fileType?.toLowerCase()] || "application/octet-stream";
};

// TextFileViewer component
const TextFileViewer = ({ fileUrl }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTextFile = async () => {
      try {
        const response = await fetch(fileUrl);
        const text = await response.text();
        setContent(text);
        setLoading(false);
      } catch (err) {
        console.error("Error loading text file:", err);
        setError("Failed to load text file");
        setLoading(false);
      }
    };

    fetchTextFile();
  }, [fileUrl]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <pre className="whitespace-pre-wrap font-sans bg-white p-4 rounded border h-screen">
      {content}
    </pre>
  );
};

// PreviewModal component
const PreviewModal = ({ document, onClose, loading }) => {
  const [objectUrl, setObjectUrl] = useState(null);

  useEffect(() => {
    if (document && document.document_data) {
      
      const blob = new Blob([document.document_data], {
        type: getMimeType(document.document_type)
      });
      const url = URL.createObjectURL(blob);
      setObjectUrl(url);

     
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [document]);

  const renderPreview = () => {
    if (!objectUrl) return null;

    const fileType = document.document_type?.toLowerCase();

    switch (fileType) {
      case "pdf":
        return (
          <iframe
            src={objectUrl}
            className="w-full h-full"
            title={document.document_name}
          />
        );
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
        return (
          <img
            src={objectUrl}
            alt={document.document_name}
            className="max-w-full h-screen object-contain"
          />
        );
      case "txt":
        return (
          <div className="p-4 bg-gray-100 h-full overflow-auto">
            <TextFileViewer fileUrl={objectUrl} />
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full p-4">
            <div className="text-center mb-6">
              <p className="text-lg font-medium mb-2">Preview not available</p>
              <p className="text-gray-600">
                This file type cannot be previewed in the browser. Please
                download the file to view it.
              </p>
            </div>
            <a
              href={objectUrl}
              download={`${document.document_name}.${document.document_type}`}
              className="px-6 py-2 bg-primary-green text-white rounded-lg hover:bg-secondary-green flex items-center gap-2"
            >
              <HiOutlineDownload className="w-5 h-5" />
              Download File
            </a>
          </div>
        );
    }
  };

  if (!document && !loading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 h-screen">
      <div className="bg-white rounded-lg w-4/5 h-4/5 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">
            {document ? document.document_name : "Prévisualisation"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
          >
            <IoClose className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 p-4 overflow-auto flex items-center justify-center">
          {loading ? (
            <p className="text-center text-gray-500">Chargement...</p>
          ) : objectUrl ? (
            renderPreview()
          ) : (
            <p className="text-center text-gray-500">Impossible de charger le document</p>
          )}
        </div>
      </div>
    </div>
  );
};

const Document = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { chemiseId } = useParams();

  const [allDocuments, setAllDocuments] = useState([]);
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState([]);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const [fileTypeFilter, setFileTypeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [chemise, setChemise] = useState(null);
  const [bureau, setBureau] = useState(null);
  const [service, setService] = useState(null);

  // --- Fetch Chemise ---
  const fetchChemise = async () => {
    if (!chemiseId) return;
    try {
      const { data } = await axios.get("http://localhost:3001/api/chemises", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ch = data.find(
        (c) =>
          Number(c?.id_chemise ?? c?.chemise_id ?? c?.id) === Number(chemiseId)
      );
      setChemise(ch || null);

      if (ch?.bureau_id) {
        fetchBureau(ch.bureau_id);
      }
    } catch (error) {
      console.error("Error fetching chemise:", error);
    }
  };

  // --- Fetch Bureau ---
  const fetchBureau = async (bid) => {
    try {
      const { data } = await axios.get("http://localhost:3001/api/bureaus", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const brx = data.find(
        (b) => Number(b?.id_bureau ?? b?.bureau_id ?? b?.id) === Number(bid)
      );
      setBureau(brx || null);

      if (brx?.service_id) {
        fetchService(brx.service_id);
      }
    } catch (error) {
      console.error("Error fetching bureau:", error);
    }
  };

  // --- Fetch Service ---
  const fetchService = async (sid) => {
    try {
      const { data } = await axios.get("http://localhost:3001/api/services", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const src = data.find(
        (s) => Number(s?.id_service ?? s?.service_id ?? s?.id) === Number(sid)
      );
      setService(src || null);
    } catch (error) {
      console.error("Error fetching service:", error);
    }
  };

  // --- Fetch Documents ---
  const fetchDocuments = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/documents", {
        headers: { Authorization: `Bearer ${token}` },
      });
      let data = res.data || [];

      if (chemiseId) {
        try {
          const chemiseResponse = await axios.get(
            "http://localhost:3001/api/chemises",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const targetChemise = chemiseResponse.data.find(
            (c) =>
              Number(c?.id_chemise ?? c?.chemise_id ?? c?.id) ===
              Number(chemiseId)
          );

          if (targetChemise) {
            data = data.filter(
              (d) => d.chemise_name === targetChemise.chemise_name
            );
          }
        } catch (error) {
          console.error("Error fetching chemise for filtering:", error);
        }
      }

      setAllDocuments(data);
      setResults(data);
    } catch (err) {
      console.error("Error fetching documents:", err);
      setAllDocuments([]);
      setResults([]);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce document ?"))
      return;
    try {
      await axios.delete(`http://localhost:3001/api/documents/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllDocuments((prev) => prev.filter((d) => d.id_document !== id));
      setResults((prev) => prev.filter((d) => d.id_document !== id));
      setSelected((prev) => prev.filter((selectedId) => selectedId !== id));
    } catch (err) {
      console.error("Error deleting document:", err);
      alert("Impossible de supprimer ce document.");
    }
  };

  const handleDocType = (doc) => {
    switch (doc.document_type?.toLowerCase()) {
      case "pdf":
        return <img src={pdf} alt="pdf" className="w-5 h-5" />;
      case "doc":
      case "docx":
        return <img src={docx} alt="doc" className="w-5 h-5" />;
      case "xls":
      case "xlsx":
      case "excel":
        return <img src={excel} alt="excel" className="w-5 h-5" />;
      case "ppt":
      case "pptx":
        return <img src={pptx} alt="pptx" className="w-5 h-5" />;
      case "png":
        return <BiSolidFilePng className="w-5 h-5" />;
      case "jpg":
      case "jpeg":
        return <BsFiletypeJpg className="w-5 h-5" />;
      case "txt":
        return <BsFiletypeTxt className="w-5 h-5" />;
      case "gif":
        return <AiOutlineFileGif className="w-5 h-5" />;
      default:
        return <IoFolderOutline className="size-[20px]" />;
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const applyFilters = (docs) => {
    let filtered = [...docs];

    if (fileTypeFilter) {
      filtered = filtered.filter(
        (d) =>
          d.document_type &&
          d.document_type.toLowerCase() === fileTypeFilter.toLowerCase()
      );
    }

    if (dateFilter) {
      filtered = filtered.filter(
        (d) => d.dCreatedDate && d.dCreatedDate.startsWith(dateFilter)
      );
    }

    setResults(filtered);
  };

  const handleSearch = (query) => {
    if (query.trim() === "") {
      applyFilters(allDocuments);
    } else {
      const filtered = allDocuments.filter((document) =>
        document.document_name?.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    }
  };

  const handleAddDocument = () => {
    navigate("/addPage?type=doc");
  };

  const handlePreview = async (doc) => {
    setLoadingPreview(true);
    setPreviewDocument(null);

    try {
      const response = await axios.get(
        `http://localhost:3001/api/documents/${doc.id_document}/view`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'arraybuffer'
        }
      );

      // Create a document object with the binary data
      const documentWithData = {
        ...doc,
        document_data: response.data
      };

      setPreviewDocument(documentWithData);
    } catch (err) {
      console.error("Error fetching document preview:", err);
      alert("Impossible de prévisualiser ce document.");
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleDownload = async (doc) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/documents/${doc.id_document}/download`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'arraybuffer'
        }
      );

      // Create blob from binary data
      const blob = new Blob([response.data], {
        type: getMimeType(doc.document_type)
      });
      
      // Create object URL
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement("a");
      link.href = url;
      link.download = `${doc.document_name}.${doc.document_type}`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error("Error downloading document:", err);
      alert("Impossible de télécharger ce document.");
    }
  };

  useEffect(() => {
    fetchDocuments();
    fetchChemise();
  }, [chemiseId]);

  useEffect(() => {
    applyFilters(allDocuments);
  }, [fileTypeFilter, dateFilter, allDocuments]);

  // Header text logic
  const headerText = chemiseId
    ? service && bureau && chemise
      ? `Chemise du service ${service.service_name} / bureau ${bureau.bureau_name} / chemise ${chemise.chemise_name}`
      : "Chargement..."
    : "Tous les documents";

  return (
    <div className="grid grid-cols-4 h-screen">
      <div className="col-span-1 h-screen">
        <SideBar />
      </div>

      <div className="col-span-3 overflow-y-auto">
        <div className="flex flex-col gap-4">
          <NavBare onSearch={handleSearch} />

          <div className="flex justify-start items-center my-auto ml-8">
            {chemiseId && (
              <button onClick={() => navigate(-1)}>
                <CgCornerDownLeft className="size-[30px] border-2 border-primary-green bg-green-4 text-primary-green" />
              </button>
            )}
            <p className="ml-6 font-medium text-lg border-b-[1.5px] border-primary-green">
              {headerText}
            </p>
          </div>

          <div className="mx-auto w-[95%] ">
            {/* Filters + Add */}
            <div className="w-full flex justify-end gap-3 mb-[50px]">
              <div>
                <select
                  value={fileTypeFilter}
                  onChange={(e) => setFileTypeFilter(e.target.value)}
                  className="p-[10px] border-2 rounded-lg border-primary-green text-center"
                >
                  <option value="">File Type</option>
                  <option value="pdf">pdf</option>
                  <option value="xlsx">xlsx</option>
                  <option value="doc">doc</option>
                  <option value="pptx">pptx</option>
                  <option value="png">png</option>
                  <option value="jpg">jpg</option>
                  <option value="txt">txt</option>
                   <option value="gif">gif</option>
                  
                </select>
              </div>
              <div>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="p-2 border-2 rounded-lg border-primary-green text-center"
                />
              </div>
              <button
                onClick={handleAddDocument}
                className="p-2 px-4 border-2 rounded-lg bg-primary-green hover:bg-secondary-green border-primary-green text-center text-white transition-colors"
              >
                importer
              </button>
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
                {results.map((document) => (
                  <div
                    key={document.id_document}
                    className="grid grid-cols-[40px_40px_1fr_1fr_1fr_150px] items-center py-2 px-3 border-b text-sm hover:bg-gray-50"
                  >
                    <div
                      onClick={() => toggleSelect(document.id_document)}
                      className="cursor-pointer"
                    >
                      {selected.includes(document.id_document) ? (
                        <IoIosCheckmarkCircleOutline className="text-primary-green size-[20px]" />
                      ) : (
                        <GoCircle className="size-[16px]" />
                      )}
                    </div>
                    <div>{handleDocType(document)}</div>
                    <div>{document.document_name}</div>
                    <div>{document.bureau_name}</div>
                    <div>{document.dCreatedDate}</div>
                    <div className="flex justify-center space-x-2">
                      <HiOutlineDownload
                        className="size-[20px] cursor-pointer"
                        onClick={() => handleDownload(document)}
                      />
                      <Link to={`/editDocument/${document.id_document}`}>
                        <MdEdit className="size-[20px] cursor-pointer" />
                      </Link>

                      <IoEye
                        className="size-[20px] cursor-pointer"
                        onClick={() => handlePreview(document)}
                      />
                      <TbTrashX
                        className="size-[20px] text-red-500 cursor-pointer"
                        onClick={() => handleDelete(document.id_document)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="m-auto text-red-500 font-normal">
                Aucun résultat trouvé
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewDocument && (
        <PreviewModal
          document={previewDocument}
          onClose={() => setPreviewDocument(null)}
          loading={loadingPreview}
        />
      )}
    </div>
  );
};

export default Document;