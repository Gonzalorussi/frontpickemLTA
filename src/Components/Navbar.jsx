  import {useState} from 'react';
  import { NavLink, useNavigate } from "react-router-dom";
  import { signOut } from "firebase/auth";
  import { auth } from "../firebase/config";
  import { FaBars, FaTimes } from "react-icons/fa";

  const navItems = [
    { path: "/equipo", label: "Equipo"},
    { path: "/", label: "Selecciones" },
    { path: "/bola-de-cristal", label: "Bola de cristal" },
    { path: "/lideres", label: "Líderes" },
    { path: "/reglas", label: "Reglas" },
  ];

  export default function Navbar({user}) {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = async () => {
      await signOut(auth);
      navigate("/login");
    };

    const toggleMenu = () => setMenuOpen(!menuOpen);

    const closeMenu = () => setMenuOpen(false);

    return (
      <nav className="sticky top-0 z-50 shadow-md  bg-[#7d0909]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-center items-center  bg-[#7d0909]">
          {/* Botón Hamburguesa */}
        <div className="sm:hidden">
          <button onClick={toggleMenu} className="text-gray-300 text-2xl">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Menú principal */}
        <div
          className={`${
            menuOpen ? "flex" : "hidden"
          } flex-col sm:flex sm:flex-row gap-6 sm:gap-10 text-sm sm:text-base sm:items-center w-full sm:w-auto sm:static absolute left-0 top-full bg-[#7d0909] sm:bg-transparent px-4 sm:px-0 py-4 sm:py-0`}
        >
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? "text-gray-300 font-semibold border-b-2 border-gray-300 pb-1"
                    : "text-gray-300 hover:text-gray-100 hover:scale-105 transition-colors"
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="ml-3 relative">
              {user && (
                <div className="text-gray-200 flex items-center gap-x-4">
                  <button
                    onClick={handleLogout}
                    className="cursor-pointer text-gray-300 hover:text-gray-100 hover:font-semibold hover:scale-105"
                  >
                    Salir
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    );
  }

