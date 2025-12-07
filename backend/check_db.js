require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

// Conectar
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/neuromind_db')
  .then(() => {
    console.log('🔍 Buscando usuarios en la base de datos...');
    checkUsers();
  })
  .catch(err => console.error('Error conectando:', err));

async function checkUsers() {
  try {
    const users = await User.find({});
    console.log(`\n📊 TOTAL USUARIOS ENCONTRADOS: ${users.length}`);
    
    if (users.length === 0) {
      console.log("⚠️ La base de datos está vacía. No se ha guardado nada aún.");
    }

    users.forEach((u, i) => {
      console.log(`\n--- Usuario #${i + 1} ---`);
      console.log(`👤 Nickname: ${u.nickname}`);
      console.log(`📧 Email/ID: ${u.email || u.authId}`);
      console.log(`🧠 Niveles:`, u.stats ? u.stats.levels : 'SIN STATS');
      console.log(`🎮 Partidas guardadas: ${u.performanceHistory ? u.performanceHistory.length : 0}`);
    });

    console.log("\n✅ Verificación terminada.");
    process.exit();
  } catch (error) {
    console.error("Error leyendo usuarios:", error);
    process.exit(1);
  }
}