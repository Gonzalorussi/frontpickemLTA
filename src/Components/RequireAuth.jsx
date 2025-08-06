// RequireAuth.jsx
import { useEffect, useState } from "react";
import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function RequireAuth({ children }) {
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
      } else {
        navigate("/login");
      }
      setChecking(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (checking) return <div className="text-center mt-10">Cargando sesión...</div>;

  return typeof children === "function" ? children(user) : children;
}
