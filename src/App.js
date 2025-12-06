import React, { useState, useEffect } from 'react';
import { jsPDF } from "jspdf"; // <--- LIBRERÍA PDF PROFESIONAL
import { Brain, Rocket, Baby, Gamepad2, Volume2, VolumeX, LogOut, Heart, User, Check, AlertCircle, Cloud, WifiOff, Star, Lock } from 'lucide-react'; 

import GlobalStyles from './components/GlobalStyles';
import useAudio from './hooks/useAudio';
import LoginGateway from './components/LoginGateway'; 
import Onboarding from './components/Onboarding';
import Hub from './components/Hub';
import GameWrapper from './components/GameWrapper';
import DevGameWrapper from './components/DevGameWrapper';
import useCloudSync from './hooks/useCloudSync'; 

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'; 

export default function App() {
  const [profile, setProfile] = useState(null);
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('neuromind_player') || "");
  const [view, setView] = useState('gateway'); 
  const [authData, setAuthData] = useState(null); 
  const [activeGame, setActiveGame] = useState(null);
  const [modal, setModal] = useState(null);
  const [devMode, setDevMode] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [toast, setToast] = useState(null);
  
  const { playTone, sfx } = useAudio(audioEnabled);

  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('neuromind_stats');
    return saved ? JSON.parse(saved) : { 
      score: 0, lives: 3, levels: { attention: 1, memory: 1, logic: 1, emotions: 1 }, xp: { attention: 0, memory: 0, logic: 0, emotions: 0 } 
    };
  });

  const { isPremium, isOnline } = useCloudSync(playerName, stats);

  useEffect(() => { localStorage.setItem('neuromind_stats', JSON.stringify(stats)); }, [stats]);
  useEffect(() => { if(playerName) localStorage.setItem('neuromind_player', playerName); }, [playerName]);

  // Limpieza de bots antiguos del ranking
  useEffect(() => {
    const saved = localStorage.getItem('neuromind_lb');
    if (saved) {
        let parsed = JSON.parse(saved);
        const bots = ['ProBot', 'Ana', 'Leo'];
        const cleanLb = parsed.filter(entry => !bots.includes(entry.n));
        setLeaderboard(cleanLb);
    } else {
        setLeaderboard([]); 
    }
  }, []);

  const handleCloudLogin = async (googleUser) => {
    setAuthData(googleUser);
    setPlayerName(googleUser.name);
    localStorage.setItem('auth_data', JSON.stringify(googleUser));

    try {
        const response = await fetch(`${API_URL}/api/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                authId: googleUser.uid, email: googleUser.email, nickname: googleUser.name, stats: stats, performanceHistory: [] 
            })
        });
        const data = await response.json();
        localStorage.setItem('is_premium', data.isPremium ? 'true' : 'false');
    } catch (e) { console.error("Error Login", e); }
    setView('onboarding');
  };

  const handleOfflineMode = () => {
    setAuthData(null);
    localStorage.removeItem('auth_data');
    setPlayerName("");
    setView('onboarding');
  };

  const showToast = (msg, type) => { setToast({ msg, type }); setTimeout(() => setToast(null), 2500); };
  
  const saveScore = (score) => {
    const nameToSave = playerName || "Jugador";
    const existingIndex = leaderboard.findIndex(p => p.n === nameToSave);
    let newLb = [...leaderboard];
    if (existingIndex >= 0) {
        if (score > newLb[existingIndex].s) newLb[existingIndex].s = score;
    } else { newLb.push({ n: nameToSave, s: score }); }
    newLb = newLb.sort((a,b) => b.s - a.s).slice(0, 10);
    setLeaderboard(newLb);
    localStorage.setItem('neuromind_lb', JSON.stringify(newLb));
  };

  const startGame = (gameId) => { sfx('pop'); setStats(s => ({...s, lives: profile==='kids'?5:3})); setActiveGame(gameId); setDevMode(null); setView('game'); };
  const startDevGame = (gameId, diff) => { sfx('pop'); setDevMode({gameId, difficulty: diff}); setActiveGame(null); setView('devGame'); };
  const startExp = () => { sfx('pop'); setActiveGame('experimental'); setDevMode(null); setView('game'); };

  const handleProgress = (gameId, amount, isWin, metrics = {}) => {
    const sessionData = {
        gameId: gameId, date: new Date(), score: amount,
        metrics: { reactionTime: metrics.avgTime || 0, errors: metrics.errorCount || 0, omissions: metrics.omissions || 0, levelPlayed: stats.levels[gameId] || 1 }
    };
    const currentQueue = JSON.parse(localStorage.getItem('neuromind_pending_history') || '[]');
    currentQueue.push(sessionData);
    localStorage.setItem('neuromind_pending_history', JSON.stringify(currentQueue));

    if (gameId === 'experimental') { 
        if(!isWin) { saveScore(stats.score + amount); setView('hub'); setActiveGame(null); } 
        return; 
    }
    if (isWin) {
      sfx('win');
      const newTotalScore = stats.score + amount;
      saveScore(newTotalScore);
      setStats(prev => {
        const totalXP = (prev.xp[gameId]||0) + amount;
        const threshold = profile === 'kids' ? 50 : 80;
        if (totalXP >= threshold) {
          setModal({ type: 'levelup', level: prev.levels[gameId] + 1 });
          return { ...prev, score: newTotalScore, levels: { ...prev.levels, [gameId]: prev.levels[gameId] + 1 }, xp: { ...prev.xp, [gameId]: totalXP - threshold } };
        }
        return { ...prev, score: newTotalScore, xp: { ...prev.xp, [gameId]: totalXP } };
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

  const handleDownloadReport = async () => {
    const storedAuth = JSON.parse(localStorage.getItem('auth_data') || '{}');
    if (!storedAuth.uid) return showToast("Error de autenticación", "error");

    try {
      showToast("Analizando datos...", "success"); 
      const response = await fetch(`${API_URL}/api/report/${storedAuth.uid}`);
      
      // --- INTERCEPTAR BLOQUEO PREMIUM (403) ---
      if (response.status === 403) {
          const data = await response.json();
          // Abrimos el modal con la "Muestra Gratuita"
          setModal({ type: 'premium_locked', previewData: data.preview }); 
          return;
      }

      if (!response.ok) throw new Error("Error obteniendo datos");
      
      const data = await response.json();
      
      // --- GENERACIÓN PDF (jsPDF) ---
      const doc = new jsPDF();
      
      doc.setFontSize(22); doc.setTextColor(79, 70, 229); doc.text("NeuroMint Reporte Científico", 20, 20);
      doc.setFontSize(12); doc.setTextColor(100);
      doc.text(`Jugador: ${data.stats.nickname || playerName}`, 20, 35);
      doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 42);
      doc.text(`ID Institucional: ${data.stats.schoolId || 'N/A'}`, 20, 49);
      doc.setLineWidth(0.5); doc.line(20, 55, 190, 55);

      doc.setFontSize(14); doc.setTextColor(0); doc.text("Resumen Ejecutivo", 20, 65);
      doc.setFontSize(10); doc.setTextColor(60);
      const summaryLines = doc.splitTextToSize(data.analysis.summary, 170);
      doc.text(summaryLines, 20, 72);
      
      let cursorY = 72 + (summaryLines.length * 5) + 10;

      doc.setFontSize(14); doc.setTextColor(0); doc.text("Fortalezas Cognitivas", 20, cursorY);
      cursorY += 7;
      doc.setFontSize(10); doc.setTextColor(34, 197, 94);
      data.analysis.strengths.forEach(s => { doc.text(`• ${s}`, 20, cursorY); cursorY += 6; });

      cursorY += 5; doc.setFontSize(14); doc.setTextColor(0); doc.text("Áreas de Oportunidad", 20, cursorY);
      cursorY += 7; doc.setFontSize(10); doc.setTextColor(239, 68, 68);
      if (data.analysis.areas_of_support.length === 0) {
           doc.text("No se detectaron alertas críticas.", 20, cursorY);
      } else {
           data.analysis.areas_of_support.forEach(s => {
              const lines = doc.splitTextToSize(`• ${s}`, 170);
              doc.text(lines, 20, cursorY);
              cursorY += (lines.length * 5) + 2;
           });
      }

      doc.save(`NeuroMint_Reporte_${playerName}.pdf`);
      showToast("¡Reporte PDF Descargado!", "success");

    } catch (e) {
      console.error(e);
      showToast("Error al generar", "error");
    }
  };

  const renderHeader = () => (
    <header className={`flex items-center justify-between px-4 z-50 shrink-0 border-b pt-safe pb-3 ${profile === 'kids' ? 'bg-[#FFF7ED] border-orange-100' : 'bg-white/70 backdrop-blur-md'}`}>
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setView('hub'); setActiveGame(null); setDevMode(null); }}>
        <div className={`p-2 rounded-xl shadow-sm ${profile === 'kids' ? 'bg-orange-400' : 'bg-indigo-600'} text-white`}><Brain size={20} /></div>
        <span className={`font-bold text-lg ${profile === 'kids' ? 'hidden' : 'block font-tech'}`}>NeuroMint</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 mr-2">
          {isOnline ? ( <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100"><Cloud size={12} /> EN LÍNEA</span> ) 
                    : ( <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full border border-slate-200"><WifiOff size={12} /> OFFLINE</span> )}
          {isPremium && ( <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-100 animate-pulse"><Star size={12} fill="currentColor" /> PREMIUM</span> )}
        </div>
        <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border shadow-sm">
          <User size={14} className="text-slate-400"/>
          <span className="text-xs font-bold text-slate-600 truncate max-w-[80px]">{playerName || 'Invitado'}</span>
        </div>
        {profile === 'kids' ? ( <div className="flex gap-0.5 bg-white px-2 py-1 rounded-full border border-red-100 shadow-sm text-red-500">{[...Array(5)].map((_, i) => <Heart key={i} size={16} className={`transition-all ${i < stats.lives ? "fill-current scale-100" : "text-red-200 fill-none scale-90"}`} />)}</div> ) 
                            : ( <div className="flex items-center gap-1 bg-white px-2 py-1.5 rounded-xl border border-indigo-100 shadow-sm">{[...Array(3)].map((_, i) => <Heart key={i} size={18} className={`transition-all ${i < stats.lives ? "text-cyan-500 fill-cyan-500" : "text-slate-200 fill-none"}`} />)}</div> )}
        <button onClick={() => setAudioEnabled(!audioEnabled)} className="p-2 rounded-full hover:bg-black/5">{audioEnabled ? <Volume2 size={20} className="opacity-60" /> : <VolumeX size={20} className="opacity-40" />}</button>
        <button onClick={() => { setView('gateway'); setProfile(null); }} className="p-2 rounded-full hover:bg-black/5 text-slate-400" title="Salir / Cambiar Modo"><LogOut size={20} /></button>
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
        {view === 'gateway' && <LoginGateway onLogin={handleCloudLogin} onOffline={handleOfflineMode} />}
        {view === 'onboarding' && <Onboarding initialName={playerName} onSelect={(p, n) => { sfx('pop'); setProfile(p); setPlayerName(n); setStats(s => ({...s, lives: p==='kids'?5:3})); setView('hub'); }} />}
        
        {view === 'hub' && (
            <Hub 
                profile={profile} stats={stats} onPlay={startGame} onPlayDev={startDevGame} onPlayExp={startExp} lb={leaderboard} 
                isOnline={isOnline} isPremium={isPremium} onReport={handleDownloadReport}
            />
        )}
        
        {view === 'game' && activeGame && <GameWrapper gameId={activeGame} profile={profile} level={stats.levels[activeGame]||1} onExit={()=>{setView('hub'); setActiveGame(null);}} onProgress={handleProgress} sfx={sfx} playTone={playTone}/>}
        {view === 'devGame' && devMode && <DevGameWrapper gameId={devMode.gameId} difficulty={devMode.difficulty} profile={profile} onExit={()=>{setView('hub'); setDevMode(null);}} sfx={sfx} />}
      </main>
      
      {view === 'hub' && <ProfessionalSignature />}
      {toast && <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-[100] w-full max-w-sm px-4 animate-pop-in"><div className={`px-6 py-4 rounded-2xl shadow-2xl font-bold text-sm flex items-center justify-center gap-3 text-white ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`}>{toast.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />} {toast.msg}</div></div>}
      
      {/* --- MODAL (LevelUp / GameOver / Premium) --- */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-slide-up">
          <div className="bg-white w-full max-w-sm p-8 rounded-[2rem] text-center shadow-2xl relative overflow-hidden">
            <div className="text-5xl mb-4 animate-bounce">
                {modal.type === 'levelup' ? '🏆' : modal.type === 'premium_locked' ? '🔒' : '💀'}
            </div>
            <h2 className="text-2xl font-black mb-2 text-slate-800">
                {modal.type === 'levelup' ? `¡Nivel ${modal.level}!` : modal.type === 'premium_locked' ? 'Análisis Completado' : 'Juego Terminado'}
            </h2>
            
            {/* MUESTRA GRATUITA EN EL MODAL */}
            {modal.type === 'premium_locked' && modal.previewData && (
                <div className="mb-6 text-left bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-inner">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black px-2 py-0.5 rounded-full">MUESTRA GRATUITA</span>
                    </div>
                    <p className="text-sm text-slate-600 italic mb-3">"{modal.previewData.summary}..."</p>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold"><Check size={12}/> {modal.previewData.strengths_count} Fortalezas ocultas</div>
                        <div className="flex items-center gap-2 text-xs text-rose-500 font-bold"><AlertCircle size={12}/> {modal.previewData.areas_count} Áreas de mejora detectadas</div>
                    </div>
                </div>
            )}
            
            {modal.type === 'premium_locked' ? (
                <div className="flex flex-col gap-3">
                    <button 
                        onClick={() => { 
                            // REDIRECCIÓN SEGURA A PAGOS
                            window.location.href = 'https://www.paypal.com/paypalme/TU_USUARIO_AQUI'; 
                        }} 
                        className="w-full py-4 text-white font-bold rounded-xl shadow-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transform active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        Desbloquear Reporte Completo
                    </button>
                    <button onClick={() => setModal(null)} className="text-slate-400 font-bold text-sm hover:text-slate-600">Cerrar</button>
                </div>
            ) : (
                <button 
                    onClick={() => { setModal(null); if (modal.type === 'gameover') { setStats(s => ({...s, lives: profile==='kids'?5:3})); setView('hub'); setActiveGame(null); setDevMode(null); } }} 
                    className="w-full py-4 text-white font-bold rounded-xl shadow-lg mt-6 bg-indigo-600"
                >
                    Continuar
                </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}