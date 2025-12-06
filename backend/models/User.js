const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  schoolId: { type: String, default: null }, // Para agrupar alumnos por escuela
  isPremium: { type: Boolean, default: false }, // Switch para funciones online
  lastSync: { type: Date, default: Date.now },
  
 
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
  }
});

module.exports = mongoose.model('User', UserSchema);