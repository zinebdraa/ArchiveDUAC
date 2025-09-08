import React, { useState, useEffect } from "react";
import { useParams,Link, useNavigate } from "react-router-dom";
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

import pdf from "../assets/pdf.svg";
import docx from "../assets/doc.svg"; 
import excel from "../assets/excel.svg";
import pptx from "../assets/pptx.svg";

const Document = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { chemiseId } = useParams();

  const [allDocuments, setAllDocuments] = useState([]);
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState([]);

  const [fileTypeFilter, setFileTypeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const handleSearch = (query) => {
    if (query.trim() === "") {
      applyFilters(allDocuments);
    } else {
      const filtered = allDocuments.filter((document) =>
        document.document_name.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    }
  };

  const fetchDocuments = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/documents", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allDocs = chemiseId
        ? res.data.filter((d) => d.chemiseId === Number(chemiseId))
        : res.data;

      setAllDocuments(allDocs);
      applyFilters(allDocs);
    } catch (err) {
      console.error("Error fetching documents:", err);
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
        return <BiSolidFilePng  className="w-5 h-5" />;
        case "jpg":
        return <BsFiletypeJpg className="w-5 h-5" />;
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
      filtered = filtered.filter((d) => {
        return d.dCreatedDate && d.dCreatedDate.startsWith(dateFilter);
      });
    }

    setResults(filtered);
  };

  const handleAddDocument = () => {
    navigate("/addPage?type=doc");
  };

  useEffect(() => {
    fetchDocuments();
  }, [chemiseId]);

  useEffect(() => {
    applyFilters(allDocuments);
  }, [fileTypeFilter, dateFilter]);

  return (
    <div className="grid grid-cols-4">
      <div className="col-span-1">
        <SideBar />
      </div>

      <div className="col-span-3">
        <div className="flex flex-col gap-4">
          <NavBare onSearch={handleSearch} />

          <div className="mx-auto w-[95%] ">
            {/* Top actions */}
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
              
              <button onClick={handleAddDocument} className="p-2 px-4 border-2 rounded-lg bg-primary-green hover:bg-secondary-green border-primary-green text-center text-white transition-colors">
                importer
              </button >
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
                      <HiOutlineDownload className="size-[20px] cursor-pointer" />
                      <MdEdit className="size-[20px] cursor-pointer" />
                      <IoEye className="size-[20px] cursor-pointer"/>
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
    </div>
  );
};

export default Document;
