import React from "react";
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <nav className="flex flex-row md:flex-row sm:py-5 justify-between bg-linear-to-r from-purple-500 to-yellow-500 h-[110px] gap-5 items-center text-center">
      <span className="relative inline-block text-amber-300 text-2xl font-bold after:content-[''] after:left-0 after:bottom-[-6px] after:h-[2px] after:bg-amber-900 after:absolute after:w-0 hover:after:bg-amber-400 hover:after:bottom-[-6px] after:transition-all after:duration-500 hover:after:w-[70%] underline decoration-amber-800 underline-offset-10 top-[7px] ml-2 sm:max-w-[372px] sm:ml-5 text-center">Smart Parking App</span>
      <div className="flex gap-8 sm:gap-16 items-center mr-2 sm:mr-8">
        <button
          className="transform inline-block border-2 border-amber-50 bg-blue-500 rounded p-2 hover:scale-110 hover:text-white hover:border-blue-700 transition-all duration-150 text-white font-bold text-sm sm:text-xl"
          onClick={() => navigate("/prebooking")}
        >
          Book
        </button>
        <button
          className="transform inline-block border-2 border-amber-50 bg-amber-300 rounded p-2 hover:scale-110 hover:text-amber-50 hover:border-amber-700 transition-all duration-150 text-amber-700 font-bold text-sm sm:text-xl"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
