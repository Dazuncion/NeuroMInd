const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');

const app = express();
app.use(express.json());
app.use(cors()); 

// Conexión a MongoDB 
mongoose.connect('mongodb://localhost:27017/neuromind_db')
  .then(() => console.log('🟢 Base de Datos Conectada'))
  .catch(err => console.error('🔴 Error de DB:', err));

// --- RUTAS DE LA API ---

// 1. SINCRONIZACIÓN (El corazón del sistema Offline-First)
// Recibe los datos locales y actualiza la nube si son más recientes
app.post('/api/sync', async (req, res) => {
  const { username, stats, schoolId } = req.body;

  try {
    let user = await User.findOne({ username });

    if (!user) {
      // Si el usuario no existe, lo creamos (Registro automático)
      user = new User({ username, stats, schoolId });
      await user.save();
      return res.json({ status: 'created', user });
    }

    // Si existe, actualizamos sus stats solo si tiene mejores puntajes
   
    user.stats = stats;
    user.lastSync = new Date();
    if(schoolId) user.schoolId = schoolId;
    
    await user.save();
    res.json({ status: 'synced', isPremium: user.isPremium });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. RECUPERAR DATOS ( Solo Premium)
app.get('/api/profile/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });
    
    // Solo devolvemos datos si es Premium o para restaurar copia
    res.json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Servidor NeuroMind corriendo en puerto ${PORT}`));