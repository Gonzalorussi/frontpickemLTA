import { useEffect, useRef, useState } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import RondaTabs from "../Components/RondaTabs";
import MatchCard from "../Components/MatchCard";
import BracketLayoutNorte from "../Components/BracketLayoutNorte";
import BracketLayoutSur from "../Components/BracketLayoutSur";
import NavbarSelecciones from "../Components/NavbarSelecciones";
import { getCache, setCache } from "../utils/cache";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function Selecciones({ user }) {
  const [selectedRonda, setSelectedRonda] = useState(1);
  const [matches, setMatches] = useState([]);
  const [userPicks, setUserPicks] = useState({});
  const [rondaInfo, setRondaInfo] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [mensajeGuardado, setMensajeGuardado] = useState("");
  const [resultadosRonda, setResultadosRonda] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState("sur");
  
  const userRef = useRef();

  const fetchResultadosRonda = async () => {
    if (!user || selectedRonda === null) return;

    try {
      const docRef = doc(db, "equipos", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const resultados = data[`aciertos.ronda${selectedRonda}`];

        if (resultados && Array.isArray(resultados.detalles)) {
          setResultadosRonda(resultados);
        }       
      }
    } catch (error) {
      console.error("❌ Error al obtener resultados de ronda:", error);
    }
  };

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    const fetchRondaInfo = async () => {
      const cacheKey = `rounds-ronda${selectedRonda}`;
      const cached = getCache(cacheKey);
      if (cached) {
        setRondaInfo(cached.rondaData);
        setMatches(cached.matches);
        return;
      }

      const rondaDoc = await getDoc(doc(db, "rounds", `ronda${selectedRonda}`));
      if (rondaDoc.exists()) {
        const rawPartidas = rondaDoc.data().partidas || [];

        const mappedMatches = rawPartidas.map((match) => {
        const [teamA, teamB] = match.teams;
        return {
          id: match.id,
          teamA: {
            slug: teamA.code,
            name: teamA.name,
            logo: teamA.imagen,
          },
          teamB: {
            slug: teamB.code,
            name: teamB.name,
            logo: teamB.imagen,
          },
          state: match.state,
        };
        });
        setRondaInfo(rondaDoc.data());
        setMatches(mappedMatches || []);
      } else {
        setRondaInfo(null);
        setMatches([]);
      }
    };

    const fetchUserPicks = async () => {
      if (!userRef.current) return;

      const cacheKey = `selecciones-${userRef.current.uid}-ronda${selectedRonda}`;
      const cached = getCache(cacheKey);
      if (cached) {
        setUserPicks(cached);
        return;
      
      }
      const docRef = doc(db, "selecciones", userRef.current.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const picks = docSnap.data();
        const rondaPicks = picks[`ronda${selectedRonda}`] || {};
        setUserPicks(rondaPicks);
        setCache(cacheKey, rondaPicks);
      } else {
        setUserPicks({});
        setCache(cacheKey, {});
      }
    };

    fetchRondaInfo();
    fetchUserPicks();
    fetchResultadosRonda();
  }, [selectedRonda]);

  const isEditable = () => {
    if (!rondaInfo) return false;
    const now = new Date();
    const inicio = rondaInfo.fechainicio.toDate ? rondaInfo.fechainicio.toDate() : new Date(rondaInfo.fechainicio);
    const fin = rondaInfo.fechafin.toDate ? rondaInfo.fechafin.toDate() : new Date(rondaInfo.fechafin);
    return now < inicio;
  };

  const handlePick = async (matchId, teamSlug) => {
    if (!userRef.current) {
      console.warn("No hay usuario logueado, no se puede guardar selección.");
      return;
    }
    if (!isEditable()) {
      alert("La ronda ya empezó. No se pueden modificar las selecciones.");
      return;
    }

    setGuardando(true);
    const newPicks = {
      ...userPicks,
      [matchId]: teamSlug,
    };
    setUserPicks(newPicks);

    const docRef = doc(db, "selecciones", userRef.current.uid);

    try {
      const docSnap = await getDoc(docRef);

      const dataToUpdate = {
        [`ronda${selectedRonda}`]: newPicks,
        lastUpdate: serverTimestamp(),
      };

      if (!docSnap.exists() || !docSnap.data().createdAt) {
        dataToUpdate.createdAt = serverTimestamp();
      }

      await setDoc(docRef, dataToUpdate, { merge: true });

      setCache(`selecciones-${userRef.current.uid}-ronda${selectedRonda}`, newPicks);

      setMensajeGuardado("✅ Selección guardada");
      setTimeout(() => setMensajeGuardado(""), 2000);
    } catch (error) {
      console.error("Error guardando selección:", error);
      setMensajeGuardado("❌ Error al guardar");
      setTimeout(() => setMensajeGuardado(""), 2000);
    }
    setGuardando(false);
  };

  if (!user) {
    return <div className="text-center mt-10">Cargando usuario...</div>;
  }

  return (
    <>
      <NavbarSelecciones/>
      <div className="max-w-8xl mx-auto px-4 bg-[#1a1a1a]">      
        <h1 className="text-2xl font-bold mb-4 text-center text-white mt-2">Seleccioná los ganadores de las partidas de esta ronda</h1>
        <RondaTabs selectedRonda={selectedRonda} setSelectedRonda={setSelectedRonda} />

          {mensajeGuardado && (
          <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 font-semibold">
            {mensajeGuardado}
          </div>
          )}

          <div className="max-w-8xl space-y-4">
            {matches.length === 0 ? (
            <p className="text-center text-gray-500">No hay partidas para esta ronda.</p>
            ) : selectedRonda === 6 ? (
            <>
              <div className="lex flex-col items-center justify-center w-full p-4 space-y-4">
                <div className="flex justify-center space-x-4">
                  <button
                    className={`px-6 py-2 font-bold rounded ${
                    selectedRegion === "norte"
                    ? "bg-[#b2a27e] text-white border-yellow-300 font-bold shadow-lg"
                    : "bg-[#7d0909] text-gray-300 hover:bg-[#a63333] hover:scale-105"
                    }`}
                    onClick={() => setSelectedRegion("norte")}
                    >
  
                    LTA Norte
                  </button>
                  <button
                    className={`px-6 py-2 font-bold rounded ${
                    selectedRegion === "sur"
                    ? "bg-[#b2a27e] text-white border-yellow-300 font-bold shadow-lg"
                    : "bg-[#7d0909] text-gray-300 hover:bg-[#a63333] hover:scale-105"
                    }`}
                    onClick={() => setSelectedRegion("sur")}
                    >
                    LTA Sur
                  </button>
                </div>
                <p className="text-center text-gray-300 mb-4 max-w-2xl mx-auto">
                  En esta ronda deberás seleccionar los ganadores de cada partida hasta el
                  final de cada región. Completá ambas llaves para que tu selección sea
                  válida. Usá los botones para alternar entre regiones.
                </p>
  
                 <div className="flex justify-center w-full p-4">
                  <div className="flex flex-col items-center w-full max-w-7xl space-y-4">
                    {selectedRegion === "norte" ? (
                    <>
                      <BracketLayoutNorte
                        matches={matches}
                        onSelect={handlePick}
                        selectedTeamGetter={(id) => userPicks[id]}
                        disabled={!isEditable()}
                      />
                    </>
                    ) : (
                    <>
                      <BracketLayoutSur
                        matches={matches}
                        onSelect={handlePick}
                        selectedTeamGetter={(id) => userPicks[id]}
                        disabled={!isEditable()}
                      />
                    </>
                    )}
                  </div>
                </div>            
              </div>
              </>
                ) : (
                <div className="flex justify-center">
                  <div className="inline-grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-6 justify-center  ">
                    {matches.map((match) => {
                    const selected = userPicks[match.id];
                    const isSelected = selected === match.teamA.code || selected === match.teamB.code;

                    const resultado = resultadosRonda?.detalles?.find((d) => d.matchid === match.id);
                    return (
                    <div key={match.id} className="relative">
                      <MatchCard
                        match={match}
                        onSelect={handlePick}
                        selectedTeam={selected}
                        disabled={!isEditable()}
                        highlight={isSelected}
                      />

                      {!isEditable() && resultado && (
                      <div className="absolute top-2 right-2 flex items-center space-x-1 bg-black bg-opacity-70 rounded px-2 py-1">
                        {resultado.acierto ? (
                        <FaCheckCircle className="text-green-400" />
                        ) : (
                        <FaTimesCircle className="text-red-500" />
                        )}
                        <span className="text-white text-sm font-bold">+{resultado.puntos} PTS</span>
                      </div>        
                       )}
                    </div>
                    );
                  })}
                </div>
              {!isEditable() && resultadosRonda?.bonus === 20 && (
              <div className="mt-4 flex justify-center">
                <div className="bg-yellow-500 text-white font-bold px-4 py-2 rounded-xl shadow-lg animate-pulse">
                  🎉 Bonus Perfecto: +20PTS
                </div>
              </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
