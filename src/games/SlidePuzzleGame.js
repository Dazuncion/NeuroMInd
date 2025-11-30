import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Hash } from 'lucide-react';

// IMPORTANT: Adjusted paths to ../../assets/puzzle/
import imgBarbie from '../assets/puzzle/barbie.jpg';
import imgBluey from '../assets/puzzle/bluey.jpg';
import imgMario from '../assets/puzzle/mario.jpg';
import imgPlin from '../assets/puzzle/plin plin.jpg';
import imgPocoyo from '../assets/puzzle/pocoyo.jpg';
import imgRosalinda from '../assets/puzzle/rosalinda.jpg';
import imgVolcan from '../assets/puzzle/volcan.jpg';

const SlidePuzzleGame = ({ difficulty, sfx, onExit, onNext, profile }) => {
  const IMAGES_KIDS = [
    {id:'k1', u: imgPocoyo, n:"Pocoyo"}, {id:'k2', u: imgBluey, n:"Bluey"}, {id:'k3', u: imgPlin, n:"Plin Plin"}, {id:'k4', u: imgBarbie, n:"Barbie"}
  ];
  const IMAGES_JUNIORS = [
    {id:'j1', u: imgMario, n:"Mario"}, {id:'j2', u: imgVolcan, n:"Volcán"}, {id:'j3', u: imgRosalinda, n:"Rosalinda"}, {id:'j4', u: imgBluey, n:"Bluey Expert"} 
  ];
  
  const [img, setImg] = useState(null);
  const [tiles, setTiles] = useState([]);
  const [won, setWon] = useState(false);
  const [showNumbers, setShowNumbers] = useState(false); 
  
  const getSize = () => {
    if (profile === 'kids') return 3;
    if (difficulty === 'easy') return 3;
    if (difficulty === 'legend') return 5;
    return 4;
  };
  const size = getSize();
  
  const [imageList, setImageList] = useState([]);

  useEffect(() => {
     const baseList = profile === 'kids' ? IMAGES_KIDS : IMAGES_JUNIORS;
     setImageList([...baseList].sort(() => Math.random() - 0.5));
  }, [profile]);

  useEffect(() => {
    if(!img) return;
    const totalTiles = size * size;
    let currentTiles = Array.from({length: totalTiles}, (_, i) => i);
    let emptyIdx = totalTiles - 1; 

    const shuffleSteps = size === 3 ? 100 : 300;
    
    for(let i=0; i<shuffleSteps; i++) {
        const validMoves = [];
        const row = Math.floor(emptyIdx / size);
        const col = emptyIdx % size;

        if (row > 0) validMoves.push(emptyIdx - size); 
        if (row < size - 1) validMoves.push(emptyIdx + size); 
        if (col > 0) validMoves.push(emptyIdx - 1); 
        if (col < size - 1) validMoves.push(emptyIdx + 1); 

        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        
        [currentTiles[emptyIdx], currentTiles[randomMove]] = [currentTiles[randomMove], currentTiles[emptyIdx]];
        emptyIdx = randomMove;
    }

    setTiles(currentTiles);
    setWon(false);
  }, [img, size]);

  const move = (idx) => {
    if(won) return;
    const empty = tiles.indexOf(size*size-1);
    const row = Math.floor(idx / size);
    const col = idx % size;
    const emptyRow = Math.floor(empty / size);
    const emptyCol = empty % size;
    const isAdj = (Math.abs(row - emptyRow) + Math.abs(col - emptyCol)) === 1;
    if(isAdj) {
        sfx('click'); 
        const n = [...tiles]; 
        [n[idx], n[empty]] = [n[empty], n[idx]]; 
        setTiles(n);
        if(n.every((v,i)=>v===(i===size*size-1?size*size-1:i))) { sfx('win'); setWon(true); }
    }
  };

  if (!img) return (
    <div className="flex flex-col items-center justify-center h-full w-full p-6 animate-slide-up">
        <div className="flex justify-between w-full items-center mb-4"><button onClick={onExit}><ArrowLeft className="text-slate-400"/></button><h3 className="text-2xl font-black text-slate-700">Elige imagen</h3><div className="w-6"></div></div>
        <div className="grid grid-cols-2 gap-6 w-full max-w-md overflow-y-auto pb-10">
            {imageList.map(i => (
                <button key={i.id} onClick={() => setImg(i.u)} className="relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition border-4 border-white active:scale-95 group">
                    <img src={i.u} alt={i.n} className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white py-2 font-bold text-sm text-center backdrop-blur-sm group-hover:bg-indigo-600/80 transition-colors">{i.n}</div>
                </button>
            ))}
        </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 relative">
        <button onClick={() => setImg(null)} className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-sm z-10"><ArrowLeft size={20}/></button>
        {won && <div className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center animate-pop-in p-6 text-center rounded-3xl"><Trophy size={64} className="text-yellow-400 mb-4 animate-bounce"/><h2 className="text-4xl font-black text-white mb-6">¡COMPLETADO!</h2><div className="flex gap-4 w-full max-w-xs"><button onClick={onExit} className="flex-1 bg-white text-slate-900 px-6 py-4 rounded-xl font-bold">Salir</button><button onClick={() => setImg(null)} className="flex-1 bg-indigo-500 text-white px-6 py-4 rounded-xl font-bold">Otra</button></div></div>}
        <div className="mb-6 p-2 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4 pr-6">
             <img src={img} className="w-16 h-16 object-cover rounded-xl opacity-80" alt="guia" />
             <div className="flex-1"><p className="font-bold text-slate-700 text-sm">Objetivo</p><p className="text-xs text-slate-400 font-bold">{size}x{size} - Ordena las piezas</p></div>
             <button onClick={() => setShowNumbers(!showNumbers)} className={`p-2 rounded-lg ${showNumbers ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}><Hash size={20}/></button>
        </div>
        <div className="grid gap-1 bg-slate-800 p-2 rounded-2xl shadow-2xl w-full max-w-[500px] aspect-square border-4 border-slate-800" style={{gridTemplateColumns:`repeat(${size}, 1fr)`}}>
            {tiles.map((num, i) => {
                const x = (num % size) * (100 / (size - 1));
                const y = (Math.floor(num / size)) * (100 / (size - 1));
                return (
                    <button key={i} onClick={()=>move(i)} disabled={num===size*size-1} className={`relative rounded-lg overflow-hidden transition-transform duration-100 ${num===size*size-1 ? 'bg-slate-700/50 -z-10' : 'shadow-inner active:scale-[0.98]'}`}>
                        {num !== size*size-1 && (
                            <>
                                <div style={{ width:'100%', height:'100%', backgroundImage:`url(${img})`, backgroundSize:`${size*100}%`, backgroundPosition:`${x}% ${y}%`, backgroundRepeat: 'no-repeat' }}/>
                                {showNumbers && <span className="absolute top-1 left-1 bg-black/50 text-white text-[10px] px-1 rounded">{num + 1}</span>}
                            </>
                        )}
                    </button>
                )
            })}
        </div>
    </div>
  );
};

export default SlidePuzzleGame;