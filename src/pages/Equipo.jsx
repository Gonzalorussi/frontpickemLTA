import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import SeccionEquipo from '../Components/SeccionEquipo';
import { useNavigate, Link } from 'react-router-dom';
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { getCache, setCache } from '../utils/cache';
import { Timestamp } from 'firebase/firestore';

export default function Equipo() {
  const [user, setUser] = useState(null);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function getCachedOrFetch(key, fetchFn) {
  const cacheKey = `equipo_${key}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const data = await fetchFn();
  setCache(cacheKey, data);
  return data;
}

  function reviveTimestamps(obj) {
    if (!obj) return obj;
    const v = obj.creadoen;
    if (v && typeof v === 'object' && !v.toDate && typeof v.seconds === 'number') {
      obj.creadoen = new Timestamp(v.seconds, v.nanoseconds);
    }
    return obj;
  }

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, currentUser => {
    if (currentUser) {
      setUser(currentUser);
    } else {
      setUser(null);
      setTeam(null);
      navigate('/login');
    }
  });
  return () => unsubscribe();
}, [navigate]);

  useEffect(() => {
  if (!user) return;

  async function fetchData() {
    try {
      const data = await getCachedOrFetch(user.uid, async () => {
      const docRef = doc(db, 'equipos', user.uid);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
      });

      setTeam(reviveTimestamps(data));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  fetchData();

}, [user]);


if (loading ) {
  return (
    <div className="bg-[#1a1a1a] min-h-screen flex flex-col">
      <main className="md:h-[70vh] flex flex-col flex-grow bg-[#1f1f1f]">
            <span className="loader"></span>
      </main>
    </div>
  );
}

if (!team) {
    return (
      <div className="bg-[#1a1a1a] min-h-screen flex flex-col">
        <main className="md:h-[70vh] flex flex-col flex-grow bg-[#1f1f1f]">
          <div className="flex flex-col items-center justify-center flex-grow">
            <p className="text-xl font-semibold text-gray-300 mb-4">
              ¡Todavía no creaste tu equipo!
            </p>
            <Link to="/mi-equipo">
              <button className="cursor-pointer bg-[#a63333] text-white px-6 py-3 rounded-lg shadow-md text-lg font-semibold transition duration-300 ease-in-out transform hover:bg-red-500 hover:scale-105">
                Crear mi equipo
              </button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

const puntajesPorRonda = Object.entries(team)
  .filter(([key]) => key.startsWith("puntajepickem.ronda"))
  .map(([key, valor]) => ({
    ronda: key.split(".")[1],
    puntaje: valor,
  }))
  .sort((a, b) => parseInt(a.ronda) - parseInt(b.ronda));
const totalPuntos = team.totalpuntospickem || 0;
const fechaCreacion = team.creadoen?.toDate
  ? format(team.creadoen.toDate(), "dd 'de' MMMM yyyy", { locale: es })
  : "Desconocida";

  return (
  <div className="bg-[#1a1a1a] min-h-screen flex flex-col">
    <main className='md:h-[70vh] flex flex-col flex-grow bg-[#1f1f1f]'>
          <div className="my-4 md:my-auto flex flex-col gap-y-4 md:flex md:flex-row justify-center gap-x-4 mx-auto">
            <SeccionEquipo team={team} />
            <div className="bg-[#2a2a2a] rounded-xl p-4 w-[340px] text-gray-300 shadow-md flex flex-col justify-center">
              <h3 className="text-xl font-semibold mb-2 text-center text-gray-300"> Info del equipo</h3>
              <p className="mb-2 text-gray-300">
                <strong className='text-gray-300'>Creado:</strong> {fechaCreacion}
              </p>
              <div className="mb-4 text-gray-300">
                <strong>Puntajes por ronda:</strong>
                <ul className="mt-2 pl-4 list-disc space-y-1 text-gray-300">
                  {puntajesPorRonda.map(({ ronda, puntaje }) => (
                  <li key={ronda}>
                  {ronda}: <span className="font-semibold text-gray-300">{puntaje} pts</span>
                  </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto text-right text-lg font-bold text-gray-300">
                Total: {totalPuntos} pts
              </div>
            </div>
          </div>
    </main>
  </div>
);
}