import React, { useState, useEffect, useRef } from "react";
import CrystalBallCard from "../Components/CrystalBallCard";
import preguntas from "../data/predicciones";
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from "../firebase/config";
import NavbarBoladeCristal from "../Components/NavbarBoladeCristal";
import { getCache, setCache } from "../utils/cache";

export default function BolaDeCristal({ user }) {
  const [respuestas, setRespuestas] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [cuentaRegresiva, setCuentaRegresiva] = useState("");
  const [yaConfirmadas, setYaConfirmadas] = useState(false);
  const [huboCambios, setHuboCambios] = useState(false);
  const userRef = useRef();

  const torneoInicio = new Date("2025-07-26T12:00:00-03:00");
  const isEditable = () => new Date() < torneoInicio;

  async function getCachedOrFetch(key, fetchFn) {
  const cacheKey = `boladecristal_${key}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const data = await fetchFn();
  setCache(cacheKey, data);
  return data;
}

  useEffect(() => {
    userRef.current = user;
  }, [user]);
  
  useEffect(() => {
    if (!user) return;

    const cargarRespuestas = async () => {

      try {

        const data = await getCachedOrFetch("predicciones", async () => {
        const docRef = doc(db, "predicciones", user.uid);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() : {};
      });

      setRespuestas(data.respuestas || {});
      setYaConfirmadas(!!data.confirmado);
      setHuboCambios(false);
    } catch (error) {
      console.error("Error al obtener predicciones guardadas:", error);
    }
  };

  cargarRespuestas();
}, [user]);

  const handleSeleccion = async (idPregunta, respuesta) => {
    const nuevasRespuestas = {
      ...respuestas,
      [idPregunta]: respuesta,
    };

  setRespuestas(nuevasRespuestas);
  setHuboCambios(true);

  if (!userRef.current) return;

    const docRef = doc(db, "predicciones", userRef.current.uid);

    try {
      const docSnap = await getDoc(docRef);

      const dataToSave = {
        respuestas: nuevasRespuestas,
        lastUpdate: serverTimestamp(),
      };

      if (!docSnap.exists() || !docSnap.data().createdAt) {
        dataToSave.createdAt = serverTimestamp();
      }

      await setDoc(docRef, dataToSave, { merge: true });
      setMensaje("✅ Predicción guardada");
      setTimeout(() => setMensaje(""), 2000);
      setCache("boladecristal_predicciones", {
        respuestas: nuevasRespuestas,
        confirmado: yaConfirmadas,
      });
    } catch (e) {
      console.error("Error al guardar predicción:", e);
      setMensaje("❌ Error al guardar");
      setTimeout(() => setMensaje(""), 2000);
    }
  };

  const confirmarPredicciones = async () => {
  if (!userRef.current) return;
  try {
    const docRef = doc(db, "predicciones", userRef.current.uid);
    await setDoc(docRef, {
      respuestas,
      confirmado: true,
      confirmadoAt: serverTimestamp(),
      }, { merge: true });
      setMensaje("🔒 Predicciones confirmadas");
      setYaConfirmadas(true); 
      setHuboCambios(false);
      setTimeout(() => setMensaje(""), 3000);
    } catch (e) {
      console.error("Error al confirmar:", e);
      setMensaje("❌ Error al confirmar");
      setTimeout(() => setMensaje(""), 3000);
    }
  };

  useEffect(() => {
  const actualizarCuenta = () => {
    const ahora = new Date();
    const diff = torneoInicio - ahora;

    if (diff <= 0) {
      setCuentaRegresiva("🏁 El torneo ya comenzó");
      return;
    }

    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((diff / (1000 * 60)) % 60);
    const segundos = Math.floor((diff / 1000) % 60);

    setCuentaRegresiva(`⏳ Tiempo restante: ${dias}d ${horas}h ${minutos}m ${segundos}s`);
  };

  actualizarCuenta(); // Primer llamado inmediato
  const intervalo = setInterval(actualizarCuenta, 1000); // Cada segundo

  return () => clearInterval(intervalo); // Cleanup al desmontar
}, []);

 const renderFila = (tipo) => {
  const preguntasFiltradas = preguntas.filter((p) => p.tipo === tipo);
  return (
    <>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 my-6">
      {preguntasFiltradas.map((pregunta) => {
        return (
          <CrystalBallCard
            key={pregunta.id}
            pregunta={pregunta}
            respuesta={respuestas[pregunta.id]}
            onSelect={handleSeleccion}
            disabled={!isEditable()}
            fila4={pregunta.tipo === "equipos"}
          />
          );
        })}
      </div>
      </>    
    );
  };

  if (!user) {
    return <div className="text-center mt-10">Cargando usuario...</div>;
  }

  const totalPreguntas = preguntas.length;
  const prediccionesCompletas = Object.keys(respuestas).length === totalPreguntas;

  return (
    <>
    <NavbarBoladeCristal/>
    <div className="bg-black text-white p-4 mb-6 text-center shadow-md">
      {Object.keys(respuestas).length === 0 && (
        <p className="mb-2 font-semibold">Aún no indicaste tus predicciones. ¡Recordá hacerlo antes del inicio del torneo!</p>
        )}
      {Object.keys(respuestas).length > 0 && !prediccionesCompletas && (
        <p className="mb-2 font-semibold">Tenés predicciones sin realizar. ¡No te olvides de completarlas!</p>
        )}
      {prediccionesCompletas && (
        <p className="mb-2 font-semibold">Ya completaste tus predicciones. Podés modificarlas hasta que empiece el torneo.</p>
        )}
      <p className="text-xl font-bold">{cuentaRegresiva}</p>
    </div>
    <div className="max-w-7xl mx-auto px-4 py-6">
      
      {renderFila("acciones")}
      {renderFila("campeones")}
      {renderFila("jugadores")}
      {renderFila("equipos")}

      {isEditable() && (
        <div className="text-center mt-8">
    <button
      onClick={confirmarPredicciones}
      disabled={
        !prediccionesCompletas ||
        (!huboCambios && yaConfirmadas)
      }
      className={`${
        !prediccionesCompletas || (!huboCambios && yaConfirmadas)
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-green-600 hover:bg-green-700"
      } text-white font-bold px-6 py-3 rounded transition`}
    >
      {yaConfirmadas
        ? huboCambios
          ? "Actualizar predicciones"
          : "Predicciones confirmadas"
        : "Confirmar predicciones"}
    </button>
  </div>
      )}
    </div>
    </>
  );
}
