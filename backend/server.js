require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Importamos el modelo correcto y el motor psicológico
const User = require('./models/User'); 
const { analyzeProfile } = require('./utils/PsychologyEngine'); // Asegúrate de tener este archivo

const app = express();

app.use(cors());
app.use(express.json());

// --- 1. CONEXIÓN A MONGO DB ---
const mongoUri = process.env.MONGO_URI; 
if (!mongoUri) console.error("FATAL: No existe la variable MONGO_URI en .env");

mongoose.connect(mongoUri || 'mongodb://localhost:27017/neuromind_db')
  .then(() => console.log('🟢 Base de Datos Conectada'))
  .catch(err => console.error('🔴 Error conectando a DB:', err));

// --- 2. RUTAS ---

app.get('/', (req, res) => res.send('Servidor NeuroMind Funcionando 🚀'));

// RUTA 1: SINCRONIZACIÓN (Corregida para Google Auth)
app.post('/api/sync', async (req, res) => {
  // Ahora recibimos authId en lugar de username
  const { authId, email, nickname, stats, performanceHistory, schoolId } = req.body;
  
  console.log(`📡 Sincronizando datos de: ${nickname} (${authId})`);

  try {
    if (!authId) return res.status(400).json({ msg: "Falta el AuthID" });

    // Buscamos por authId (ID único de Google)
    let user = await User.findOne({ authId });

    if (!user) {
      console.log("✨ Usuario nuevo. Creando...");
      user = new User({ authId, email, nickname, stats, schoolId, performanceHistory });
    } else {
      console.log("🔄 Actualizando usuario...");
      
      // Actualizamos stats (mezclando con los existentes)
      if (stats) {
          user.stats = { ...user.stats, ...stats };
      }
      
      // Actualizamos Historial (evitando duplicados)
      if(performanceHistory && performanceHistory.length > 0) {
         const currentHistory = user.performanceHistory || [];
         // Creamos un Set de claves únicas para no repetir partidas
         const existingIds = new Set(currentHistory.map(h => h.gameId + new Date(h.date).getTime()));
         
         const newUnique = performanceHistory.filter(h => {
             const id = h.gameId + new Date(h.date).getTime();
             return !existingIds.has(id);
         });
         
         if (newUnique.length > 0) {
             user.performanceHistory.push(...newUnique);
         }
      }
      if(schoolId) user.schoolId = schoolId;
    }
    
    user.lastSync = new Date();
    await user.save();
    
    res.json({ status: 'synced' });
    
  } catch (error) {
    console.error("🔴 Error en Sync:", error);
    res.status(500).json({ error: error.message });
  }
});

// RUTA 2: REPORTE CIENTÍFICO (¡ESTA ES LA QUE FALTABA!)
app.get('/api/report/:authId', async (req, res) => {
  console.log(`📝 Generando reporte para: ${req.params.authId}`);
  
  try {
    const user = await User.findOne({ authId: req.params.authId });
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

    // Usamos el motor psicológico para analizar
    const scientificAnalysis = analyzeProfile(user);
    
    // Enviamos respuesta al Frontend
    res.json({ stats: user.stats, analysis: scientificAnalysis });

  } catch (error) {
    console.error("🔴 Error generando reporte:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor escuchando en puerto ${PORT}`));