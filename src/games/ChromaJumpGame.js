import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Gamepad2 } from 'lucide-react';

const ChromaJumpGame = ({ onExit, sfx, onComplete }) => {
    const [started, setStarted] = useState(false);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [ballY, setBallY] = useState(0);
    const [ballColor, setBallColor] = useState(0);
    const [floorColor, setFloorColor] = useState(0);
    
    // FRASES MOTIVACIONALES
    const MOTIVATION = [
        "¡Casi lo logras! ¡Inténtalo de nuevo!",
        "El éxito es caerse y levantarse.",
        "¡No te rindas! Eres capaz.",
        "¡Tú puedes hacerlo mejor!",
        "La práctica hace al maestro.",
        "¡Sigue adelante, vas muy bien!",
        "Respira hondo y prueba otra vez."
    ];
    
    const [msg, setMsg] = useState("");
    const floorColorRef = useRef(0);
    const ballRef = useRef({ y: 0, color: 0 });
    const speedRef = useRef(0.5);
    const reqRef = useRef();
    const COLORS = ['#22d3ee', '#e879f9']; 
    const MAX_SPEED = 2.5; 
    
    const ballDivRef = useRef(null);

    useEffect(() => {
        if (!started || gameOver) return;
        ballRef.current = { y: 0, color: Math.random() > 0.5 ? 0 : 1 };
        setBallColor(ballRef.current.color);
        speedRef.current = 0.5;
        setFloorColor(0); floorColorRef.current = 0;
        
        const loop = () => {
            ballRef.current.y += speedRef.current;
            
            if (ballDivRef.current) {
                ballDivRef.current.style.top = `${ballRef.current.y}%`;
            }

            if (ballRef.current.y >= 85) {
                if (ballRef.current.color === floorColorRef.current) {
                    sfx('coin');
                    setScore(s => s + 10);
                    speedRef.current = Math.min(speedRef.current + 0.05, MAX_SPEED);
                    ballRef.current.y = 0;
                    ballRef.current.color = Math.random() > 0.5 ? 0 : 1;
                    setBallColor(ballRef.current.color);
                } else {
                    sfx('lose');
                    const randomMsg = MOTIVATION[Math.floor(Math.random() * MOTIVATION.length)];
                    setMsg(randomMsg);
                    setGameOver(true);
                    onComplete(false);
                    return; 
                }
            }
            reqRef.current = requestAnimationFrame(loop);
        };
        reqRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(reqRef.current);
    }, [started, gameOver, sfx, onComplete]);

    const toggleFloor = (e) => {
        if(e) { e.stopPropagation(); }
        if (!gameOver && started) {
            sfx('switch');
            const newColor = floorColorRef.current === 0 ? 1 : 0;
            floorColorRef.current = newColor;
            setFloorColor(newColor);
        }
    };

    if (!started) return (
        <div className="absolute inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center p-8 text-center animate-pop-in">
             <div className="mb-8 relative"><div className="absolute inset-0 bg-cyan-400 blur-xl opacity-20 rounded-full"></div><Gamepad2 size={64} className="text-cyan-400 relative z-10" /></div>
             <h1 className="text-4xl font-black text-white font-tech mb-2 tracking-widest">NEON JUMP</h1>
             <p className="text-slate-400 mb-10 text-lg">Toca para cambiar el color</p>
             <button onClick={() => setStarted(true)} className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-10 py-4 rounded-full font-black text-xl shadow-[0_0_20px_rgba(34,211,238,0.5)] active:scale-95 transition-transform">EMPEZAR</button>
             <button onClick={onExit} className="mt-8 text-slate-500 font-bold text-sm">Volver</button>
        </div>
    );
    return (
        <div className="absolute inset-0 bg-slate-900 flex flex-col overflow-hidden touch-manipulation cursor-pointer" onPointerDown={toggleFloor}>
            <div className="p-4 pt-safe flex justify-between items-center z-20 pointer-events-none">
                <button onClick={() => onExit()} className="text-white pointer-events-auto opacity-50 hover:opacity-100"><ArrowLeft /></button>
                <span className="font-tech text-2xl text-white drop-shadow-md">Score: {score}</span>
            </div>
            
            <div 
                ref={ballDivRef}
                className="absolute w-12 h-12 rounded-full shadow-[0_0_30px_currentColor] will-change-transform z-10" 
                style={{ 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)', 
                    backgroundColor: COLORS[ballColor], 
                    color: COLORS[ballColor] 
                }} 
            />
            
            <div className="absolute bottom-0 w-full h-[15%] transition-colors duration-150 flex items-center justify-center border-t-4 border-white/10 z-10" style={{ backgroundColor: COLORS[floorColor] }}><p className="text-white/20 font-bold text-sm tracking-[0.5em] uppercase select-none">TOCA AQUI</p></div>
            {gameOver && (
                 <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-50 animate-pop-in cursor-default pointer-events-auto">
                      <div className="text-center p-6 w-full max-w-md">
                          <h2 className="text-5xl font-black text-white mb-4 font-tech text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">GAME OVER</h2>
                          <p className="text-2xl text-yellow-300 mb-8 font-black italic drop-shadow-md animate-pulse">"{msg}"</p>
                          <div className="bg-slate-800 p-4 rounded-2xl mb-8 border border-slate-700"><p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Puntuación Final</p><p className="text-4xl font-black text-white">{score}</p></div>
                          <div className="flex flex-col gap-3">
                              <button onClick={() => { setGameOver(false); setScore(0); setStarted(true); }} className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold hover:scale-105 transition">Intentar de nuevo</button>
                              <button onClick={onExit} className="text-slate-500 px-8 py-3 font-bold hover:text-white">Salir</button>
                          </div>
                      </div>
                 </div>
            )}
        </div>
    );
};

export default ChromaJumpGame;