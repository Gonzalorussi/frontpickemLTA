import React from "react";

export default function RondaTabs({ selectedRonda, setSelectedRonda }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6">
      {Array.from({ length: 6 }, (_, i) => i + 1).map((ronda) => (
        <button
          key={ronda}
          onClick={() => setSelectedRonda(ronda)}
          className={`cursor-pointer px-3 py-1 rounded-full text-sm sm:text-base border border-[#a63333] transition-colors duration-300 ${
            selectedRonda === ronda
              ? "bg-[#b2a27e] text-white border-yellow-300 font-bold shadow-lg"
              : "bg-[#7d0909] text-gray-300 hover:bg-[#a63333] hover:scale-105"
          }`}
        >
          Ronda {ronda}
        </button>
      ))}
    </div>
  );
}
