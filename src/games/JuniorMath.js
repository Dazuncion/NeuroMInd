import React, { useState, useEffect } from 'react';

const JuniorMath = ({ level, onComplete, sfx }) => {
  const [q, setQ] = useState(null);
  const [bar, setBar] = useState(100);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const ops = level < 5 ? ['+','-'] : ['+','-','x'];
    const op = ops[Math.floor(Math.random()*ops.length)];
    const max = 10 + (level * 2);
    let a, b, cor;
    if(op==='x') { a=Math.floor(Math.random()*(level+2))+2; b=Math.floor(Math.random()*9)+1; cor=a*b; }
    else { a=Math.floor(Math.random()*max)+5; b=Math.floor(Math.random()*(max/2))+1; cor=op==='+'?a+b:a-b; }
    const off = Math.floor(Math.random()*3)+1; const wrg = cor+(Math.random()>.5?off:-off); const left = Math.random()>.5;
    setQ({ a, b, op, cor, wrg, left });
    setBar(100); 
    setLocked(false);
  }, [level]);

  useEffect(() => {
    if(!q || locked) return;
    const decay = 0.5 + (level * 0.1); 
    
    const t = setInterval(() => {
        setBar(prevBar => {
            // CORRECCIÓN CRÍTICA: Detener llamadas múltiples si ya es 0
            if (prevBar <= 0) return 0;

            const newValue = prevBar - decay;
            if (newValue <= 0) { 
                if (!locked) { // Doble verificación de seguridad
                    sfx('lose'); 
                    onComplete(false);
                }
                return 0; 
            } 
            return newValue; 
        });
    }, 50);
    return () => clearInterval(t);
  }, [q, locked, level, sfx, onComplete]);

  const ans = (isLeft) => {
    if(locked) return; 
    setLocked(true);
    const correct = isLeft ? q.left : !q.left;
    if(correct) setTimeout(()=>onComplete(true), 500); else setTimeout(()=>onComplete(false), 500);
  };

  if(!q) return null;
  return (
    <div className="w-full max-w-md flex flex-col items-center animate-pop-in p-6">
       <div className="w-full h-3 bg-slate-100 rounded-full mb-8 overflow-hidden"><div className="h-full bg-rose-500 transition-all duration-100 linear" style={{width: `${bar}%`}}/></div>
       <div className="text-5xl font-black text-slate-700 bg-white px-10 py-8 rounded-[2rem] mb-12 shadow-sm border border-slate-100">{q.a} <span className="text-indigo-500">{q.op}</span> {q.b}</div>
       <div className="grid grid-cols-2 gap-6 w-full max-w-xs">
         <button onClick={()=>ans(true)} className={`h-24 btn-game bg-white rounded-2xl text-4xl font-bold text-slate-700 ${locked && q.left ? 'btn-correct' : locked ? 'opacity-50' : ''}`}>{q.left ? q.cor : q.wrg}</button>
         <button onClick={()=>ans(false)} className={`h-24 btn-game bg-white rounded-2xl text-4xl font-bold text-slate-700 ${locked && !q.left ? 'btn-correct' : locked ? 'opacity-50' : ''}`}>{!q.left ? q.cor : q.wrg}</button>
       </div>
    </div>
  );
};

export default JuniorMath;