import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import SudokuGame from '../games/SudokuGame';
import MazeGame from '../games/MazeGame';
import SlidePuzzleGame from '../games/SlidePuzzleGame';

const DevGameWrapper = (props) => {
  const [resetKey, setResetKey] = useState(0);
  return (<div className="h-full flex flex-col pt-safe bg-slate-50"><div className="h-16 flex items-center justify-between px-5 bg-white border-b shrink-0"><button onClick={props.onExit} className="flex items-center gap-2 font-bold opacity-60"><ArrowLeft size={18} /> Salir</button><span className="font-bold text-xs uppercase bg-indigo-50 text-indigo-600 px-3 py-1 rounded-md">{props.difficulty}</span></div><div className="flex-1 relative w-full overflow-hidden flex flex-col items-center justify-center">{props.gameId==='sudoku'&&<SudokuGame key={resetKey} {...props} isKids={props.profile==='kids'} onNext={()=>setResetKey(p=>p+1)}/>}{props.gameId==='maze'&&<MazeGame key={resetKey} {...props} onNext={()=>setResetKey(p=>p+1)}/>}{props.gameId==='slide'&&<SlidePuzzleGame key={resetKey} {...props} onNext={()=>setResetKey(p=>p+1)}/>}</div></div>);
};

export default DevGameWrapper;