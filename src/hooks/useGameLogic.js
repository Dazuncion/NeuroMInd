import { useState } from 'react';

const useGameLogic = (onComplete) => {
    const [status, setStatus] = useState(null); 
    const [selectedId, setSelectedId] = useState(null);
    const [locked, setLocked] = useState(false);
    
    const submit = (isCorrect, id) => {
      if (locked) return;
      setLocked(true); setSelectedId(id);
      if (isCorrect) { setStatus('correct'); onComplete(true); } 
      else { setStatus('wrong'); onComplete(false); }
    };
    
    const getStyle = (id) => {
      if (selectedId !== id && locked) return "opacity-40"; 
      if (selectedId !== id) return "";
      return status === 'correct' ? 'btn-correct' : 'btn-wrong';
    };
    
    return { submit, getStyle, isLocked: locked };
};

export default useGameLogic;