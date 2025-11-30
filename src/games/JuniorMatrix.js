import React, { useState, useEffect, useRef } from 'react';

const JuniorMatrix = ({ level, onComplete, sfx }) => {
  const [pattern, setPattern] = useState([]); 
  const [hits, setHits] = useState([]); 
  const [phase, setPhase] = useState('show');
  const [litIndex, setLitIndex] = useState(null);
  const mounted = useRef(true);
  const [isLocked, setIsLocked] = useState(true);
  useEffect(() => {
    mounted.current = true;
    const count = Math.min(9, 3 + Math.floor(level/2)); 
    const pat = [];
    while(pat.length < count) { const r = Math.floor(Math.random()*9); if(!pat.includes(r)) pat.push(r); }
    setPattern(pat); setHits([]); setPhase('show'); setIsLocked(true);
    const speed = Math.max(200, 600 - (level * 40));
    let i = 0;
    const showNext = () => {
      if (!mounted.current) return;
      if (i >= pat.length) { 
        setLitIndex(null); 
        setTimeout(() => { if(mounted.current) { setPhase('play'); setIsLocked(false); } }, 500); 
        return; 
      }
      setLitIndex(pat[i]);
      setTimeout(() => { if (!mounted.current) return; setLitIndex(null); i++; setTimeout(showNext, speed / 2); }, speed);
    };
    setTimeout(showNext, 800);
    return () => { mounted.current = false; };
  }, [level]);
  const click = (i) => { 
    if(phase !== 'play' || hits.includes(i) || isLocked) return; 
    if(pattern.includes(i)) { 
      const newHits = [...hits, i]; 
      setHits(newHits); sfx('pop'); 
      if(newHits.length === pattern.length) { setIsLocked(true); setTimeout(() => onComplete(true), 500); }
    } else { setIsLocked(true); onComplete(false); }
  };
  const colors = ['bg-rose-500', 'bg-sky-500', 'bg-emerald-500', 'bg-amber-500', 'bg-violet-500'];
  return (
    <div className="w-full max-w-md flex flex-col items-center">
      <p className="mb-8 text-slate-400 font-bold text-sm uppercase tracking-widest h-6">{phase === 'show' ? 'Memoriza la secuencia' : 'Repite el patrón'}</p>
      <div className="grid gap-4 bg-slate-100 p-4 rounded-[2rem]" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {Array(9).fill(0).map((_, i) => { 
          const isLit = i === litIndex;
          const isHit = hits.includes(i);
          const colorClass = colors[i % colors.length];
          const activeClass = isLit ? `${colorClass} scale-95 ring-4 ring-white` : isHit ? 'bg-indigo-600 scale-95' : 'bg-white hover:bg-slate-50 cursor-pointer';
          return <div key={i} onClick={()=>click(i)} className={`w-20 h-20 rounded-2xl transition-all duration-200 shadow-sm ${activeClass}`} />; 
        })}
      </div>
    </div>
  );
};

export default JuniorMatrix;