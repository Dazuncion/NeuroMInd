import React, { useState } from 'react';
import { Baby, Rocket, ArrowRight } from 'lucide-react';

// Ahora aceptamos "initialName"
const Onboarding = ({ onSelect, initialName = "" }) => {
  const [name, setName] = useState(initialName);
  const [step, setStep] = useState(initialName ? 2 : 1); // Si ya hay nombre, saltamos al paso 2

  const handleNext = () => {
    if (name.trim().length > 0) setStep(2);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 animate-slide-up">
      {step === 1 ? (
        <div className="w-full max-w-sm text-center">
          <h2 className="text-3xl font-black text-slate-800 mb-6">¿Cómo te llamas?</h2>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu Nombre o Apodo"
            className="w-full p-4 rounded-2xl border-2 border-indigo-100 text-center text-xl font-bold text-indigo-600 focus:border-indigo-500 outline-none mb-6 shadow-sm"
          />
          <button 
            onClick={handleNext}
            disabled={!name.trim()}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
          >
            Siguiente <ArrowRight size={20} />
          </button>
        </div>
      ) : (
        <div className="w-full max-w-sm text-center animate-pop-in">
           <h2 className="text-3xl font-black text-slate-800 mb-2">¡Hola, {name}!</h2>
           <p className="text-slate-500 font-bold mb-8">Elige tu modo de entrenamiento</p>
           
           <div className="grid gap-4">
             <button onClick={() => onSelect('kids', name)} className="bg-orange-100 p-4 rounded-3xl border-2 border-orange-200 hover:border-orange-500 transition-all flex items-center gap-4 text-left">
                <div className="bg-orange-500 p-3 rounded-2xl text-white"><Baby size={32}/></div>
                <div>
                    <h3 className="text-xl font-black text-orange-700">Modo Kids</h3>
                    <p className="text-sm text-orange-600 font-semibold">4 - 8 Años</p>
                </div>
             </button>

             <button onClick={() => onSelect('juniors', name)} className="bg-indigo-100 p-4 rounded-3xl border-2 border-indigo-200 hover:border-indigo-500 transition-all flex items-center gap-4 text-left">
                <div className="bg-indigo-600 p-3 rounded-2xl text-white"><Rocket size={32}/></div>
                <div>
                    <h3 className="text-xl font-black text-indigo-700">Modo Juniors</h3>
                    <p className="text-sm text-indigo-600 font-semibold">+9 Años</p>
                </div>
             </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Onboarding;