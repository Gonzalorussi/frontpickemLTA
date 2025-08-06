import React, { useState, useEffect } from "react";
import PredictionModal from "./PredictionModal";

export default function CrystalBallCard({ pregunta, respuesta, onSelect, disabled, fila4 }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(respuesta || null);

  // 🧠 Sincroniza el estado local si la prop cambia (por ejemplo, al cargar desde Firestore)
  useEffect(() => {
    setSelectedAnswer(respuesta || null);
  }, [respuesta]);

  const handleConfirm = (answer) => {
    if (disabled) return;
    setSelectedAnswer(answer);
    onSelect(pregunta.id, answer);
    setModalOpen(false);
  };

  return (
    <div className="bg-gray-800 border border-[#b2a27e] rounded p-0 shadow hover:shadow-lg transition cursor-pointer overflow-hidden">
      <img
        src={selectedAnswer?.imagen || pregunta.imagen}
        alt="Pregunta"
        className={`block mb-3 mx-auto border-b border-[#b2a27e] ${
  fila4
    ? "h-[200px] w-[1800px] object-contain p-2"
    : "h-[250px] w-full object-cover"
}`}
      />
      <div className="text-center px-2">
      <h3 className="font-semibold mb-1 text-gray-300 line-clamp-2 min-h-[3.5rem]">{pregunta.texto}</h3>
      <p className="text-sm mb-3 text-[#b2a27e]">Puntos: {pregunta.puntos}</p>
      {selectedAnswer ? (
        <div className="mb-2 font-medium text-gray-300">
          Seleccionado:{" "}
          {selectedAnswer.nombre || selectedAnswer.respuesta || "N/A"}
        </div>
      ) : (
        <div className="mb-2 text-gray-300">Sin predicción aún</div>
      )}
      {!disabled && (
        <button
          onClick={() => setModalOpen(true)}
          className="bg-[#b2a27e] border border-gray-500 hover:border-gray-300 text-gray-800 px-4 py-1 rounded mx-auto block font-bold mb-3"
        >
    Predecir
  </button>
)}
</div>

      {modalOpen && (
        <PredictionModal
          pregunta={pregunta}
          currentSelection={selectedAnswer}
          onConfirm={handleConfirm}
          onCancel={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
