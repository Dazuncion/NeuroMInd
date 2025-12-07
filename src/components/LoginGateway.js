import React from 'react';
import { Cloud, WifiOff, ShieldCheck } from 'lucide-react';
import { loginWithGoogle } from '../firebase'; 

const LoginGateway = ({ onLogin, onOffline }) => {
  
  const handleGoogleLogin = async () => {
    const user = await loginWithGoogle();
    if (user) {
      // Pasamos el usuario a App.js
      onLogin({
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photo: user.photoURL
      });
    }
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 p-6 animate-pop-in">
      <div className="mb-10 text-center">
        <h1 className="text-5xl font-black text-slate-800 mb-2 font-tech">NEUROMIND</h1>
        <p className="text-slate-500 font-bold">Selecciona tu modo de acceso</p>
      </div>

      <div className="grid gap-6 w-full max-w-md">
        {/* OPCIÓN 1: ONLINE (Google) */}
        <button 
          onClick={handleGoogleLogin}
          className="relative group bg-white p-6 rounded-3xl shadow-xl border-2 border-indigo-100 hover:border-indigo-500 transition-all text-left flex items-center gap-4"
        >
          <div className="bg-indigo-100 p-4 rounded-full text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <Cloud size={32} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800">Acceso Educativo</h3>
            <p className="text-sm text-slate-500">Guarda progreso, compite en Ranking y obtén Reportes IA.</p>
            <div className="flex gap-2 mt-2">
               <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1"><ShieldCheck size={10}/> SEGURO</span>
               <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">GOOGLE</span>
            </div>
          </div>
        </button>

        {/* OPCIÓN 2: OFFLINE (Gratis) */}
        <button 
          onClick={onOffline}
          className="group bg-slate-100 p-6 rounded-3xl border-2 border-transparent hover:bg-slate-200 transition-all text-left flex items-center gap-4 opacity-80 hover:opacity-100"
        >
          <div className="bg-slate-300 p-4 rounded-full text-slate-500 group-hover:text-slate-700">
            <WifiOff size={32} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-700">Modo Offline</h3>
            <p className="text-sm text-slate-500">Jugar sin internet. El progreso solo se guarda en este dispositivo.</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default LoginGateway;