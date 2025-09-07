import React from "react";
import NavBare from "../components/NavBare";
import SideBar from "../components/SideBar";

const EditService = () => {
  return (
    <div>
      <div className="grid col-span-1">
        <SideBar />
      </div>
      <div className="grid col-span-3">
        <div className="flex flex-col">
          <NavBare />
          <div>
            <h1>Les informations de la chemise</h1>
            <form action="">
              <div>
                <label htmlFor="nom">Nom :</label>
                <input type="text" id="nom"/>
              </div>
              <div>
                <label htmlFor="placement">Archivé dans :</label>
                <input type="text" id="placement"/>
              </div>
               <div>
                <label htmlFor="dCreation">Crée le :</label>
                <input type="text" id="dCreation" />
              </div>
               <div>
                <label htmlFor="desccription">Description :</label>
                <input type="text" id="desccription" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditService;
