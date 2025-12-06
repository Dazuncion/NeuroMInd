import React, { useState, useEffect } from 'react';
import { ArrowLeft, Brain, Rocket, Baby, Gamepad2, Volume2, VolumeX, LogOut, Heart, User, Check, AlertCircle, Cloud, WifiOff, Star } from 'lucide-react'; // <--- CAMBIO: Agregué iconos nuevos (Cloud, WifiOff, Star)

// Imports de Componentes y Hooks
import GlobalStyles from './components/GlobalStyles';
import useAudio from './hooks/useAudio';
import Onboarding from './components/Onboarding';
import Hub from './components/Hub';
import GameWrapper from './components/GameWrapper';
import DevGameWrapper from './components/DevGameWrapper';
import useCloudSync from './hooks/useCloudSync'; // <--- CAMBIO: Importamos el Hook

export default function App() {
  const [profile, setProfile] = useState(null);
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('neuromind_player') || "");
  const [view, setView] = useState('onboarding');
  const [activeGame, setActiveGame] = useState(null);
  const [modal, setModal] = useState(null);
  const [devMode, setDevMode] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [toast, setToast] = useState(null);
  
  const { playTone, sfx } = useAudio(audioEnabled);

  // <--- CAMBIO 1: Inicialización de stats mejorada (Carga lo guardado en el celular)
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('neuromind_stats');
    return saved ? JSON.parse(saved) : { 
      score: 0, 
      lives: 3, 
      levels: { attention: 1, memory: 1, logic: 1, emotions: 1 }, 
      xp: { attention: 0, memory: 0, logic: 0, emotions: 0 } 
    };
  });

  // <--- CAMBIO 2: Hook de Sincronización (Debe ir DESPUÉS de definir 'stats')
  const { isPremium, isOnline } = useCloudSync(playerName, stats);

  // <--- CAMBIO 3: Efecto para guardar en el celular (localStorage) cada vez que 'stats' cambia
  useEffect(() => {
    localStorage.setItem('neuromind_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    if(playerName) localStorage.setItem('neuromind_player', playerName);
  }, [playerName]);

  useEffect(() => {
    const saved = localStorage.getItem('neuromind_lb');
    if (saved) setLeaderboard(JSON.parse(saved));
    else setLeaderboard([{n:'ProBot', s:5000}, {n:'Ana', s:3200}, {n:'Leo', s:1500}]);
  }, []);

  const showToast = (msg, type) => { setToast({ msg, type }); setTimeout(() => setToast(null), 2500); };
  
  const saveScore = (score) => {
    const newEntry = { n: playerName || "Jugador", s: score };
    const newLb = [...leaderboard, newEntry].sort((a,b) => b.s - a.s).slice(0, 10);
    setLeaderboard(newLb);
    localStorage.setItem('neuromind_lb', JSON.stringify(newLb));
  };

  const startGame = (gameId) => { sfx('pop'); setStats(s => ({...s, lives: profile==='kids'?5:3})); setActiveGame(gameId); setDevMode(null); setView('game'); };
  const startDevGame = (gameId, diff) => { sfx('pop'); setDevMode({gameId, difficulty: diff}); setActiveGame(null); setView('devGame'); };
  const startExp = () => { sfx('pop'); setActiveGame('experimental'); setDevMode(null); setView('game'); };

  const handleProgress = (gameId, amount, isWin) => {
    if (gameId === 'experimental') { 
        if(!isWin) { saveScore(amount); setView('hub'); setActiveGame(null); } 
        return; 
    }
    if (isWin) {
      sfx('win');
      setStats(prev => {
        const totalXP = (prev.xp[gameId]||0) + amount;
        const threshold = profile === 'kids' ? 50 : 80;
        if (totalXP >= threshold) {
          setModal({ type: 'levelup', level: prev.levels[gameId] + 1 });
          return { ...prev, score: prev.score + amount, levels: { ...prev.levels, [gameId]: prev.levels[gameId] + 1 }, xp: { ...prev.xp, [gameId]: totalXP - threshold } };
        }
        return { ...prev, score: prev.score + amount, xp: { ...prev.xp, [gameId]: totalXP } };
      });
    } else {
      sfx('lose');
      showToast("¡Intenta de nuevo!", "error");
      setStats(prev => {
        const newLives = prev.lives - 1;
        if (newLives <= 0) { setModal({ type: 'gameover' }); return { ...prev, lives: 0 }; }
        return { ...prev, lives: newLives };
      });
    }
  };

  const renderHeader = () => (
    <header className={`flex items-center justify-between px-4 z-50 shrink-0 border-b pt-safe pb-3 ${profile === 'kids' ? 'bg-[#FFF7ED] border-orange-100' : 'bg-white/70 backdrop-blur-md'}`}>
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setView('hub'); setActiveGame(null); setDevMode(null); }}>
        <div className={`p-2 rounded-xl shadow-sm ${profile === 'kids' ? 'bg-orange-400' : 'bg-indigo-600'} text-white`}><Brain size={20} /></div>
        <span className={`font-bold text-lg ${profile === 'kids' ? 'hidden' : 'block font-tech'}`}>NeuroMind</span>
      </div>
      
      {/* <--- CAMBIO 4: Indicadores visuales de estado (Online/Premium) */}
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 mr-2">
          {isOnline ? (
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
              <Cloud size={12} /> EN LÍNEA
            </span>
          ) : (
             <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full border border-slate-200">
              <WifiOff size={12} /> OFFLINE
            </span>
          )}
          {isPremium && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-100 animate-pulse">
              <Star size={12} fill="currentColor" /> PREMIUM
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border shadow-sm">
          <User size={14} className="text-slate-400"/>
          <span className="text-xs font-bold text-slate-600 truncate max-w-[80px]">{playerName || 'Invitado'}</span>
        </div>
        {profile === 'kids' ? (
          <div className="flex gap-0.5 bg-white px-2 py-1 rounded-full border border-red-100 shadow-sm text-red-500">
            {[...Array(5)].map((_, i) => <Heart key={i} size={16} className={`transition-all ${i < stats.lives ? "fill-current scale-100" : "text-red-200 fill-none scale-90"}`} />)}
          </div>
        ) : (
          <div className="flex items-center gap-1 bg-white px-2 py-1.5 rounded-xl border border-indigo-100 shadow-sm">
             {[...Array(3)].map((_, i) => <Heart key={i} size={18} className={`transition-all ${i < stats.lives ? "text-cyan-500 fill-cyan-500" : "text-slate-200 fill-none"}`} />)}
          </div>
        )}
        <button onClick={() => setAudioEnabled(!audioEnabled)} className="p-2 rounded-full hover:bg-black/5">{audioEnabled ? <Volume2 size={20} className="opacity-60" /> : <VolumeX size={20} className="opacity-40" />}</button>
        <button onClick={() => { setView('onboarding'); setProfile(null); }} className="p-2 rounded-full hover:bg-black/5 text-slate-400" title="Salir / Cambiar Modo">
            <LogOut size={20} />
        </button>
      </div>
    </header>
  );

  const ProfessionalSignature = () => (
      <div className="absolute bottom-2 w-full text-center pb-safe pointer-events-none z-10 opacity-80">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 font-semibold">Developed by</p>
        <p className="text-sm author-signature font-tech">Danny Azuncion Vinces</p>
      </div>
  );

  return (
    <div className={`h-screen w-full flex flex-col overflow-hidden ${profile==='kids'?'theme-kids':'theme-juniors'}`}>
      <GlobalStyles />
      {profile && renderHeader()}
      <main className="flex-1 relative w-full h-full overflow-hidden">
        {view === 'onboarding' && <Onboarding onSelect={(p, n) => { sfx('pop'); setProfile(p); setPlayerName(n); setStats(s => ({...s, lives: p==='kids'?5:3})); setView('hub'); }} />}
        {view === 'hub' && <Hub profile={profile} stats={stats} onPlay={startGame} onPlayDev={startDevGame} onPlayExp={startExp} lb={leaderboard} />}
        {view === 'game' && activeGame && (
          <GameWrapper 
            gameId={activeGame} 
            profile={profile} 
            level={stats.levels[activeGame]||1} 
            onExit={()=>{setView('hub'); setActiveGame(null);}} 
            onProgress={handleProgress} 
            sfx={sfx} 
            playTone={playTone}
          />
        )}
        {view === 'devGame' && devMode && (
          <DevGameWrapper 
            gameId={devMode.gameId} 
            difficulty={devMode.difficulty} 
            profile={profile} 
            onExit={()=>{setView('hub'); setDevMode(null);}} 
            sfx={sfx} 
          />
        )}
      </main>
      {view === 'hub' && <ProfessionalSignature />}
      {toast && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-[100] w-full max-w-sm px-4 animate-pop-in">
          <div className={`px-6 py-4 rounded-2xl shadow-2xl font-bold text-sm flex items-center justify-center gap-3 text-white ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
            {toast.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />} {toast.msg}
          </div>
        </div>
      )}
      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-slide-up">
          <div className="bg-white w-full max-w-xs p-8 rounded-[2rem] text-center shadow-2xl">
            <div className="text-6xl mb-6 animate-bounce">{modal.type === 'levelup' ? '🏆' : '💀'}</div>
            <h2 className="text-3xl font-black mb-2 text-slate-800">{modal.type === 'levelup' ? `¡Nivel ${modal.level}!` : 'Juego Terminado'}</h2>
            <button onClick={() => { setModal(null); if (modal.type === 'gameover') { setStats(s => ({...s, lives: profile==='kids'?5:3})); setView('hub'); setActiveGame(null); setDevMode(null); } }} className="w-full py-4 text-white font-bold rounded-xl shadow-lg mt-6 bg-indigo-600">Continuar</button>
          </div>
        </div>
      )}
    </div>
  );
}