import React from "react";
import { Link } from "react-router-dom";
import LogoGrey from "../../public/LogoGrey.png";
import { PiCallBellLight } from "react-icons/pi";
import { LiaServerSolid } from "react-icons/lia";
import { HiMiniFolderPlus } from "react-icons/hi2";
import { MdOutlineLogout } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import { VscFileSubmodule } from "react-icons/vsc";
import { IoLibraryOutline } from "react-icons/io5";
import Chemise from "../assets/icons/folders-light.svg";
import Doc from "../assets/icons/mdl2_document-set.svg";

function SideBar() {
  return (
    <div className="flex flex-col justify-between items-center bg-primary-green text-green-4 h-screen w-screen text-xl">
      <div className="w-[170px] h-[170px]">
        <img src={LogoGrey} alt="logo" className="w-full h-full" />
      </div>
      <div className="w-full flex justify-center">
        <ul className="w-[80%] ">
          <li className="flex  items-center p-3 rounded-lg hover:bg-green-4 hover:text-primary-green ">
            <Link className="flex">
              <PiCallBellLight className="size-[25px] mx-5" />
              <p>Services</p>
            </Link>
          </li>

          <li className="flex  items-center p-3 rounded-lg hover:bg-green-4 hover:text-primary-green">
            <Link className="flex">
              <LiaServerSolid className="size-[25px] mx-5" />
              <p>Bureaus</p>
            </Link>
          </li>
          <li className="flex  items-center p-3 rounded-lg hover:bg-green-4 hover:text-primary-green">
            <Link className="flex">
              {/* <img src={Chemise} alt="LogoChemise" className="size-[25px] mr-5" /> */}
              <IoLibraryOutline className="size-[25px] mx-5" />
              <p>Chemises</p>
            </Link>
          </li>
          <li className="flex  items-center p-3 rounded-lg hover:bg-green-4 hover:text-primary-green">
            <Link className="flex">
              {/* <img src={Doc} alt="LogoChemise" className="size-[25px] mr-5" /> */}
              <VscFileSubmodule className="size-[25px] mx-5" />
              <p>Documents</p>
            </Link>
          </li>
          <li className="flex  items-center p-3 rounded-lg hover:bg-green-4 hover:text-primary-green">
            <Link className="flex">
              <HiMiniFolderPlus className="size-[25px] mx-5" />
              <p> Ajouter</p>
            </Link>
          </li>
          <li className="flex  items-center p-3 rounded-lg hover:bg-green-4 hover:text-primary-green">
            <Link className="flex">
              <IoSettings className="size-[25px] mx-5" />
              <p>Paramètres</p>
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex justify-center items-center w-[80%] p-3 mb-5 rounded-lg hover:bg-green-4 hover:text-primary-green">
        <MdOutlineLogout className="size-[25px] mx-5" />
        <p>Déconnexion</p>
      </div>
    </div>
  );
}

export default SideBar;
