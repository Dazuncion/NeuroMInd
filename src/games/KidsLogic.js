import React, { useState } from 'react';
import useGameLogic from '../hooks/useGameLogic';

const KidsLogic = ({ level, onComplete }) => {
  const [q] = useState(() => { 
    if (level >= 5) {
        const val = Math.floor(Math.random() * 20) + 1;
        const isEven = val % 2 === 0;
        return { type: 'parity', val, correct: isEven ? 'even' : 'odd' };
    }
    const n = Math.random() > 0.5; 
    return { type: 'class', isNum: n, val: n ? Math.floor(Math.random()*9) : "ABC"[Math.floor(Math.random()*3)] }; 
  });

  const { submit, getStyle } = useGameLogic(onComplete);

  if (q.type === 'parity') {
      return (
        <div className="flex flex-col items-center gap-10 w-full max-w-xs animate-pop-in">
          <div className="w-48 h-48 bg-white border-[6px] border-indigo-100 rounded-[3rem] flex items-center justify-center text-8xl font-black text-slate-700 shadow-sm">{q.val}</div>
          <div className="flex gap-4 w-full">
            <button onClick={()=>submit(q.correct==='even', 'even')} className={`flex-1 py-6 bg-indigo-100 text-indigo-600 rounded-3xl font-black text-xl shadow-sm btn-game ${getStyle('even')}`}>PAR</button>
            <button onClick={()=>submit(q.correct==='odd', 'odd')} className={`flex-1 py-6 bg-purple-100 text-purple-600 rounded-3xl font-black text-xl shadow-sm btn-game ${getStyle('odd')}`}>IMPAR</button>
          </div>
        </div>
      );
  }

  return (
    <div className="flex flex-col items-center gap-10 w-full max-w-xs animate-pop-in">
      <div className="w-48 h-48 bg-white border-[6px] border-blue-100 rounded-[3rem] flex items-center justify-center text-8xl font-black text-slate-700 shadow-sm transform hover:scale-105 transition">{q.val}</div>
      <div className="flex gap-4 w-full">
        <button onClick={()=>submit(q.isNum, 'n')} className={`flex-1 py-6 bg-blue-100 text-blue-600 rounded-3xl font-black text-2xl shadow-sm btn-game ${getStyle('n')}`}>123</button>
        <button onClick={()=>submit(!q.isNum, 'l')} className={`flex-1 py-6 bg-pink-100 text-pink-600 rounded-3xl font-black text-2xl shadow-sm btn-game ${getStyle('l')}`}>ABC</button>
      </div>
    </div>
  );
};

export default KidsLogic;