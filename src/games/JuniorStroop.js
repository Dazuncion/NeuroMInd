import React, { useState, useEffect } from 'react';
import useGameLogic from '../hooks/useGameLogic';

const JuniorStroop = ({ level, onComplete, sfx }) => {
  const [q] = useState(() => {
    const cols = [{n:'ROJO', c:'#ef4444', v:'r'}, {n:'AZUL', c:'#3b82f6', v:'b'}, {n:'VERDE', c:'#22c55e', v:'g'}];
    if (level > 4) cols.push({n:'AMARILLO', c:'#eab308', v:'y'});
    if (level > 8) cols.push({n:'MORADO', c:'#a855f7', v:'p'});
    const txt = cols[Math.floor(Math.random()*cols.length)]; 
    const col = cols[Math.floor(Math.random()*cols.length)]; 
    const match = Math.random() > 0.5;
    return { txt, visual: match ? txt.c : (txt.v===col.v ? cols.find(x=>x.v!==txt.v).c : col.c), match };
  });
  
  const { submit, getStyle, isLocked } = useGameLogic(onComplete);
  const [bar, setBar] = useState(100);

  useEffect(() => {
    const decay = 1.0 + (level * 0.15);
    const t = setInterval(() => {
      // CORRECCIÓN CRÍTICA: Si ya está bloqueado, no hacemos nada
      if (isLocked) return;

      setBar(prevBar => {
        // Si la barra ya está en 0, no volvemos a llamar a perder.
        // Esto evita que se resten múltiples vidas.
        if (prevBar <= 0) return 0;

        const newValue = prevBar - decay;
        
        // Solo si cruzamos de positivo a negativo/cero, llamamos a perder
        if(newValue <= 0) { 
            sfx('lose'); 
            onComplete(false); 
            return 0; 
        }
        return newValue;
      });
    }, 50);
    return () => clearInterval(t);
  }, [isLocked, level, sfx, onComplete]);

  return (
    <div className="w-full max-w-md flex flex-col items-center animate-pop-in">
      <div className="w-full h-3 bg-slate-100 rounded-full mb-8 overflow-hidden"><div className="h-full bg-indigo-500 transition-all duration-100 linear" style={{width: `${bar}%`}}/></div>
      <p className="mb-8 text-slate-400 font-bold text-xs uppercase tracking-widest">¿Coincide palabra y color?</p>
      <div className="text-5xl md:text-6xl font-black mb-16 transform scale-110 transition-colors duration-200 uppercase tracking-tight" style={{color: q.visual}}>{q.txt.n}</div>
      <div className="flex gap-4 w-full justify-center max-w-xs">
        <button onClick={()=>submit(q.match, 'y')} className={`flex-1 py-5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-2xl font-bold hover:bg-emerald-100 btn-game ${getStyle('y')}`}>SÍ</button>
        <button onClick={()=>submit(!q.match, 'n')} className={`flex-1 py-5 bg-rose-50 text-rose-600 border border-rose-200 rounded-2xl font-bold hover:bg-rose-100 btn-game ${getStyle('n')}`}>NO</button>
      </div>
    </div>
  );
};

export default JuniorStroop;