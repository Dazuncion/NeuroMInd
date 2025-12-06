import React, { useState } from 'react';
import { Eye, Zap, Shapes, Smile, Target, Grid, Calculator, HeartHandshake, Wind, LayoutGrid, Map, Puzzle, Play, Medal, ArrowLeft, FlaskConical, FileText, Lock } from 'lucide-react';

const Hub = ({ profile, stats, onPlay, onPlayDev, onPlayExp, lb, isOnline, isPremium, onReport }) => {
  
  const assets = {
    kids: { attention: {title:"Ojo de Águila", icon:Eye, color:"orange"}, memory:{title:"Eco de Luces", icon:Zap, color:"purple"}, logic:{title:"Clasificador", icon:Shapes, color:"blue"}, emotions:{title:"Caras y Gestos", icon:Smile, color:"pink"} },
    juniors: { attention:{title:"Control Maestro", icon:Target, color:"indigo"}, memory:{title:"Matrix", icon:Grid, color:"cyan"}, logic:{title:"Calculadora", icon:Calculator, color:"emerald"}, emotions:{title:"Radar Emocional", icon:HeartHandshake, color:"rose"} }
  }[profile];
  
  const isKids = profile === 'kids';
  const [showLb, setShowLb] = useState(false);
  const [selectedDevGame, setSelectedDevGame] = useState(null);

  const diffLevels = [
      {id:'easy', l:'Fácil', c:'bg-emerald-100 text-emerald-700'},
      {id:'medium', l:'Medio', c:'bg-blue-100 text-blue-700'},
      {id:'advanced', l:'Avanzado', c:'bg-indigo-100 text-indigo-700'},
      {id:'expert', l:'Experto', c:'bg-purple-100 text-purple-700'},
      {id:'legend', l:'LEYENDA', c:'bg-slate-800 text-amber-400'}
  ];

  if (showLb) return (
    <div className="h-full p-6 bg-slate-50 flex flex-col animate-slide-up pt-safe">
      <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-black text-slate-800">Mejores Jugadores</h2><button onClick={() => setShowLb(false)} className="bg-slate-200 p-2 rounded-full"><ArrowLeft size={20}/></button></div>
      <div className="space-y-3 overflow-y-auto pb-20">
        {lb.map((p, i) => (
          <div key={i} className={`flex items-center justify-between p-4 rounded-xl ${i===0?'bg-yellow-100 border border-yellow-200':i===1?'bg-slate-200':'bg-white border border-slate-100'} shadow-sm`}>
            <div className="flex items-center gap-3"><span className={`font-black text-lg w-6 ${i===0?'text-yellow-600':i===1?'text-slate-500':'text-slate-400'}`}>{i+1}</span><span className="font-bold text-slate-700">{p.n}</span></div>
            <span className="font-tech text-indigo-600 font-bold">{p.s} XP</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col relative">
      <div className="flex-1 overflow-y-auto p-6 pb-24 animate-slide-up flex flex-col">
        <div className="flex justify-between items-end mb-6">
            <h2 className={`text-3xl font-black ${isKids ? 'text-orange-900' : 'text-slate-800 font-tech'}`}>{isKids ? '¡A Jugar!' : 'Centro de Mando'}</h2>
            
            <div className="flex gap-2">
                {/* --- BOTÓN REPORTE (SOLO ONLINE) --- */}
                {isOnline && (
                    <button 
                        onClick={onReport} 
                        className={`font-bold text-xs flex items-center gap-1 px-3 py-1 rounded-full border transition-all active:scale-95 ${isPremium ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-slate-500 bg-slate-100 border-slate-200'}`}
                    >
                        {/* El icono cambia (Candado/Archivo), pero el texto es SIEMPRE "Reporte" */}
                        {isPremium ? <FileText size={14}/> : <Lock size={14}/>} 
                        Reporte
                    </button>
                )}
                <button onClick={() => setShowLb(true)} className="text-indigo-500 font-bold text-xs flex items-center gap-1 bg-indigo-50 px-3 py-1 rounded-full"><Medal size={14}/> Ranking</button>
            </div>
        </div>

        <div className={`grid ${isKids ? 'grid-cols-1' : 'grid-cols-2'} gap-4 mb-8`}>
            {Object.entries(assets).map(([key, data]) => (
                <button key={key} onClick={() => onPlay(key)} className={`p-5 text-left w-full relative overflow-hidden transition active:scale-95 bg-white border-b-4 rounded-2xl shadow-sm ${isKids ? 'border-orange-200' : 'border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-4"><div className={`p-3 rounded-xl bg-${data.color}-50 text-${data.color}-500`}><data.icon size={isKids ? 32 : 24} /></div><span className="text-[10px] font-black bg-slate-100 text-slate-500 rounded-full px-2.5 py-1">NV {stats.levels[key]}</span></div>
                    <h3 className="font-bold text-slate-800">{data.title}</h3>
                </button>
            ))}
        </div>
        <button onClick={() => onPlay('calm')} className={`w-full p-6 mb-10 flex items-center justify-between group active:scale-95 transition ${isKids ? 'bg-teal-50 text-teal-700 border-4 border-teal-100 rounded-[2rem]' : 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-2xl shadow-lg'}`}>
            <div className="flex items-center gap-5"><div className="bg-white/20 p-3 rounded-full"><Wind size={28} /></div><div className="text-left"><h3 className="text-lg font-bold">Zona de Calma</h3><p className="text-xs opacity-80 font-medium">Relájate</p></div></div>
        </button>
        <h2 className="text-xl font-black mb-4 text-slate-800 font-tech uppercase tracking-wide border-t pt-6 border-slate-200">{isKids ? 'Patio de Juegos' : 'Gimnasio Mental'}</h2>
        <div className="grid grid-cols-1 gap-4 pb-10">
            {[{id:'sudoku', t:'Sudoku', i:LayoutGrid, c:'indigo', d:'Lógica Pura'}, {id:'maze', t:'Laberinto', i:Map, c:'emerald', d:'Orientación'}, {id:'slide', t:'Puzzle', i:Puzzle, c:'amber', d:'Secuenciación'}].map((g) => (
                <button key={g.id} onClick={() => setSelectedDevGame(g)} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 active:scale-95">
                    <div className={`p-3 rounded-xl bg-${g.c}-50 text-${g.c}-600`}><g.i size={24} /></div>
                    <div className="text-left flex-1"><h3 className="text-lg font-bold text-slate-800">{g.t}</h3><p className="text-xs text-slate-400 font-bold uppercase">{g.d}</p></div><Play size={16} className="text-slate-300"/>
                </button>
            ))}
        </div>
      </div>
      <button onClick={onPlayExp} className="absolute bottom-6 right-6 w-16 h-16 rounded-full glass-btn shadow-xl flex items-center justify-center text-indigo-600 animate-float active:scale-90 transition-transform z-20 bg-gradient-to-tr from-white to-indigo-100"><FlaskConical size={28} strokeWidth={2.5} /></button>
      
      {selectedDevGame && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-slide-up">
          <div className="bg-white w-full max-w-sm p-6 rounded-3xl shadow-2xl relative max-h-[80vh] overflow-y-auto">
             <h3 className="text-2xl font-black text-slate-800 mb-2">{selectedDevGame.t}</h3>
             <p className="text-slate-500 mb-6 text-sm">Elige la dificultad:</p>
             <div className="grid gap-3">
               {diffLevels.map(d => (
                 <button key={d.id} onClick={() => { setSelectedDevGame(null); onPlayDev(selectedDevGame.id, d.id); }} className={`p-4 rounded-xl font-bold ${d.c}`}>{d.l}</button>
               ))}
             </div>
             <button onClick={() => setSelectedDevGame(null)} className="mt-6 text-slate-400 font-bold text-sm w-full py-3">Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hub;