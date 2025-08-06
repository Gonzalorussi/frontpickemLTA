import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar"
import Selecciones from "./pages/Selecciones";
import BolaDeCristal from "./pages/BolaDeCristal";
import Lideres from "./pages/Lideres";
import Equipo from "./pages/Equipo"
import RequireAuth from "./Components/RequireAuth";
import Login from './pages/Login'
import Reglas from './pages/Rules'
import Footer from './Components/Footer'
import { AuthContext } from "./context/AuthContext"
import MiEquipo from './Components/MiEquipo'; 

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="text-center mt-10">Verificando sesión...</div>;
  }
  
  return (
    <Router>
      <Navbar user={user}/>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
            path="/"
            element={
            <RequireAuth>
              <Selecciones user={user}/>
            </RequireAuth>
          }
        />
        <Route
            path="/equipo"
            element={
            <RequireAuth>
              <Equipo user={user}/>
            </RequireAuth>
          }
        />
        <Route
          path="/bola-de-cristal"
          element={
            <RequireAuth>
              <BolaDeCristal user={user}/>
            </RequireAuth>
          }
        />
        <Route
          path="/lideres"
          element={
            <RequireAuth>
              <Lideres user={user}/>
            </RequireAuth>
          }
        />
        <Route
          path="/reglas"
          element={
            <RequireAuth>
              <Reglas user={user}/>
            </RequireAuth>
          }
        />
        <Route 
          path="/mi-equipo"
          element={
            <RequireAuth>
              <MiEquipo user={user}/>
            </RequireAuth>}
        />
      </Routes>
      <Footer/>
      
    </Router>
  );
}

export default App;

