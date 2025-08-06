import React, { useState, useMemo } from "react";

export default function PredictionModal({
  pregunta,
  currentSelection,
  onConfirm,
  onCancel,
}) {
  const { tipo, opciones, texto } = pregunta;
  const [seleccion, setSeleccion] = useState(currentSelection || null);
  const [searchTerm, setSearchTerm] = useState("");

  // Para filtrar opciones según búsqueda, aplicable a campeones y jugadores
  const opcionesFiltradas = useMemo(() => {
    if (!searchTerm.trim()) return opciones;

    const lower = searchTerm.toLowerCase();
    if (tipo === "campeones") {
      return opciones.filter((o) => o.nombre.toLowerCase().includes(lower));
    }
    if (tipo === "jugadores") {
      return opciones.filter(
        (o) =>
          o.nombre.toLowerCase().includes(lower) ||
          o.club.toLowerCase().includes(lower) ||
          o.role.toLowerCase().includes(lower)
      );
    }
    if (tipo === "equipos") {
      return opciones.filter(
        (o) =>
          o.nombre.toLowerCase().includes(lower) ||
          o.region.toLowerCase().includes(lower)
      );
    }
    // Para acciones o si no aplica búsqueda
    return opciones;
  }, [searchTerm, opciones, tipo]);

  // Render para cada tipo:
  const renderOptions = () => {
    switch (tipo) {
      case "acciones":
        return opcionesFiltradas.map((opt) => (
          <div key={opt.id} className="mb-2 text-gray-300">
            <label className="inline-flex items-center cursor-pointer gap-2">
              <input
                type="radio"
                name="prediction"
                value={opt.respuesta}
                checked={seleccion?.respuesta === opt.respuesta}
                onChange={() => setSeleccion(opt)}
                className="mr-2 accent-[#b2a27e]"
              />
              {opt.respuesta}
            </label>
          </div>
        ));

      case "campeones":
        return (
          <>
            <div className="mt-4 w-full">
            <input
              type="text"
              placeholder="Buscar campeón..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
              className ="mb-3 w-full px-3 py-2 rounded bg-transparent border border-[#b2a27e] text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#b2a27e]"
            />
            <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-64 overflow-auto pr-2">
              {opcionesFiltradas.map((champ) => (
                <div
                  key={champ.id}
                  className={`flex flex-col items-center p-2 rounded border border-[#b2a27e] bg-[#7d0909] cursor-pointer transition hover:brightness-125 ${
                  seleccion?.nombre === champ.nombre ? "ring-2 ring-[#b2a27e]" : ""
                  }`}
                  onClick={() => setSeleccion(champ)}
                  >
                  <img
                    src={champ.imagen}
                    alt={champ.nombre}
                    className="w-20 h-20 mx-auto mb-1 object-contain"
                  />
                  <span className="text-xs text-gray-300">{champ.nombre}</span>
                </div>
              ))}
            </div>
            </div>
          </>
        );

      case "jugadores":
        return (
          <>
            <input
              type="text"
              placeholder="Buscar jugador, club o rol..."
              className="w-full border rounded border-[#b2a27e] p-1 mb-3 text-gray-300 placeholder-gray-300 bg-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            <div className="grid grid-cols-4 gap-2 max-h-64 overflow-auto pr-2">
              {opcionesFiltradas.map((jug) => (
                <div
                  key={jug.id}
                  className={`flex flex-col items-center p-2 rounded border border-[#b2a27e] bg-[#7d0909] cursor-pointer transition hover:brightness-125 ${
                  seleccion?.id === jug.id ? "ring-2 ring-[#b2a27e]" : ""
                  }`}
                  onClick={() => setSeleccion(jug)}
                >
                  <img
                    src={jug.imagen}
                    alt={jug.summonerName}
                    className="w-20 h-20 mx-auto object-contain rounded mt-1"
                  />
                  <div>
                    <div className="text-sm font-semibold text-gray-300 mt-1 text-center">{jug.nombre}</div>
                    <div className="text-xs text-gray-400 text-center">{jug.club}</div>
                    <div className="text-xs text-gray-400 text-center">{jug.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        );

      case "equipos":{
        const equiposFiltrados = opcionesFiltradas.filter((team) => {
          if (pregunta.id === "e1") return team.region === "LTA Sur";
          if (pregunta.id === "e2") return team.region === "LTA Norte";
          return true;
        });
        return (
          <>
            <input
              type="text"
              placeholder="Buscar equipo o región..."
              className="w-full border border-[#b2a27e] p-1 mb-2 rounded text-gray-300 placeholder-gray-300 bg-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          <div className="max-h-64 overflow-auto border border-[#b2a27e] rounded p-2 grid grid-cols-4 gap-2">
            {equiposFiltrados.map((team) => (
              <div
                key={team.id}
                className={`flex flex-col items-center p-2 rounded border border-[#b2a27e] bg-[#7d0909] cursor-pointer transition hover:brightness-125 ${
                seleccion?.id === team.id ? "ring-2 ring-[#b2a27e]" : ""
                }`}
                onClick={() => setSeleccion(team)}
              >
                <img
                  src={team.imagen}
                  alt={team.nombre}
                  className="w-12 h-12 mx-auto object-contain mb-1"
                />
                <div>
                  <div className="ext-sm font-semibold text-gray-300 text-center">{team.nombre}</div>
                  <div className="text-xs text-gray-400 text-center">{team.region}</div>
                </div>
              </div>
            ))}
          </div>
          </>
        );
      }
      default:
        return <div>Tipo no soportado</div>;
    }
  };


  return (
    <div className="fixed inset-0 bg-black-900 backdrop-blur-xs  flex justify-center items-center z-50 p-4">
      <div className="bg-[#1a1a1a] rounded-lg max-w-xl w-full p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-300">{texto}</h2>
        {renderOptions()}
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-[#7d0909] border border-[#a63333] text-gray-300  hover:brightness-125 transition"
          >
            Cancelar
          </button>
          <button
            disabled={!seleccion}
            onClick={() => onConfirm(seleccion)}
            className={`px-4 py-2 rounded text-white transition ${
              seleccion ? "bg-[#b2a27e] border border-yellow-300 hover:brightness-125" : "bg-[#b2a27e] opacity-50 cursor-not-allowed"
            }`}
          >
            Confirmar selección
          </button>
        </div>
      </div>
    </div>
  );
}
