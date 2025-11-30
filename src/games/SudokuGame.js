import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, AlertCircle } from 'lucide-react';
import useAudio from '../hooks/useAudio'; // Importante: Asegúrate de importar el hook

const SudokuGame = ({ difficulty, sfx, onExit, onNext, isKids }) => {
    const generateNewBoard = useCallback(() => {
      const base = [5,3,4,6,7,8,9,1,2,6,7,2,1,9,5,3,4,8,1,9,8,3,4,2,5,6,7,8,5,9,7,6,1,4,2,3,4,2,6,8,5,3,7,9,1,7,1,3,9,2,4,8,5,6,9,6,1,5,3,7,2,8,4,2,8,7,4,1,9,6,3,5,3,4,5,2,8,6,1,7,9];
      const nums = [1,2,3,4,5,6,7,8,9].sort(() => Math.random() - 0.5);
      const map = {};
      [1,2,3,4,5,6,7,8,9].forEach((n, i) => map[n] = nums[i]);
      return base.map(n => map[n]);
    }, []);
    const [solution, setSolution] = useState([]);
    const [displayBoard, setDisplayBoard] = useState([]);
    const [initialMask, setInitialMask] = useState([]);
    const [selectedCell, setSelectedCell] = useState(null);
    const [mistakes, setMistakes] = useState(0);
    const [won, setWon] = useState(false);
    const { sfx: safeSfx } = useAudio(true);
    const playSfx = sfx || safeSfx;
    useEffect(() => {
      const fullBoard = generateNewBoard();
      setSolution(fullBoard);
      
      let cluesToRemove;
      if (isKids) cluesToRemove = 15;
      else if (difficulty === 'easy') cluesToRemove = 30;
      else if (difficulty === 'medium') cluesToRemove = 40;
      else if (difficulty === 'advanced') cluesToRemove = 50;
      else if (difficulty === 'expert') cluesToRemove = 58;
      else cluesToRemove = 64; 

      const mask = Array(81).fill(true);
      const indices = Array.from({length: 81}, (_, i) => i).sort(() => Math.random() - 0.5);
      for(let i=0; i<cluesToRemove; i++) mask[indices[i]] = false;
      setInitialMask(mask);
      setDisplayBoard(fullBoard.map((val, i) => mask[i] ? val : null));
      setMistakes(0); setWon(false); setSelectedCell(null);
    }, [difficulty, isKids, generateNewBoard]);

    const handleInput = (num) => {
      if (selectedCell === null || initialMask[selectedCell] || won) return;
      if (num === solution[selectedCell]) {
        playSfx('click');
        const newBoard = [...displayBoard];
        newBoard[selectedCell] = num;
        setDisplayBoard(newBoard);
        if (!newBoard.includes(null)) { playSfx('win'); setWon(true); }
      } else {
        playSfx('lose'); setMistakes(m => m + 1);
      }
    };
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 relative animate-slide-up w-full">
        {won && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md animate-pop-in p-6 text-center">
              <div className="bg-white p-4 rounded-full mb-4 animate-bounce"><Trophy size={48} className="text-yellow-500" /></div>
              <h2 className="text-3xl font-black text-white mb-2 font-tech">¡EXCELENTE!</h2>
              <div className="flex gap-4 w-full max-w-xs mt-6">
                <button onClick={onExit} className="flex-1 py-4 bg-slate-700 text-white rounded-xl font-bold">Salir</button>
                <button onClick={onNext} className="flex-1 py-4 bg-indigo-500 text-white rounded-xl font-bold">Siguiente</button>
              </div>
            </div>
        )}
        <div className="mb-6 flex justify-between items-center w-full max-w-sm px-2">
          <div className="flex flex-col"><span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Nivel</span><span className="font-black text-lg text-slate-700">{difficulty ? difficulty.toUpperCase() : 'ZEN'}</span></div>
          <div className="flex items-center gap-2 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100"><AlertCircle size={16} className="text-rose-500" /><span className="font-bold text-rose-700">{mistakes}</span></div>
        </div>
        <div className={`grid grid-cols-9 gap-px bg-slate-300 border-4 border-slate-800 rounded-xl overflow-hidden shadow-2xl w-full max-w-sm aspect-square mb-8 ${isKids ? 'bg-orange-200 border-orange-900' : ''}`}>
          {displayBoard.map((cell, i) => {
            const isInitial = initialMask[i];
            const isSelected = selectedCell === i;
            return (
              <div key={i} onClick={() => !isInitial && setSelectedCell(i)} className={`cell-sudoku relative text-lg sm:text-xl transition-colors duration-100 ${(i+1)%3===0 && (i+1)%9!==0 ? 'border-r-2 border-r-slate-800' : ''} ${Math.floor(i/9)%3===2 && Math.floor(i/9)!==8 ? 'border-b-2 border-b-slate-800' : ''} ${isSelected ? 'bg-indigo-500 text-white z-10' : ''} ${!isSelected && !isInitial ? 'bg-white cursor-pointer hover:bg-indigo-50' : ''} ${isInitial ? (isKids ? 'bg-orange-50 font-black text-orange-900 cursor-default' : 'bg-slate-200 font-black text-slate-900 cursor-default') : 'text-indigo-600 font-bold'}`}>
                {cell}
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-5 gap-2 w-full max-w-sm">
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <button key={n} onClick={() => handleInput(n)} className="h-12 bg-white rounded-xl shadow-[0_4px_0_#cbd5e1] active:shadow-none active:translate-y-[4px] border border-slate-200 font-black text-xl text-slate-700 transition-all active:bg-slate-100">{n}</button>
          ))}
        </div>
      </div>
    );
};

export default SudokuGame;