import React, { useState } from 'react';
import { Brain, ArrowLeft } from 'lucide-react';
import CalmZone from '../games/CalmZone';
import ChromaJumpGame from '../games/ChromaJumpGame';
import KidsAttention from '../games/KidsAttention';
import KidsLogic from '../games/KidsLogic';
import KidsEmotions from '../games/KidsEmotions';
import KidsMemory from '../games/KidsMemory';
import JuniorStroop from '../games/JuniorStroop';
import JuniorMath from '../games/JuniorMath';
import JuniorEmotions from '../games/JuniorEmotions';
import JuniorMatrix from '../games/JuniorMatrix';

const GameWrapper = ({ gameId, profile, level, onExit, onProgress, sfx, playTone }) => {
  const [showTutorial, setShowTutorial] = useState(true);
  const [roundKey, setRoundKey] = useState(0); 
  const handleRoundComplete = (isWin) => { onProgress(gameId, 15, isWin); setTimeout(() => setRoundKey(p => p + 1), 1200); };
  
  if(gameId==='calm') return <CalmZone onExit={onExit} />;
  if(gameId==='experimental') return <ChromaJumpGame onExit={onExit} sfx={sfx} onComplete={(w)=>onProgress(gameId,w?100:0,w)}/>;
  
  const Games = { kids: { attention: KidsAttention, logic: KidsLogic, emotions: KidsEmotions, memory: KidsMemory }, juniors: { attention: JuniorStroop, logic: JuniorMath, emotions: JuniorEmotions, memory: JuniorMatrix } };
  const Component = Games[profile][gameId];
  const info = (profile==='kids' ? {attention:{t:"Ojo de Águila", i:"Encuentra"}, memory:{t:"Eco", i:"Repite"}, logic:{t:"Clasificador", i:"Selecciona"}, emotions:{t:"Caras", i:"Adivina"}} : {attention:{t:"Stroop", i:"Color vs Texto"}, memory:{t:"Matrix", i:"Patrones"}, logic:{t:"Calc", i:"Opera"}, emotions:{t:"Empatía", i:"Identifica"}})[gameId];
  
  if(showTutorial) return <div className="absolute inset-0 z-50 bg-white/95 flex flex-col items-center justify-center p-8 text-center animate-pop-in"><Brain size={48} className="text-indigo-600 mb-6 animate-bounce"/><h2 className="text-4xl font-black text-slate-800 mb-4">{info.t}</h2><p className="text-lg text-slate-600 font-bold mb-8">{info.i}</p><button onClick={()=>setShowTutorial(false)} className="w-full max-w-xs py-5 bg-indigo-600 text-white rounded-2xl font-bold text-xl shadow-xl">JUGAR</button></div>;
  return (<div className="h-full pt-safe flex flex-col"><div className="h-16 px-4 flex items-center shrink-0"><button onClick={onExit}><ArrowLeft/></button></div><div className="flex-1 flex flex-col items-center justify-center w-full"><Component key={roundKey} level={level} onComplete={handleRoundComplete} sfx={sfx} playTone={playTone} /></div></div>);
};

export default GameWrapper;