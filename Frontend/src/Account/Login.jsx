import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoGrey from "../../public/LogoGrey.png";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

function Login() {
  const [password, setPassword] = useState("");
  const [errPassword, setErrPassword] = useState("");
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setErrPassword("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password) {
      setErrPassword("Merci d'entrer votre mot de passe ");
    }

    if(password){
      console.log("success")
      
      clearForm()
      navigate("/services")
    }
  }
const clearForm =() =>  {
setPassword("")
setErrPassword("")
}
  return (
    <div className="grid grid-col-1 md:grid-cols-2 w-screen h-screen">
      <div className="h-screen  bg-primary-green  hidden md:block">
        <div className=" flex justify-between items-center flex-col">
          <div className="w-[300px] h-[300px]">
            <img src={LogoGrey} alt="" className="w-full h-full" />
          </div>
          <p className="font-semibold text-2xl  text-green-3 w-[300px] text-center">
            Direction de l'Urbanisme, de l'Architecture et de la Construction
          </p>
        </div>
      </div>

      <div className="h-screen flex justify-center items-center flex-col">
        <form
          action=""
          className="flex justify-center items-center flex-col gap-16"
          onSubmit={handleSubmit}
        >
          <h1 className="text-4xl text-primary-green   font-jacques">
            Bienvenue
          </h1>
          <div className="">
            <div className=" w-[100%]">
              <label htmlFor="" >Veuillez entrer le mot de passe</label>
              <div className="relative w-[120%] mt-3">
                <input
                  type={show ? "text" : "password"}
                  className=" border-2 border-primary-green rounded-[8px] w-[100%] h-[40px] p-[15px] pl-[40px]"
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 "
                >
                  {show ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                </button>
              </div>
            </div>
            {errPassword && (
              <p className="text-red-500 text-xs">{errPassword}</p>
            )}
            <Link>
          <p className="underline text-xs mt-1">Mot de passe oublié?</p>
          </Link>
          </div>
          
         <button type="submit" className="rounded-xl bg-primary-green text-white shadow-2xl font-bold px-7 py-2">
          Log in
         </button>
        </form>
         
      </div>
    </div>
  );
}

export default Login;
