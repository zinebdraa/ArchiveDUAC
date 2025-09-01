import React from "react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
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
    <div className="flex flex-col justify-between items-center bg-primary-green text-green-4 h-screen text-xl">
      <div className="size-[150px]">
        <img src={LogoGrey} alt="logo" className="w-full h-full" />
      </div>
      <div className="w-full flex justify-center">
        <ul className="w-[80%] ">
          <li className="flex  items-center p-3 rounded-lg hover:bg-green-4 hover:text-primary-green ">
            <NavLink
              to="/services"
              className={({ isActive }) =>
                isActive
                  ? "flex size-full p-3 rounded-lg  bg-green-4 text-primary-green "
                  : "flex size-full"
              }
            >
              <PiCallBellLight className="size-[25px] mx-5" />
              <p>Services</p>
            </NavLink>
          </li>

          <li className="flex  items-center p-3 rounded-lg hover:bg-green-4 hover:text-primary-green">
            <NavLink
              to="/bureaux"
              className={({ isActive }) =>
                isActive
                  ? "flex size-full p-3 rounded-lg  bg-green-4 text-primary-green "
                  : "flex size-full"
              }
            >
              <LiaServerSolid className="size-[25px] mx-5" />
              <p>Bureaux</p>
            </NavLink>
          </li>
          <li className="flex  items-center p-3 rounded-lg hover:bg-green-4 hover:text-primary-green">
            <NavLink
              to="/chemise"
              className={({ isActive }) =>
                isActive
                  ? "flex size-full p-3 rounded-lg  bg-green-4 text-primary-green "
                  : "flex size-full"
              }
            >
              {/* <img src={Chemise} alt="LogoChemise" className="size-[25px] mr-5" /> */}
              <IoLibraryOutline className="size-[25px] mx-5" />
              <p>Chemises</p>
            </NavLink>
          </li>
          <li className="flex  items-center p-3 rounded-lg hover:bg-green-4 hover:text-primary-green">
            <NavLink
              to="/doc"
              className={({ isActive }) =>
                isActive
                  ? "flex size-full p-3 rounded-lg  bg-green-4 text-primary-green "
                  : "flex size-full"
              }
            >
              {/* <img src={Doc} alt="LogoChemise" className="size-[25px] mr-5" /> */}
              <VscFileSubmodule className="size-[25px] mx-5" />
              <p>Documents</p>
            </NavLink>
          </li>
          <li className="flex  items-center p-3 rounded-lg hover:bg-green-4 hover:text-primary-green">
            <NavLink
              to="/addPage"
              className={({ isActive }) =>
                isActive
                  ? "flex size-full p-3 rounded-lg  bg-green-4 text-primary-green "
                  : "flex size-full"
              }
            >
              <HiMiniFolderPlus className="size-[25px] mx-5" />
              <p> Ajouter</p>
            </NavLink>
          </li>
          <li className="flex  items-center p-3 rounded-lg hover:bg-green-4 hover:text-primary-green">
            <NavLink
              to="/param"
              className={({ isActive }) =>
                isActive
                  ? "flex size-full p-3 rounded-lg  bg-green-4 text-primary-green "
                  : "flex size-full"
              }
            >
              <IoSettings className="size-[25px] mx-5" />
              <p>Paramètres</p>
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="flex  items-center w-[80%] p-3 mb-2 rounded-lg hover:bg-green-4 hover:text-primary-green">
        <Link to="/" className="flex">
          <MdOutlineLogout className="size-[25px] mx-5" />
          <p>Déconnexion</p>
        </Link>
      </div>
    </div>
  );
}

export default SideBar;
