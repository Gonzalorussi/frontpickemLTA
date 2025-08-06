import React from 'react';
import { useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase/config';
import { db } from '../firebase/config';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/image.png'
import login from '../assets/login.avif'
import {FaGoogle} from 'react-icons/fa'

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      navigate("/equipo");
    }
  });
  return () => unsubscribe();
}, []);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      navigate('/equipo');

      // Referencia al documento del usuario en Firestore
      const userRef = doc(db, 'usuarios', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          nombre: user.displayName,
          email: user.email,
          fechaCreacion: serverTimestamp(),
        });
      }

      // Redirigimos al home
      navigate('/equipo');
    } catch (error) {
      console.error('Error en login con Google:', error);
    }
  };

  return (
  <>
    <div className='flex flex-col md:flex-row min-h-screen'>
      {/* Columna izquierda */}
      <div 
        className='flex flex-col justify-center items-center w-full md:w-1/3 bg-gray-900 p-8 shadow-lg'
      >
        <img className='w-20 h-24 mb-6' src={logo} alt="Logo MSI" />
        <button
          onClick={handleGoogleLogin}
          className='flex items-center gap-x-2 my-2 cursor-pointer bg-red-800 hover:bg-red-900 transition p-3 rounded-lg font-semibold text-md text-gray-200'
        >
          Iniciar sesión con Google <FaGoogle className="w-6 h-6" />
        </button>
      </div>

      {/* Columna derecha con la imagen */}
      <div className='w-full md:w-2/3 h-64 md:h-auto flex-grow'>
        <img 
          src={login} 
          alt="imagen del MSI"
          className='w-full h-full object-cover'
        />
      </div>
    </div>
  </>
);
}
