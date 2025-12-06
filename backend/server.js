const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const { analyzeProfile } = require('./utils/PsychologyEngine'); // <--- Importamos el motor

const app = express();
app.use(express.json());
app.use(cors()); 

mongoose.connect('mongodb://localhost:27017/neuromind_db')
  .then(() => console.log('🟢 Base de Datos Conectada'))
  .catch(err => console.error('🔴 Error de DB:', err));

// --- RUTAS DE LA API ---

// 1. SINCRONIZACIÓN HÍBRIDA (Offline -> Online)
app.post('/api/sync', async (req, res) => {
  // Ahora recibimos authId (Google) y performanceHistory
  const { authId, email, nickname, stats, performanceHistory, schoolId } = req.body;

  try {
    // Buscamos usuario por ID de Google (authId) O por Email
    // Nota: Si es un usuario nuevo anónimo, no tendrá authId aún, se manejará en el frontend
    if (!authId && !email) return res.status(400).json({msg: "Se requiere identificación para sincronizar nube"});

    let user = await User.findOne({ $or: [{ authId }, { email }] });

    if (!user) {
      // CREAR: Primer sync de este usuario en la nube
      user = new User({ authId, email, nickname, stats, schoolId, performanceHistory });
    } else {
      // ACTUALIZAR (MERGE): 
      // Si el celular tiene más puntaje que la nube, actualizamos la nube
      if (stats.score > user.stats.score) {
         user.stats = stats;
      }
      // Siempre añadimos el historial nuevo de partidas
      if(performanceHistory && performanceHistory.length > 0) {
         // (En una app real, aquí filtrarías para no duplicar partidas por ID)
         user.performanceHistory.push(...performanceHistory);
      }
      // Actualizamos escuela si cambió
      if(schoolId) user.schoolId = schoolId;
    }
    
    user.lastSync = new Date();
    await user.save();
    
    // Devolvemos el estado premium para desbloquear funciones en la App
    res.json({ status: 'synced', isPremium: user.isPremium });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// 2. REPORTE CIENTÍFICO (SOLO PREMIUM)
app.get('/api/report/:authId', async (req, res) => {
  try {
    const user = await User.findOne({ authId: req.params.authId });
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });
    
    // CANDADO DE SEGURIDAD PREMIUM
    if (!user.isPremium) {
        return res.status(403).json({ 
            msg: "Reporte Bloqueado",
            preview: "¡Tienes datos interesantes! Tu velocidad de procesamiento es alta. Hazte Premium para ver el análisis completo."
        });
    }

    // Generar análisis con el motor
    const scientificAnalysis = analyzeProfile(user);
    res.json({ stats: user.stats, analysis: scientificAnalysis });

  } catch (error) {
    res.status(500).json(error);
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Servidor NeuroMind 2.0 corriendo en puerto ${PORT}`));