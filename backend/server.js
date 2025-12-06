require('dotenv').config(); // Importante: Variables de entorno
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const { analyzeProfile } = require('./utils/PsychologyEngine');

const app = express();
app.use(express.json());
app.use(cors());

// Conexión a Base de Datos (Segura)
// Usa process.env.MONGO_URI si está disponible, si no, usa localhost
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/neuromind_db')
  .then(() => console.log('🟢 Base de Datos Conectada'))
  .catch(err => console.error('🔴 Error de DB:', err));

// --- RUTAS ---

// 1. SINCRONIZACIÓN (Login/Sync)
app.post('/api/sync', async (req, res) => {
  const { authId, email, nickname, stats, performanceHistory, schoolId } = req.body;
  try {
    if (!authId && !email) return res.status(400).json({msg: "Identificación requerida"});

    let user = await User.findOne({ $or: [{ authId }, { email }] });

    if (!user) {
      user = new User({ authId, email, nickname, stats, schoolId, performanceHistory });
    } else {
      // Merge inteligente de stats
      user.stats.score = Math.max(user.stats.score, stats.score || 0);
      ['attention', 'memory', 'logic', 'emotions'].forEach(skill => {
          user.stats.levels[skill] = Math.max(user.stats.levels[skill] || 1, stats.levels[skill] || 1);
          user.stats.xp[skill] = Math.max(user.stats.xp[skill] || 0, stats.xp[skill] || 0);
      });
      
      // Merge de historial sin duplicados
      if(performanceHistory?.length > 0) {
         const existingIds = new Set(user.performanceHistory.map(h => h.gameId + new Date(h.date).getTime()));
         const newUnique = performanceHistory.filter(h => !existingIds.has(h.gameId + new Date(h.date).getTime()));
         user.performanceHistory.push(...newUnique);
      }
      if(schoolId) user.schoolId = schoolId;
    }
    
    user.lastSync = new Date();
    await user.save();
    res.json({ status: 'synced', isPremium: user.isPremium });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// 2. REPORTE CIENTÍFICO (CON MUESTRA GRATUITA)
app.get('/api/report/:authId', async (req, res) => {
  try {
    const user = await User.findOne({ authId: req.params.authId });
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

    // Generamos el análisis SIEMPRE (para tener datos de muestra)
    const scientificAnalysis = analyzeProfile(user);
    
    // Si NO es Premium, enviamos error 403 pero CON la muestra (preview)
    if (!user.isPremium) {
        return res.status(403).json({ 
            msg: "Reporte Completo Bloqueado",
            preview: {
                summary: scientificAnalysis.summary, // El resumen real del usuario
                strengths_count: scientificAnalysis.strengths.length,
                areas_count: scientificAnalysis.areas_of_support.length
            }
        });
    }

    // Si ES Premium, enviamos todo el reporte
    res.json({ stats: user.stats, analysis: scientificAnalysis });

  } catch (error) {
    res.status(500).json(error);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor NeuroMint corriendo en puerto ${PORT}`));