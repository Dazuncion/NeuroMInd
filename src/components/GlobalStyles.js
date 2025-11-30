import React from 'react';

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700;800&family=Orbitron:wght@600&display=swap');
    :root { --safe-top: max(env(safe-area-inset-top), 24px); --safe-bottom: max(env(safe-area-inset-bottom), 20px); }
    body { background-color: #F8FAFC; overflow: hidden; touch-action: none; -webkit-tap-highlight-color: transparent; font-family: 'Nunito', sans-serif; margin: 0; overscroll-behavior: none; }
    button { cursor: pointer; border: none; outline: none; -webkit-tap-highlight-color: transparent; user-select: none; }
    .font-fredoka { font-family: 'Fredoka', sans-serif; }
    .font-nunito { font-family: 'Nunito', sans-serif; }
    .font-tech { font-family: 'Orbitron', sans-serif; letter-spacing: 1px; }
    .theme-kids { background-color: #FFF7ED; color: #431407; font-family: 'Fredoka', sans-serif; }
    .theme-juniors { background: linear-gradient(135deg, #f3f4f6 0%, #e0e7ff 100%); color: #1e1b4b; font-family: 'Nunito', sans-serif; }
    .btn-game { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); position: relative; overflow: hidden; }
    .btn-game:active { transform: scale(0.95); }
    .theme-kids .btn-game { background: white; border: 3px solid #FED7AA; border-radius: 1.5rem; box-shadow: 0 4px 0 #FDBA74; }
    .theme-kids .btn-game:active { transform: translateY(4px); box-shadow: 0 0 0 #FDBA74; }
    .theme-juniors .btn-game { background: white; border: 1px solid #818cf8; border-radius: 1rem; box-shadow: 0 4px 15px -3px rgba(99, 102, 241, 0.2); }
    .theme-juniors .btn-game:active { transform: scale(0.96); background: #EEF2FF; }
    .btn-correct { background-color: #dcfce7 !important; border-color: #22c55e !important; color: #15803d !important; transform: scale(1.02) !important; box-shadow: 0 0 20px rgba(34, 197, 94, 0.3) !important; }
    .btn-wrong { background-color: #fee2e2 !important; border-color: #ef4444 !important; color: #b91c1c !important; animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
    .animate-pop-in { animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
    .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); }
    .animate-float { animation: float 3s ease-in-out infinite; }
    @keyframes popIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
    @keyframes shake { 10%, 90% { transform: translateX(-2px); } 20%, 80% { transform: translateX(3px); } 30%, 50%, 70% { transform: translateX(-5px); } 40%, 60% { transform: translateX(5px); } }
    .breathe-circle { animation: breatheAnim 8s infinite ease-in-out; }
    @keyframes breatheAnim { 0% { transform: scale(1); } 45% { transform: scale(1.6); } 55% { transform: scale(1.6); } 100% { transform: scale(1); } }
    .simon-lit { filter: brightness(1.8) saturate(1.5) !important; box-shadow: 0 0 30px currentColor; transform: scale(0.95); z-index: 10; border-color: white !important; }
    .cell-sudoku { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; cursor: pointer; user-select: none; }
    .glass-btn { background: rgba(255, 255, 255, 0.25); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.18); }
    .pt-safe { padding-top: var(--safe-top); }
    .pb-safe { padding-bottom: var(--safe-bottom); }
    
    .author-signature {
      background: linear-gradient(90deg, #6366f1, #a855f7, #ec4899);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 800;
      letter-spacing: 0.1em;
    }
  `}</style>
);

export default GlobalStyles;