import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import NavbarReglas from '../Components/NavbarReglas'

function Reglas() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-gray-300">
      <NavbarReglas/>
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        <section className="bg-[#7d0909] p-6 rounded-xl my-6">
          <h3 className="text-xl font-semibold text-center text-gray-300">IMPORTANTE</h3>
          <p className="text-xl mt-4 text-center text-gray-300">
            Las rondas son <strong>semanales</strong> y se puede
            confirmar/actualizar las selecciones hasta <strong>la hora que inicia la fecha</strong>
          </p>
        </section>

        <h3 className=" mt-6 text-2xl font-semibold text-gray-300">CÓMO JUGAR</h3>

        <section className="bg-[#2a2a2a] p-6 rounded-xl mt-6">
          <h4 className="font-semibold text-gray-200 text-lg">
            CREANDO TU EQUIPO
          </h4>
          <ul className="list-disc pl-6 flex flex-col gap-y-4 mt-4">
            <li>
              <p>Paea empezar, inicia sesión con tu cuenta de Google.</p>
            </li>
            <li>
              <p>Luego crea tu equipo con su nombre, escudo y colores.</p>
            </li>
            <li>
              <p>
                Si ya participaste del Fantasy, jugas con el equipo que tenías
              </p>
            </li>
            <li>
              <p>
                Las selecciones de equipos ganadores se bloquean cuando inicia la fecha de la LTA Sur
              </p>
            </li>
            <li>
              <p>
                Las predicciones de la bola de crital se bloquean el sábado 26 de julio a las 12:00:00 hora Argentina
              </p>
            </li>
            <li>
              <p>
                Ganas puntos según la cantidad de aciertos en tus selecciones de cada ronda. Al final del torneo se suman los puntos por
                las predicciones acertadas de la Bola de crital.
              </p>
            </li>
            <li>
              <p>
                Los resultados finales de las rondas 1 a 5 son calculados dentro de
                las 24 horas de terminada la fecha. Estimamos que los lunes a las 20:00:00 hora Argentina ya podrás acceder a 
                tus puntajes y las selecciones de la próxima ronda.
              </p>
            </li>
            <li>
              <p>
                Cuando se active la ronda 6, deberás completar los ganadores de cada llave hasta la final y el ganador. Estos resultados
                se actualizarán durante la semana siguiente a terminado el torneo.
              </p>
            </li>
          </ul>
        </section>

        <h3 className="text-white mt-6 text-2xl font-semibold text-gray-300">PUNTAJES</h3>

        <section className="bg-[#2a2a2a] p-6 rounded-xl my-6">
          <p>
            Cada acierto en las rondas 1 a 5 otorga 10 puntos.
          </p>
          <p className="mt-4">
            Si en una ronda tenés selecciones perfectas, sumás un bonus de 20 puntos más
          </p>
          <p className="mt-4">
            Tu puntaje final para una ronda es el acumulado de los puntos que
            obtuviste por aciertos y el bonus en caso de que lo hayas obtenido.
          </p>
        </section>
      </div>
    </div>
  );
}

export default Reglas;
