import React from "react";
import { GrSearch } from "react-icons/gr";

const NavBare = () => {
  return (
    <div className="bg-primary-green p-5 flex justify-center items-center">
      <div className="relative w-[60%] ">
        <input
          type="text"
          className=" border-2 border-primary-green rounded-[8px] w-[100%] h-[45px] p-[15px] pl-[20px]"
          placeholder="Chercher quelque chose ... "
        />
        <GrSearch className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 " />
      </div>
    </div>
  );
};

export default NavBare;
