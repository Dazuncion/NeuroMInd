const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // --- 1. IDENTIDAD HÍBRIDA ---
  // authId: ID único de Google/Firebase. Si no existe, es un usuario offline.
  authId: { type: String, unique: true, sparse: true }, 
  email: { type: String, unique: true, sparse: true }, 
  nickname: { type: String, required: true }, // El nombre visible (ej. "Juan")
  
  // --- 2. DATOS INSTITUCIONALES ---
  schoolId: { type: String, default: null }, // Para agrupar alumnos de una escuela
  isPremium: { type: Boolean, default: false }, // Switch para funciones avanzadas
  lastSync: { type: Date, default: Date.now },

  // --- 3. ESTADÍSTICAS VISIBLES 
  stats: {
    score: { type: Number, default: 0 },
    lives: { type: Number, default: 3 },
    levels: {
      attention: { type: Number, default: 1 },
      memory: { type: Number, default: 1 },
      logic: { type: Number, default: 1 },
      emotions: { type: Number, default: 1 }
    },
    xp: {
      attention: { type: Number, default: 0 },
      memory: { type: Number, default: 0 },
      logic: { type: Number, default: 0 },
      emotions: { type: Number, default: 0 }
    }
  },

  // --- 4. NUEVO: HISTORIAL CIENTÍFICO (Para el Motor Psicológico) ---
  // Aquí guardamos cada partida individual con sus métricas finas.
  performanceHistory: [{
    gameId: String, // ej. 'stroop', 'maze'
    date: { type: Date, default: Date.now },
    metrics: {
      reactionTime: Number, // Promedio en milisegundos (clave para TDAH)
      errors: Number,       // Errores cometidos (clave para Impulsividad)
      omissions: Number,    // Errores por no responder a tiempo (Inatención)
      levelPlayed: Number   // Dificultad en la que jugó
    }
  }]
});

module.exports = mongoose.model('User', UserSchema);