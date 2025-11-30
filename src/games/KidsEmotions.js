import React, { useState } from 'react';
import useGameLogic from '../hooks/useGameLogic';

const KidsEmotions = ({ level, onComplete }) => {
  const [q] = useState(() => {
    const list = [{ id: 'happy', l: 'Feliz', e: '😄' }, { id: 'sad', l: 'Triste', e: '😢' }, { id: 'angry', l: 'Enojado', e: '😡' }, { id: 'surprised', l: 'Sorpresa', e: '😲' }, { id: 'tired', l:'Cansado', e:'😴'}, { id: 'sick', l:'Enfermo', e:'🤢'}];
    const tgt = list[Math.floor(Math.random()*list.length)];
    let numOpts = 2;
    if (level >= 3) numOpts = 4;
    if (level >= 6) numOpts = 6;
    const others = list.filter(x => x.id !== tgt.id).sort(() => Math.random() - 0.5).slice(0, numOpts - 1);
    const opts = [tgt, ...others].sort(() => Math.random() - 0.5);
    return { tgt, opts, numOpts };
  });

  const { submit, getStyle } = useGameLogic(onComplete);
  return (
    <div className="text-center w-full max-w-md animate-pop-in">
      <div className="text-9xl drop-shadow-2xl animate-bounce block mb-8 filter hover:brightness-110 transition cursor-default">{q.tgt.e}</div>
      <div className={`grid ${q.numOpts > 4 ? 'grid-cols-3' : 'grid-cols-2'} gap-3`}>
        {q.opts.map(o => (
          <button key={o.id} onClick={() => submit(o.id === q.tgt.id, o.id)} className={`btn-game p-3 bg-white flex flex-col items-center gap-1 rounded-[1.5rem] ${getStyle(o.id)}`}>
            <span className="text-sm font-black text-orange-900">{o.l}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default KidsEmotions;