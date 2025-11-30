import { useRef, useCallback } from 'react';

const useAudio = (enabled) => {
  const audioCtx = useRef(null);
  const masterGain = useRef(null);
  
  const initAudio = useCallback(() => {
    if (!enabled) return;
    if (!audioCtx.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      audioCtx.current = new Ctx();
      masterGain.current = audioCtx.current.createGain();
      masterGain.current.gain.value = 0.3; 
      masterGain.current.connect(audioCtx.current.destination);
    }
    if (audioCtx.current.state === 'suspended') { audioCtx.current.resume().catch(e => console.error(e)); }
  }, [enabled]);

  const playTone = useCallback((freq, type = 'sine', dur = 0.2) => {
    if (!enabled) return;
    initAudio(); 
    try {
      const osc = audioCtx.current.createOscillator();
      const g = audioCtx.current.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.current.currentTime);
      g.gain.setValueAtTime(0, audioCtx.current.currentTime);
      g.gain.linearRampToValueAtTime(1, audioCtx.current.currentTime + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.current.currentTime + dur);
      osc.connect(g);
      g.connect(masterGain.current);
      osc.start(audioCtx.current.currentTime);
      osc.stop(audioCtx.current.currentTime + dur + 0.1);
      setTimeout(() => { osc.disconnect(); g.disconnect(); }, (dur * 1000) + 200);
    } catch (e) { console.error("Audio Error:", e); }
  }, [enabled, initAudio]);

  const sfx = useCallback((type) => {
    if (!enabled) return;
    switch (type) {
      case 'pop': playTone(400, 'triangle', 0.1); break;
      case 'win': setTimeout(() => playTone(523, 'sine', 0.1), 0); setTimeout(() => playTone(659, 'sine', 0.1), 100); setTimeout(() => playTone(784, 'square', 0.2), 200); break;
      case 'lose': playTone(150, 'sawtooth', 0.2); setTimeout(() => playTone(100, 'sawtooth', 0.3), 150); break;
      case 'click': playTone(800, 'sine', 0.05); break;
      case 'coin': playTone(1200, 'sine', 0.1); break;
      case 'switch': playTone(600, 'triangle', 0.05); break;
      default: break;
    }
  }, [playTone, enabled]);
  return { playTone, sfx };
};

export default useAudio;