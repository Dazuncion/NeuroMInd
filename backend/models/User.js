const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // Identificador de Google (VITAL para tu login)
  authId: { type: String, unique: true, required: true }, 
  email: { type: String, default: "" }, 
  nickname: { type: String, default: "Jugador" },
  
  schoolId: { type: String, default: null },
  lastSync: { type: Date, default: Date.now },

  // Estadísticas acumuladas (Niveles, XP, Vidas)
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

  // Historial científico (SIN ESTO NO HAY REPORTE)
  performanceHistory: [{
    gameId: String,
    date: Date,
    metrics: {
      reactionTime: Number,
      errors: Number,
      omissions: Number,
      levelPlayed: Number
    }
  }]
});

module.exports = mongoose.model('User', UserSchema);