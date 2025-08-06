  import React, { useEffect, useState } from "react";
  import { doc, getDoc } from "firebase/firestore";
  import { db } from "../firebase/config";
  import NavbarLideres from "../Components/NavbarLideres";
  import VistaPreviaEscudo from "../Components/VistaPreviaEscudo";
  import {  FaTrophy } from "react-icons/fa";
  import { onAuthStateChanged } from "firebase/auth";
  import { auth } from "../firebase/config";
  import { getCache, setCache } from "../utils/cache";

  const OPCIONES_VISTA = [
    { label: "Total", docId: "leaderacumulado" },
    { label: "Ronda 1", docId: "leaderronda1" },
    { label: "Ronda 2", docId: "leaderronda2" },
    { label: "Ronda 3", docId: "leaderronda3" },
    { label: "Ronda 4", docId: "leaderronda4" },
    { label: "Ronda 5", docId: "leaderronda5" },
    { label: "Ronda Final", docId: "leaderronda6" },
    { label: "Bola de Cristal", docId: "boladecristal" },
  ];

  function Lideres() {
    const [user, setUser] = useState(null);
    const [teams, setTeams] = useState([]);
    const [vistaSeleccionada, setVistaSeleccionada] = useState(OPCIONES_VISTA[0].docId);
    const [loading, setLoading] = useState(true);

    async function getCachedOrFetch(key, fetchFn) {
      const cacheKey = `lideres_${key}`;
      const cached = getCache(cacheKey);
      if (cached) return cached;

      const data = await fetchFn();
      setCache(cacheKey, data);
      return data;
    }

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
        } else {
          setUser(null);
        }
      });

      return () => unsubscribe();
    }, []);

    useEffect(() => {
      const fetchRanking = async () => {
        setLoading(true);

        try {
          const data = await getCachedOrFetch(vistaSeleccionada, async () => {
          const docSnap = await getDoc(doc(db, "leaders", vistaSeleccionada));
          if (!docSnap.exists()) return { equipos: [] };
          return docSnap.data();
          });

          setTeams(data.equipos || []);
        } catch (error) {
          console.error("Error al obtener el ranking:", error);
          setTeams([]);
        }

        setLoading(false);
      };

      fetchRanking();
    }, [vistaSeleccionada]);

    if (loading) {
      return (
        <div>
          <main className="flex justify-center items-center h-[70vh] bg-[#1a1a1a]">
            <span className="loader"></span>
          </main>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#1a1a1a] text-gray-300">
        <NavbarLideres />
        <div className="max-w-[1200px] mx-auto px-4 py-6">
          <h2 className="flex items-center justify-center gap-2 text-center font-semibold text-2xl md:text-4xl mb-4">
            <FaTrophy className="w-6 h-6 text-yellow-400" />
            RANKING
          </h2>

          {/* Botonera */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {OPCIONES_VISTA.map((opcion) => (
              <button
                key={opcion.docId}
                onClick={() => setVistaSeleccionada(opcion.docId)}
                className={`cursor-pointer px-3 py-1 rounded-full text-sm sm:text-base border border-[#a63333] transition-colors duration-300
                  ${vistaSeleccionada === opcion.docId
                    ? "bg-[#b2a27e] text-white border-yellow-300 font-bold shadow-lg"
                    : "bg-[#7d0909] text-gray-300 hover:bg-[#a63333] hover:scale-105"
                  }`}
              >
                {opcion.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-yellow-500 border-dashed rounded-full animate-spin"></div>
            </div>
          ) : teams.length === 0 ? (
            <div className="text-center py-8 text-gray-300 font-semibold">
              No hay datos disponibles para esta vista.
            </div>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden md:block overflow-x-auto mt-6">
                <div className="text-center grid grid-cols-[50px_80px_1fr_1fr_100px] gap-4 bg-[#7d0909] rounded-t-lg py-3 font-semibold text-sm md:text-base">
                  <div>#</div>
                  <div>Escudo</div>
                  <div>Equipo</div>
                  <div>Puntos</div>
                </div>

                {[...teams]
                    .sort((a, b) => a.posicion - b.posicion)
                    .map((team, index ) => {
                    const puntos = team.puntos ?? 0;
                    console.log("team", team);
                    return (
                      <div
                        key={team.usuarioId}
                        className={`grid grid-cols-[50px_80px_1fr_1fr_100px] items-center gap-4 text-center border-b border-[#b2a27e] hover:bg-[#2e2c2c] py-3 transition-all text-sm md:text-base`}
                      >
                        <div>{index + 1}</div>
                        <div className="flex justify-center w-20 h-20 md:w-24 md:h-24 scale-35">
                          <VistaPreviaEscudo
                            escudoId={team.escudoid}
                            rellenoId={team.rellenoid}
                            colorPrimario={team.colorprimario}
                            colorSecundario={team.colorsecundario}
                            escudoSize={80}
                            rellenoSize={70}
                          />
                        </div>
                        <div>{team.nombreequipo}</div>
                        <div className="font-semibold">{puntos.toFixed(2)}</div>
                      </div>
                    );
                  })}
              </div>

              {/* Mobile */}
              <div className="md:hidden flex flex-col gap-3 mt-6">
                {[...teams]
                  .sort((a, b) => a.posicion - b.posicion)
                  .map((team, index) => {
                  const puntos = team.puntos ?? 0;
                  return (
                    <div
                      key={team.id}
                      className={`bg-gray-800 p-4 rounded-lg shadow border border-gray-700`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-semibold text-yellow-400 text-lg">
                          #{index + 1}
                        </span>
                        <span className="text-yellow-400 font-semibold text-lg">
                          {puntos.toFixed(2)} pts
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center">
                          <VistaPreviaEscudo
                            escudoId={team.escudoid}
                            rellenoId={team.rellenoid}
                            colorPrimario={team.colorprimario}
                            colorSecundario={team.colorsecundario}
                            escudoSize={40}
                            rellenoSize={35}
                          />
                        </div>
                        <div className="flex flex-col justify-center">
                          <div className="font-semibold">{team.nombreequipo}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  export default Lideres;
