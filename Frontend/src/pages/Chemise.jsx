import React from "react";
import NavBare from "../components/NavBare";
import SideBar from "../components/SideBar";

import { IoIosAdd } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";
import { HiOutlineDownload } from "react-icons/hi";
import { TiStarOutline } from "react-icons/ti";
import { TbTrashX } from "react-icons/tb";
import { GoCircle } from "react-icons/go";
import { IoFolderOutline } from "react-icons/io5";

const Chemise = () => {
  return (
    <div className="grid grid-cols-4">
      <div className="grid col-span-1">
        <SideBar />
      </div>
      <div className="grid col-span-3">
        <div className="flex flex-col gap-4">
          <NavBare />
        
        <div className="flex flex-col  justify-center items-center">
          <div className="bg-primary-green text-white rounded-md py-2 px-3 w-[95%]">
            <ul className="flex items-center justify-between ">
              <li className="flex items-center justify-between bg-secondary-green pl-2 py-1 pr-4 mr-12 text-center rounded-lg">
                <IoIosAdd  className=" size-[30px]"/>
                New
              </li>
              <li className="flex items-center justify-between pl-2 py-2 pr-4 text-center rounded-lg hover:bg-secondary-green">
                <FaCheckCircle  className="mr-2 size-[20px]"/>
                sélectionné
              </li>
              <li className="flex items-center justify-between pl-2 py-2 pr-4 text-center rounded-lg hover:bg-secondary-green">
                <HiOutlineDownload className="mr-2 size-[25px]" />
                Télécharger
              </li>
              <li className="flex items-center justify-between pl-2 py-2 pr-4 text-center rounded-lg hover:bg-secondary-green">
                <TiStarOutline  className="mr-2 size-[25px]"/>
                favoré
              </li>
              <li className="flex items-center justify-between pl-2 py-2 pr-4 text-center rounded-lg hover:bg-secondary-green">
                <TbTrashX  className="mr-2 size-[25px]"/>
                Supprimer
              </li>
            </ul>
          </div>
          <div>
            <div >
                <ul className="flex items-center justify-between w-[295%] py-2 px-3 bg-primary-green">
                    <li><GoCircle /></li>
                    <li><IoFolderOutline /></li>
                    <li>Bureau</li>
                    <li>Créé</li>
                    <li></li>
                </ul>
            </div>
            <div></div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Chemise;
