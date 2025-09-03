import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavBare from "../components/NavBare";
import SideBar from "../components/SideBar";
import chemises from "../data/chemises.json";
import bureaux from "../data/bureaux.json";

import { IoIosAdd } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";
import { HiOutlineDownload } from "react-icons/hi";
import { TiStarOutline } from "react-icons/ti";
import { TbTrashX } from "react-icons/tb";
import { GoCircle } from "react-icons/go";
import { IoFolderOutline } from "react-icons/io5";
import { TbFolderOpen } from "react-icons/tb";
import { MdEdit } from "react-icons/md";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

const Chemise = () => {
  const { bureauId } = useParams();
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState([])

  // Filter chemises based on bureauId
  const filteredChemises = bureauId
    ? chemises.filter((chemise) => chemise.bureauId === Number(bureauId))
    : chemises;

  const handleSearch = (query) => {
    if (query.trim() === "") {
      setResults(filteredChemises);
    } else {
      const filtered = filteredChemises.filter((chemise) =>
        chemise.name.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    }
  };

  // Get bureau name by bureauId
  const getBureauName = (bureauId) => {
    const bureau = bureaux.find((b) => b.id === bureauId);
    return bureau ? bureau.name : "Bureau inconnu";
  };

  useEffect(() => {
    setResults(filteredChemises);
  }, [bureauId]);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="grid grid-cols-4">
      <div className="col-span-1">
        <SideBar />
      </div>

      <div className="col-span-3">
        <div className="flex flex-col gap-4">
          <NavBare onSearch={handleSearch} />

          <div className="mx-auto w-[95%]">
            {/* Top actions */}
            <div className="bg-primary-green text-white rounded-md py-2 px-3 w-full">
              <ul className="flex items-center justify-between">
                <li className="flex items-center bg-secondary-green px-3 py-1 rounded-lg cursor-pointer">
                  <IoIosAdd className="size-[30px] mr-2" />
                  New
                </li>
                <li className="flex items-center px-3 py-1 rounded-lg hover:bg-secondary-green cursor-pointer">
                  <FaCheckCircle className="mr-2 size-[20px]" />
                  {selected.length > 0 && `(${selected.length})`} sélectionné
                </li>
                <li className="flex items-center px-3 py-1 rounded-lg hover:bg-secondary-green cursor-pointer">
                  <HiOutlineDownload className="mr-2 size-[25px]" />
                  Télécharger
                </li>
                <li className="flex items-center px-3 py-1 rounded-lg hover:bg-secondary-green cursor-pointer">
                  <TiStarOutline className="mr-2 size-[25px]" />
                  favoré
                </li>
                <li className="flex items-center px-3 py-1 rounded-lg hover:bg-secondary-green cursor-pointer">
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
                    key={chemise.id}
                    className="grid grid-cols-[40px_40px_1fr_1fr_1fr_150px] items-center py-2 px-3 border-b text-sm hover:bg-gray-50"
                  >
                    <div onClick={() => toggleSelect(chemise.id)} className="cursor-pointer">
                      {selected.includes(chemise.id) ? (
                        <IoIosCheckmarkCircleOutline className="text-primary-green size-[20px]" />
                      ) : (
                        <GoCircle className="size-[16px]" />
                      )}
                    </div>
                    <div>
                      <TbFolderOpen className="size-[20px]" />
                    </div>
                    <div>{chemise.name}</div>
                    <div>{getBureauName(chemise.bureauId)}</div>
                    <div>{chemise.date}</div>
                    <div className="flex justify-center space-x-2">
                      <HiOutlineDownload className="size-[20px] cursor-pointer" />
                      <MdEdit className="size-[20px] cursor-pointer" />
                      <TiStarOutline className="size-[20px] cursor-pointer" />
                      <TbTrashX className="size-[20px] text-red-500 cursor-pointer" />
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

export default Chemise;
