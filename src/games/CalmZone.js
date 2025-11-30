import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

const CalmZone = ({ onExit }) => {
  const [text, setText] = useState("INHALA");
  useEffect(() => { 
    const interval = setInterval(() => { setText(t => t === "INHALA" ? "EXHALA" : "INHALA"); }, 4000); 
    return () => clearInterval(interval); 
  }, []);
  return (
    <div className="flex flex-col items-center justify-center w-full h-full relative">
      <button onClick={onExit} className="absolute top-4 left-4 p-3 bg-white/50 backdrop-blur-sm rounded-full shadow-sm z-50 hover:bg-white transition-colors">
         <ArrowLeft size={24} className="text-teal-700" />
      </button>
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-teal-200 rounded-full blur-xl breathe-circle opacity-30"></div>
        <div className="w-64 h-64 bg-teal-400 rounded-full shadow-2xl breathe-circle flex items-center justify-center z-10 border-4 border-white/20 backdrop-blur-sm">
          <span className="text-white text-3xl font-black tracking-widest drop-shadow-md transition-all duration-1000">{text}</span>
        </div>
      </div>
      <p className="mt-16 text-teal-600 font-bold text-sm uppercase tracking-widest opacity-60">Sigue el ritmo</p>
    </div>
  );
};

export default CalmZone;