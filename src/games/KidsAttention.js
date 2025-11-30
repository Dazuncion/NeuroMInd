import React, { useState } from 'react';
import { Star, Heart, Trophy, Zap, Smile, Eye, Sun, Moon, Cloud, Umbrella, Music, Camera, Gift, Bell, Crown, Key, Anchor, Map, Lock, Compass, Ghost, Gem } from 'lucide-react';
import useGameLogic from '../hooks/useGameLogic';

const KidsAttention = ({ level, onComplete }) => {
  const [data] = useState(() => {
    let size = 3; if (level >= 3) size = 4; if (level >= 6) size = 5;
    const icons = [Star, Heart, Trophy, Zap, Smile, Eye, Sun, Moon, Cloud, Umbrella, Music, Camera, Gift, Bell, Crown, Key, Anchor, Map, Lock, Compass, Ghost, Gem];
    const tgt = icons[Math.floor(Math.random()*icons.length)];
    const others = icons.filter(i => i !== tgt);
    const grid = Array(size*size - 1).fill(null).map(()=>others[Math.floor(Math.random()*others.length)]);
    grid.splice(Math.floor(Math.random()*grid.length), 0, tgt);
    return { tgt, grid, size };
  });
  const { submit, getStyle } = useGameLogic(onComplete);
  const TargetIcon = data.tgt;
  return (
    <div className="w-full max-w-md flex flex-col items-center animate-pop-in">
      <div className="mb-6 bg-white px-8 py-4 rounded-3xl border-4 border-orange-100 flex flex-col items-center shadow-sm">
        <span className="text-[10px] font-black text-orange-300 mb-2 uppercase tracking-widest">ENCUENTRA</span>
        <TargetIcon size={48} className="text-orange-500 drop-shadow-sm" />
      </div>
      <div className="grid gap-2 w-full p-2" style={{ gridTemplateColumns: `repeat(${data.size}, 1fr)` }}>
        {data.grid.map((Icon, i) => (
          <button key={i} onClick={() => submit(Icon === data.tgt, i)} className={`aspect-square btn-game bg-white rounded-xl flex items-center justify-center shadow-sm ${getStyle(i)}`}>
            <Icon size={data.size === 5 ? 20 : data.size === 4 ? 24 : 32} className="text-slate-400" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default KidsAttention;