import React from "react";
import {
  FaInstagram,
  FaEnvelope,
  FaTwitch,
  FaYoutube,
  FaTwitter,
  FaGlobe,
  FaDiscord,
  FaPatreon,
} from "react-icons/fa";
import LogoLumino from "../assets/logolumino.png";

export default function Footer() {
  return (
    <footer className="font-semibold bg-[#1a1a1a] text-gray-300 py-8 mt-15 border-t border-gray-700">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:justify-between items-center gap-8 md:gap-10 px-4 md:px-6">

    {/* Branding */}
    <div className="flex flex-col items-center md:flex-row md:items-center gap-4">
      <a
        href="https://linktr.ee/luminospark"
        target="_blank"
        rel="noopener noreferrer"
        title="LuminoSpark"
        className="transform hover:scale-110 transition duration-300"
      >
        <div className="border-2 rounded-full p-2 border-[#b2a27e] transform transition-transform hover:scale-105">
          <img
            className="w-14 h-14 p-2 shadow-xl"
            src={LogoLumino}
            alt="Logo LuminoSpark"
          />
        </div>
      </a>
      <div className="tracking-wider text-center md:text-left">
        <p className="text-xs uppercase text-[#b2a27e]">Creado por</p>
        <p className="text-xl font-extrabold text-gray-300">LuminoSpark</p>
      </div>
    </div>

    <div className="mt-6 text-center text-xs text-gray-300">
      © 2025 LuminoSpark. Todos los derechos reservados.
    </div>

    {/* Central title */}
    <div className="text-center">
      <p className="text-sm  tracking-widest text-gray-300">Pick'em LTA</p>
      <p className="text-3xl md:text-4xl font-extrabold text-[#7d0909] drop-shadow-lg tracking-tight">Lumino</p>
      <p className="text-xs text-gray-300 mt-1">eSports Experience</p>
    </div>

    {/* Redes */}
    

  </div>

  
</footer>

    );
}
