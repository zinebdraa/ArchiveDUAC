import React from "react";
import { GrSearch } from "react-icons/gr";

const NavBare = ({ onSearch }) => {
    const handleChange = (e) => {
    const value = e.target.value;
    if (onSearch) onSearch(value); // call search function from the parent page
  };

  return (
    <div className="bg-primary-green p-5 flex justify-center items-center rounded-b-lg">
      <div className="relative w-[60%] ">
        <input
          type="text"
          className=" border-2 border-primary-green rounded-[8px] w-[100%] h-[45px] p-[15px] pl-[20px]"
          placeholder="Chercher quelque chose ... "
          onChange={handleChange}
        />
        <GrSearch className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 " />
      </div>
    </div>
  );
};

export default NavBare;
