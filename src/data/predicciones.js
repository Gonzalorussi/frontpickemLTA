import champions from './champions';
import players from './players.json'
import tiempo from '../assets/Actions/tiempo.webp'
import baron from '../assets/Actions/baron.jpeg'
import pentakill from '../assets/Actions/pentakill.jpg'
import dragon from '../assets/Actions/dragon.png'
import login from '../assets/login.avif'
import nubes from '../assets/Dragons/Cloud.webp'
import fuego from '../assets/Dragons/Infernal.webp'
import chemtech from '../assets/Dragons/Chemtech.webp'
import hectech from '../assets/Dragons/Hextech.webp'
import piedra from '../assets/Dragons/Mountain.webp'
import agua from '../assets/Dragons/Ocean.webp'
import silueta from '../assets/silueta.png'
import teams from './teams.json'
import logo from '../assets/logo.png'

const preguntas = [
  // Fila 1: acciones
  {
    id: "a1",
    tipo: "acciones",
    texto: "¿Cuánto durará la partida más larga?",
    puntos: 50,
    imagen: tiempo,
    opciones: [
      { id: "1", respuesta: "44:59 o menos" },
      { id: "2", respuesta: "45:00 a 49:59" },
      { id: "3", respuesta: "50:00 a 54:59" },
      { id: "4", respuesta: "55:00 o más" }
    ],
  },
  {
    id: "a2",
    tipo: "acciones",
    texto: "¿Cuántos pentakills habrá?",
    puntos: 50,
    imagen: pentakill,
    opciones: [
      { id: "1", respuesta: "0", imagen: pentakill },
      { id: "2", respuesta: "1", imagen: pentakill },
      { id: "3", respuesta: "2", imagen: pentakill },
      { id: "4", respuesta: "3 o más", imagen: pentakill }
    ],
  },
  {
    id: "a3",
    tipo: "acciones",
    texto: "¿Cuál será el dragón más obtenido?",
    puntos: 50,
    imagen: dragon,
    opciones: [
      { id: "1", respuesta: "De las nubes", imagen: nubes },
      { id: "2", respuesta: "De las montañas", imagen: piedra },
      { id: "3", respuesta: "De océano", imagen: agua },
      { id: "4", respuesta: "Infernal", imagen: fuego },
      { id: "5", respuesta: "Hextech", imagen: hectech },
      { id: "6", respuesta: "Quimtech", imagen: chemtech }
    ],
  },
  {
    id: "a4",
    tipo: "acciones",
    texto: "¿Cuántos robos de barón habrá?",
    puntos: 50,
    imagen: baron,
    opciones: [
      { id: "1", respuesta: "0 a 2", imagen: baron },
      { id: "2", respuesta: "3 a 5", imagen: baron },
      { id: "3", respuesta: "6 a 8", imagen: baron },
      { id: "4", respuesta: "9 o más", imagen: baron }
    ],
  },
  // Fila 2: campeones
  {
    id: "c1",
    tipo: "campeones",
    texto: "¿Cuál será campeón jugado en más roles diferentes?",
    puntos: 50,
    imagen: login,
    opciones: champions,
  },
  {
    id: "c2",
    tipo: "campeones",
    texto: "¿Cuál será campeón más pickeado?",
    puntos: 50,
    imagen: login,
    opciones: champions,
  },
  {
    id: "c3",
    tipo: "campeones",
    texto: "¿Cuál será campeón más baneado?",
    puntos: 50,
    imagen: login,
    opciones: champions,
  },
  {
    id: "c4",
    tipo: "campeones",
    texto: "¿Cuál será campeón que más muertes acumule?",
    puntos: 50,
    imagen: login,
    opciones: champions,
  },
  // Fila 3: jugadores
  {
    id: "j1",
    tipo: "jugadores",
    texto: "¿Quién tendrá más asesinatos en una partida?",
    puntos: 50,
    imagen: silueta,
    opciones: players
  },
  {
    id: "j2",
    tipo: "jugadores",
    texto: "¿Quién tendrá el winrate más alto?",
    puntos: 50,
    imagen: silueta,
    opciones: players
  },
  {
    id: "j3",
    tipo: "jugadores",
    texto: "¿Quién jugará más campeones diferentes?",
    puntos: 50,
    imagen: silueta,
    opciones: players
  },
  {
    id: "j4",
    tipo: "jugadores",
    texto: "¿Quién tendrá el KDA más alto?",
    puntos: 50,
    imagen: silueta,
    opciones: players
  },
  // Fila 4: equipos
  {
    id: "e1",
    tipo: "equipos",
    texto: "¿Quién será el campeón de la LTA Sur?",
    puntos: 50,
    imagen: logo,
    opciones: teams
  },
  {
    id: "e2",
    tipo: "equipos",
    texto: "¿Quiém será el campeón de la LTA Norte?",
    puntos: 50,
    imagen: logo,
    opciones: teams
  },
  {
    id: "e3",
    tipo: "equipos",
    texto: "¿Qué equipo jugará más campeones diferentes?",
    puntos: 50,
    imagen: logo,
    opciones: teams
  },
  {
    id: "e4",
    tipo: "equipos",
    texto: "¿Qué equipo ganará la partida más corta?",
    puntos: 50,
    imagen: logo,
    opciones: teams
  },
];

export default preguntas;
