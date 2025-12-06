import { useState, useEffect, useCallback } from 'react';

// Ajusta a tu URL real o localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'; 

export default function useCloudSync(playerName, stats) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isPremium, setIsPremium] = useState(false);
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

  // 2. Función Principal: Sincronizar (Subir datos + Historial)
  const syncNow = useCallback(async () => {
    if (!isOnline) return;

    // A. OBTENER IDENTIDAD (Google/Firebase)
    // Suponemos que un componente de Login guardó esto en localStorage
    const authData = JSON.parse(localStorage.getItem('auth_data') || 'null');
    
    // Si no hay login (es un usuario anónimo offline), no sincronizamos con la nube
    if (!authData || !authData.uid) {
        console.log("ℹ️ Jugador anónimo (Local): No se sincroniza con la nube.");
        return;
    }

    // B. OBTENER HISTORIAL PENDIENTE (Cola de partidas offline)
    // App.js debe ir guardando aquí cada vez que termina un juego
    const pendingHistory = JSON.parse(localStorage.getItem('neuromind_pending_history') || '[]');

    try {
      const response = await fetch(`${API_URL}/api/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authId: authData.uid,      // ID Seguro de Google
          email: authData.email,
          nickname: playerName,
          stats: stats,              // Puntajes acumulados
          schoolId: localStorage.getItem('school_id') || null,
          performanceHistory: pendingHistory // <--- EL DATO CIENTÍFICO CLAVE
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // 1. Actualizar estado Premium
        if (data.isPremium) {
            setIsPremium(true);
            localStorage.setItem('is_premium', 'true');
        }

        // 2. Limpiar la cola de historial (ya se subió exitosamente)
        localStorage.setItem('neuromind_pending_history', '[]');
        setUnsavedChanges(false);
        console.log(`☁️ Sincronizado: ${pendingHistory.length} partidas subidas.`);
      }
    } catch (error) {
      console.error("⚠️ Error subiendo datos:", error);
    }
  }, [isOnline, playerName, stats]);

  // 3. Restaurar Datos (Al iniciar sesión en dispositivo nuevo)
  const restoreFromCloud = async () => {
    const authData = JSON.parse(localStorage.getItem('auth_data') || 'null');
    if (!isOnline || !authData) return null;

    try {
      // Usamos el endpoint de reporte o sync para recuperar (depende de tu server)
      // Aquí simulamos que pedimos el perfil asociado al ID
      const response = await fetch(`${API_URL}/api/report/${authData.uid}`); 
      
      if (response.ok) {
        const data = await response.json();
        if (data.stats) {
            console.log("📥 Datos recuperados de la nube");
            return data.stats; 
        }
      }
    } catch (error) {
      console.error("Error recuperando datos:", error);
    }
    return null;
  };

  // Trigger automático: Intentar subir cada 10s si hay cambios o historial pendiente
  useEffect(() => {
    const checkPending = () => {
       const pending = JSON.parse(localStorage.getItem('neuromind_pending_history') || '[]');
       if (pending.length > 0 || unsavedChanges) {
           syncNow();
       }
    };

    const timer = setInterval(() => {
      if (isOnline) checkPending();
    }, 10000); // Revisar cada 10 segundos

    return () => clearInterval(timer);
  }, [isOnline, syncNow, unsavedChanges]);

  // Trigger manual al cambiar stats
  useEffect(() => {
      setUnsavedChanges(true);
  }, [stats]);

  return { isPremium, syncNow, restoreFromCloud, isOnline };
}