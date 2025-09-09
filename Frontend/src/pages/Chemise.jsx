import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import NavBare from "../components/NavBare";
import SideBar from "../components/SideBar";
import axios from "axios";
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

  // Download a single chemise as ZIP
  const handleDownloadChemise = async (chemise) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/chemises/${chemise.id_chemise}/download`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      // Create a blob from the response
      const blob = new Blob([response.data], { type: "application/zip" });

      // Create a filename
      const fileName = `${chemise.chemise_name.replace(
        /[^a-z0-9_\-\.]/gi,
        "_"
      )}.zip`;

      // Download the file
      saveAs(blob, fileName);
    } catch (err) {
      console.error("Error downloading chemise:", err);
      if (err.response?.status === 404) {
        alert("Cette chemise ne contient aucun document.");
      } else {
        alert("Erreur lors du téléchargement de la chemise.");
      }
    }
  };

  // Download multiple chemises as ZIP files
  const handleBulkDownload = async () => {
    if (selected.length === 0) {
      alert("Aucune chemise sélectionnée.");
      return;
    }

    try {
      // Download each chemise sequentially
      for (const chemiseId of selected) {
        const chemise = results.find((c) => c.id_chemise === chemiseId);
        if (!chemise) continue;

        try {
          const response = await axios.get(
            `http://localhost:3001/api/chemises/${chemise.id_chemise}/download`,
            {
              headers: { Authorization: `Bearer ${token}` },
              responseType: "blob",
            }
          );

          const blob = new Blob([response.data], { type: "application/zip" });
          const fileName = `${chemise.chemise_name.replace(
            /[^a-z0-9_\-\.]/gi,
            "_"
          )}.zip`;
          saveAs(blob, fileName);

          // Add a small delay between downloads to avoid browser restrictions
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (err) {
          console.error(
            `Error downloading chemise ${chemise.chemise_name}:`,
            err
          );
        }
      }
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
