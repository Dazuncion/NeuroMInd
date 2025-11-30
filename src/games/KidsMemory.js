import React, { useState, useEffect, useRef } from 'react';

const KidsMemory = ({ level, onComplete, playTone }) => {
  const [seq, setSeq] = useState([]);
  const [step, setStep] = useState(0);
  const [isInputLocked, setInputLocked] = useState(true);
  const [lit, setLit] = useState(null);
  const [msg, setMsg] = useState("Observa");
  const mounted = useRef(true);
  const timeouts = useRef([]);
  const safePlayTone = playTone || (() => {});
  useEffect(() => {
    mounted.current = true;
    timeouts.current.forEach(clearTimeout);
    const len = 2 + Math.floor(level/2);
    const newSeq = Array(len).fill(0).map(()=>Math.floor(Math.random()*4));
    setSeq(newSeq);
    const speed = Math.max(250, 600 - (level * 35));
    const startTimeout = setTimeout(() => playSequence(newSeq, speed), 800);
    timeouts.current.push(startTimeout);
    return () => { mounted.current = false; timeouts.current.forEach(clearTimeout); };
  }, [level]);
  const playSequence = (sequence, speed) => {
    if (!mounted.current) return;
    setInputLocked(true);
    setMsg("Observa...");
    let i = 0;
    const next = () => {
      if (!mounted.current) return;
      if (i >= sequence.length) { setInputLocked(false); setMsg("¡Tu turno!"); return; }
      const pad = sequence[i];
      setLit(pad);
      safePlayTone([300, 450, 600, 800][pad], 'sine', 0.2);
      const t1 = setTimeout(() => {
        if (!mounted.current) return;
        setLit(null);
        i++;
        const t2 = setTimeout(next, speed * 0.5); 
        timeouts.current.push(t2);
      }, speed); 
      timeouts.current.push(t1);
    };
    next();
  };
  const click = (i) => {
    if (isInputLocked) return;
    setLit(i);
    safePlayTone([300, 450, 600, 800][i], 'sine', 0.2);
    setTimeout(() => setLit(null), 200);
    if (i === seq[step]) {
      if (step + 1 === seq.length) {
        setInputLocked(true);
        setMsg("¡Muy Bien!");
        setTimeout(() => onComplete(true), 800);
      } else { setStep(s => s + 1); }
    } else {
      setInputLocked(true);
      setMsg("¡Oh no!");
      setTimeout(() => onComplete(false), 800);
    }
  };
  const colors = ['bg-green-400 border-green-500', 'bg-red-400 border-red-500', 'bg-yellow-400 border-yellow-500', 'bg-blue-400 border-blue-500'];
  return (
    <div className="flex flex-col items-center w-full">
      <div className="grid grid-cols-2 gap-4 mb-10 p-4 bg-white rounded-[3rem] border-4 border-slate-100 shadow-sm">
        {colors.map((c, i) => (
          <button key={i} onClick={()=>click(i)} className={`w-24 h-24 rounded-3xl border-b-[6px] active:border-b-0 active:translate-y-[6px] transition-all ${c} ${lit===i ? 'brightness-150 scale-95 simon-lit' : ''}`} />
        ))}
      </div>
      <p className="text-slate-400 font-black text-2xl uppercase tracking-widest animate-pulse">{msg}</p>
    </div>
  );
};

export default KidsMemory;