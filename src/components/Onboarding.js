import React, { useState } from 'react';
import { Rocket, Baby, Gamepad2, ArrowLeft } from 'lucide-react';

const Onboarding = ({ onSelect }) => {
    const [step, setStep] = useState(1);
    const [tempProfile, setTempProfile] = useState(null);
    const [name, setName] = useState("");
   
    if (step === 1) return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-indigo-50 to-white animate-slide-up relative">
        <div className="mb-8 p-6 bg-white rounded-[2rem] shadow-xl animate-bounce"><Rocket size={56} className="text-indigo-600" /></div>
        <h1 className="text-5xl font-black text-slate-800 mb-1 font-tech">NeuroMind</h1>
        <div className="mb-12 flex flex-col items-center">
             <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Created by</span>
             <span className="font-tech text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500 font-bold text-lg">Danny Azuncion Vinces</span>
        </div>
        
        <div className="grid gap-5 w-full max-w-sm">
          <button onClick={() => { setTempProfile('kids'); setStep(2); }} className="bg-[#FFF7ED] p-6 rounded-[2rem] border-4 border-[#FFEDD5] text-left hover:scale-[1.02] transition flex items-center gap-5">
            <div className="bg-orange-100 p-4 rounded-2xl text-orange-500"><Baby size={32} /></div>
            <div><h2 className="text-2xl font-bold text-orange-900 font-fredoka">Explorador</h2><p className="text-xs font-bold text-orange-400 uppercase">Modo Niños</p></div>
          </button>
          <button onClick={() => { setTempProfile('juniors'); setStep(2); }} className="bg-gradient-to-r from-slate-50 to-indigo-50 p-6 rounded-2xl border border-slate-200 text-left hover:border-indigo-400 transition flex items-center gap-5">
            <div className="bg-indigo-100 p-4 rounded-xl text-indigo-600"><Gamepad2 size={32} /></div>
            <div><h2 className="text-xl font-bold text-slate-800 font-nunito">Experto</h2><p className="text-xs font-bold text-slate-400 uppercase">Modo Junior</p></div>
          </button>
        </div>
      </div>
    );
   
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-white animate-slide-up">
        <div className="w-full max-w-xs">
            <h2 className="text-3xl font-black text-slate-800 mb-2">¡Hola!</h2>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Escribe tu nombre..." className="w-full bg-slate-100 p-5 rounded-2xl font-bold text-slate-800 outline-none focus:ring-4 ring-indigo-100 mb-6 text-lg border border-slate-200" autoFocus />
            <button onClick={() => onSelect(tempProfile, name || "Jugador")} className="w-full py-5 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl hover:bg-indigo-700 transition active:scale-95 flex items-center justify-center gap-2"><span>Comenzar Aventura</span> <ArrowLeft className="rotate-180" size={20}/></button>
            <button onClick={() => setStep(1)} className="mt-6 text-slate-400 font-bold text-sm w-full py-2">Volver atrás</button>
        </div>
      </div>
    );
};

export default Onboarding;