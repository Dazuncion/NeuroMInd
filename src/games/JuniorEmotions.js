import React, { useState, useEffect } from 'react';
import useGameLogic from '../hooks/useGameLogic';

const JuniorEmotions = ({ level, onComplete, sfx }) => {
  const [q] = useState(() => {
    const list = [
      {id:'anx', l:'Ansiedad', e:'😰'}, {id:'emp', l:'Empatía', e:'🤗'}, {id:'fru', l:'Frustración', e:'😤'}, 
      {id:'pro', l:'Orgullo', e:'😎'}, {id:'hap', l:'Euforia', e:'🤩'}, {id:'conf', l:'Confusión', e:'🤔'},
      {id:'lov', l:'Amor', e:'😍'}, {id:'bor', l:'Aburrimiento', e:'😒'}, {id:'fea', l:'Miedo', e:'😱'}
    ];
    const activeList = level < 3 ? list.slice(0, 5) : list;
    const tgt = activeList[Math.floor(Math.random()*activeList.length)]; 
    const opts = activeList.filter(x => x.id !== tgt.id).sort(()=>Math.random()-.5).slice(0,3); 
    opts.push(tgt); opts.sort(()=>Math.random()-.5);
    return { tgt, opts };
  });

  const { submit, getStyle, isLocked } = useGameLogic(onComplete);
  const [bar, setBar] = useState(100);

  useEffect(() => {
    const decay = 1.0 + (level * 0.1);
    const t = setInterval(() => {
      // CORRECCIÓN CRÍTICA:
      if (isLocked) return;

      setBar(prevBar => {
        if (prevBar <= 0) return 0; // Si ya es 0, detener.

        const newValue = prevBar - decay;
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
    <div className="w-full max-w-md animate-pop-in">
      <div className="w-full h-3 bg-slate-100 rounded-full mb-8 overflow-hidden"><div className="h-full bg-rose-500 transition-all duration-100 linear" style={{width: `${bar}%`}}/></div>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black text-slate-700 mb-2">Identifica: <span className="text-rose-600">{q.tgt.l}</span></h2>
      </div>
      <div className="grid grid-cols-2 gap-5">
        {q.opts.map(o => (
          <button key={o.id} onClick={() => submit(o.id === q.tgt.id, o.id)} className={`btn-game p-8 flex flex-col items-center gap-2 rounded-3xl bg-white ${getStyle(o.id)}`}>
            <span className="text-6xl filter drop-shadow-sm">{o.e}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default JuniorEmotions;