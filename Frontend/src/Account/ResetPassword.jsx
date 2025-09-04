import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LogoGrey from "../../public/LogoGrey.png";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const ResetPassword = () => {
  const [user_email, setEmail] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [user_num, setPhone] = useState("");
  const [errPhone, setErrPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setErrEmail("");
  };
  const emailValidation = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[A-Z0-9._%+-]+@[A-Z0-9._%+-]+\.[A-Z]{2,4}$/i);
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
    setErrPhone("");
  };

  const phoneValidation = (phone) => {
    return /^(?:0[0-9]{9}|\+213[0-9]{9})$/.test(String(phone));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;

    if (!user_email) {
      setErrEmail("Merci d'entrer votre email");
      valid = false;
    } else if (!emailValidation(user_email)) {
      setErrEmail("Merci d'entrer un email valide");
      valid = false;
    }
    if (!user_num) {
      setErrPhone("Merci d'entrer votre numero de telephone");
      valid = false;
    } else if (!phoneValidation(user_num)) {
      setErrPhone("Merci d'entrer un numero de telephone valide");
      valid = false;
    }

    if (!valid) return;

    setLoading(true);
    // if (email && phone && emailValidation(email) && phoneValidation(phone)) {
    //   console.log("success");
    //   navigate("/newPassword");
    // }
    try {
      const response = await axios.put(
        "http://localhost:3001/api/users/forgot-password",
        { user_email, user_num },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        navigate("/newPassword");
        clearForm();
      }
    } catch (err) {
      console.error("Login error:", err);

      // Handle different error scenarios
      if (err.response?.status === 401) {
        setErr("Mot de passe incorrect");
      } else if (err.response?.status >= 500) {
        setErr("Erreur du serveur. Veuillez réessayer plus tard");
      } else {
        setErr("Erreur de connexion. Vérifiez votre connexion internet");
      }
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setEmail("");
    setErrEmail("");
    setErrPhone("");
    setPhone("");
  };

  return (
    <div className="grid grid-col-1 md:grid-cols-2 w-screen h-screen">
      <div className="h-screen  bg-primary-green  hidden md:block">
        <div className=" flex justify-between items-center flex-col">
          <div className="size-[200px] m-[50px]">
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
            Mot de passe oublié
          </h1>
          <div>
            <div className=" w-[100%] mb-5">
              <label htmlFor="">Veuillez entrer votre boite email</label>
              <div className="relative w-[120%] mt-1">
                <input
                  type="email"
                  className=" border-2 border-primary-green rounded-[8px] w-[100%] h-[40px] p-[15px] pl-[40px]"
                  placeholder="Email"
                  value={user_email}
                  onChange={handleEmailChange}
                  disabled={loading}
                />
              </div>

              {errEmail && <p className="text-red-500 text-xs">{errEmail}</p>}
            </div>

            <div className=" w-[100%]">
              <label htmlFor="">Veuillez entrer numéro de téléphone</label>
              <div className="relative w-[120%] mt-1">
                <input
                  type="tel"
                  className=" border-2 border-primary-green rounded-[8px] w-[100%] h-[40px] p-[15px] pl-[40px]"
                  placeholder="Numero de telephone"
                  value={user_num}
                  onChange={handlePhoneChange}
                  disabled={loading}
                />
              </div>

              {errPhone && <p className="text-red-500 text-xs">{errPhone}</p>}
            </div>
          </div>
          {err && <p className="text-red-500 text-sm">{err}</p>}
          <button
            type="submit"
            className="rounded-xl bg-primary-green text-white shadow-2xl font-bold px-7 py-2"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Next"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
