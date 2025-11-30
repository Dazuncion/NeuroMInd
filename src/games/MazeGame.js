import React, { useState, useEffect } from 'react';
import { Baby, Home, ArrowLeft } from 'lucide-react';

const MazeGame = ({ difficulty, onExit, onNext, sfx }) => {
  const [grid, setGrid] = useState([]);
  const [player, setPlayer] = useState({x:0, y:0});
  const [end, setEnd] = useState({x:0, y:0});
  const [won, setWon] = useState(false); 
  
  const getSize = () => {
      switch(difficulty) {
          case 'easy': return 8;
          case 'medium': return 12;
          case 'advanced': return 16;
          case 'expert': return 20;
          case 'legend': return 24;
          default: return 12;
      }
  };
  const size = getSize();

  useEffect(() => {
    const newGrid = Array(size).fill().map(() => Array(size).fill(1)); 
    newGrid[1][1] = 0;
    const generate = (x, y) => {
      newGrid[y][x] = 0;
      const dirs = [[0,2], [2,0], [0,-2], [-2,0]].sort(() => Math.random() - 0.5);
      for (let [dx, dy] of dirs) {
        const nx = x + dx, ny = y + dy;
        if (nx > 0 && nx < size-1 && ny > 0 && ny < size-1 && newGrid[ny][nx] === 1) {
          newGrid[y + dy/2][x + dx/2] = 0; 
          generate(nx, ny);
        }
      }
    };
    generate(1, 1);
    let endX = size - 2;
    let endY = size - 2;
    while (newGrid[endY][endX] === 1) {
        if (endX > 1) { endX--; } 
        else { endX = size - 2; if (endY > 1) endY--; }
    }
    setGrid(newGrid); setPlayer({x:1, y:1}); setEnd({x: endX, y: endY}); 
  }, [difficulty, size]);

  const move = (dx, dy) => {
    if (won) return;
    const nx = player.x + dx, ny = player.y + dy;
    if (grid[ny] && grid[ny][nx] === 0) {
      setPlayer({x: nx, y: ny});
      if (nx === end.x && ny === end.y) { setWon(true); sfx('win'); }
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-full relative p-4 w-full">
      {won && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm animate-pop-in p-6 text-center">
          <h2 className="text-3xl font-black text-white uppercase tracking-widest text-center">¡Llegaste a Casa!</h2>
          <div className="flex gap-4 w-full max-w-xs mt-8">
              <button onClick={onExit} className="flex-1 py-4 bg-slate-700 text-white rounded-xl font-bold">Salir</button>
              <button onClick={onNext} className="flex-1 py-4 bg-emerald-500 text-white rounded-xl font-bold">Siguiente</button>
            </div>
        </div>
      )}
      <div className="relative bg-emerald-800 p-3 rounded-2xl shadow-xl overflow-hidden border-4 border-emerald-900" style={{ width: '90vw', height: '90vw', maxWidth: '350px', maxHeight: '350px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${size}, 1fr)`, height: '100%' }}>
          {grid.map((row, y) => row.map((cell, x) => (
            <div key={`${x}-${y}`} className={`flex items-center justify-center ${cell === 1 ? 'bg-emerald-900/50' : 'bg-emerald-100/10'}`}>
              {cell === 1 && <div className="w-full h-full bg-emerald-900 rounded-sm scale-110" />}
              {player.x === x && player.y === y && <Baby className="text-yellow-300 drop-shadow-md animate-bounce" size={16} strokeWidth={3} />}
              {end.x === x && end.y === y && <Home className="text-white drop-shadow-md" size={16} fill="white" />}
            </div>
          )))}
        </div>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-2">
        <div /><button onClick={() => move(0, -1)} className="p-4 bg-white rounded-xl shadow-[0_4px_0_#cbd5e1] active:translate-y-1 active:shadow-none border border-slate-200"><ArrowLeft className="rotate-90 text-slate-600" /></button><div />
        <button onClick={() => move(-1, 0)} className="p-4 bg-white rounded-xl shadow-[0_4px_0_#cbd5e1] active:translate-y-1 active:shadow-none border border-slate-200"><ArrowLeft className="text-slate-600" /></button>
        <button onClick={() => move(0, 1)} className="p-4 bg-white rounded-xl shadow-[0_4px_0_#cbd5e1] active:translate-y-1 active:shadow-none border border-slate-200"><ArrowLeft className="-rotate-90 text-slate-600" /></button>
        <button onClick={() => move(1, 0)} className="p-4 bg-white rounded-xl shadow-[0_4px_0_#cbd5e1] active:translate-y-1 active:shadow-none border border-slate-200"><ArrowLeft className="rotate-180 text-slate-600" /></button>
      </div>
    </div>
  );
};

export default MazeGame;