import { useState, useEffect } from 'react';

// Cambia esto por la IP de tu servidor real cuando despliegues
const API_URL = 'https://neuromind-api.onrender.com'; 

export default function useCloudSync(playerName, stats) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isPremium, setIsPremium] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // 1. Detectar si hay internet
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

  // 2. Función para Sincronizar (Subir datos)
  const syncNow = async () => {
    if (!isOnline || !playerName) return;

    try {
      const response = await fetch(`${API_URL}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: playerName,
          stats: stats,
          schoolId: localStorage.getItem('school_id') || null
        })
      });
      
      const data = await response.json();
      if (data.isPremium) {
        setIsPremium(true);
        localStorage.setItem('is_premium', 'true');
      }
      setUnsavedChanges(false);
      console.log("☁️ Sincronizado con éxito");
    } catch (error) {
      console.error("⚠️ Error sincronizando (se guardará local)", error);
    }
  };


  useEffect(() => {
    setUnsavedChanges(true);
    const timer = setTimeout(() => {
      if (isOnline) syncNow();
    }, 5000); // Espera 5 segundos de inactividad antes de subir
    return () => clearTimeout(timer);
  }, [stats, playerName, isOnline]);

  return { isPremium, syncNow, isOnline };
}