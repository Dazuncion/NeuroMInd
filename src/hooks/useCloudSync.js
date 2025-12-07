import { useState, useEffect, useCallback } from 'react';

// ✅ URL DE PRODUCCIÓN (RENDER)
const API_URL = 'https://neuromind-api.onrender.com'; 

export default function useCloudSync(playerName, stats) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // 1. Detectar estado de red
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 2. Función Principal: Sincronizar
  // Acepta 'latestStats' opcional para guardar inmediatamente después de jugar
  const syncNow = useCallback(async (latestStats = null) => {
    if (!navigator.onLine) return; 

    const authData = JSON.parse(localStorage.getItem('auth_data') || 'null');
    if (!authData || !authData.uid) return;

    const pendingHistory = JSON.parse(localStorage.getItem('neuromind_pending_history') || '[]');

    try {
      console.log("☁️ Enviando datos a:", API_URL); 
      
      const response = await fetch(`${API_URL}/api/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authId: authData.uid,
          email: authData.email,
          nickname: playerName,
          // Enviamos los stats más recientes si existen, si no, los del estado actual
          stats: latestStats || stats, 
          schoolId: localStorage.getItem('school_id') || null,
          performanceHistory: pendingHistory
        })
      });
      
      if (response.ok) {
        // Limpiamos la cola de partidas enviadas
        const currentQueue = JSON.parse(localStorage.getItem('neuromind_pending_history') || '[]');
        const remainingQueue = currentQueue.slice(pendingHistory.length);
        localStorage.setItem('neuromind_pending_history', JSON.stringify(remainingQueue));

        setUnsavedChanges(false);
        console.log("✅ Sincronización exitosa.");
      } else {
          console.error("❌ Error del servidor:", response.status);
      }
    } catch (error) {
      console.error("⚠️ Error de conexión:", error);
    }
  }, [playerName, stats]); 

  // 3. Restaurar Datos (Backup)
  const restoreFromCloud = async () => {
    const authData = JSON.parse(localStorage.getItem('auth_data') || 'null');
    if (!navigator.onLine || !authData) return null;

    try {
      const response = await fetch(`${API_URL}/api/report/${authData.uid}`); 
      if (response.ok) {
        const data = await response.json();
        if (data.stats) return data.stats; 
      }
    } catch (error) { console.error(error); }
    return null;
  };

  // Trigger automático (Backup cada 10s si hay cambios pendientes)
  useEffect(() => {
    const timer = setInterval(() => {
      const pending = JSON.parse(localStorage.getItem('neuromind_pending_history') || '[]');
      if (navigator.onLine && (pending.length > 0 || unsavedChanges)) {
           syncNow();
      }
    }, 10000); 
    return () => clearInterval(timer);
  }, [syncNow, unsavedChanges]);

  // Marcar cambios sin guardar cuando cambian los stats
  useEffect(() => { setUnsavedChanges(true); }, [stats]);

  return { syncNow, restoreFromCloud, isOnline };
}