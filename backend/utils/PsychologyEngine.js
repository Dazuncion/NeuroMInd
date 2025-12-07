/**
 * MOTOR DE INTERPRETACIÓN COGNITIVA
 * Versión protegida contra datos nulos o vacíos.
 */

const analyzeProfile = (user) => {
    const report = {
        summary: "",
        strengths: [],
        areas_of_support: [],
        neuro_indicators: {} 
    };

    // --- PROTECCIÓN: Valores por defecto ---
    // Si user.stats es undefined, usamos {}
    const stats = user.stats || {};
    // Si levels es undefined, usamos valores base 1
    const levels = stats.levels || { attention: 1, memory: 1, logic: 1, emotions: 1 };
    // Si xp es undefined, usamos ceros
    const xp = stats.xp || { attention: 0, memory: 0, logic: 0, emotions: 0 };
    
    const history = user.performanceHistory || [];

    // --- 1. ANÁLISIS DE ATENCIÓN ---
    const attentionGames = history.filter(h => h.gameId === 'attention' || h.gameId === 'stroop');
    
    if (attentionGames.length > 5) { 
        // Usamos ?. y || 0 para evitar errores matemáticos
        const avgErrors = attentionGames.reduce((acc, cur) => acc + (cur.metrics?.errors || 0), 0) / attentionGames.length;
        const avgTime = attentionGames.reduce((acc, cur) => acc + (cur.metrics?.reactionTime || 0), 0) / attentionGames.length;

        if (avgErrors > 3 && avgTime < 800) {
            report.neuro_indicators.impulsivity = "Alto";
            report.areas_of_support.push("Control de Impulsos: Alta velocidad pero baja precisión.");
        } 
        else if (avgErrors < 1 && avgTime > 1500) {
            report.strengths.push("Meticulosidad: Enfoque reflexivo y de alta calidad.");
        }
    }

    // --- 2. FLEXIBILIDAD COGNITIVA ---
    // Usamos las variables seguras 'levels' y 'xp' definidas arriba
    const logicLevel = levels.logic || 1;
    const logicXP = xp.logic || 0;

    if (logicLevel >= 5) {
        report.strengths.push("Razonamiento Fluido: Gran capacidad deductiva.");
    } else if (logicXP > 200 && logicLevel <= 2) {
        report.areas_of_support.push("Flexibilidad Mental: Dificultad para cambiar de estrategia.");
    }

    // --- 3. RESUMEN GENERAL ---
    const mainStrength = report.strengths.length > 0 ? report.strengths[0].split(':')[0] : 'Constancia y Aprendizaje';
    report.summary = `El perfil muestra un desarrollo orientado hacia ${mainStrength}. Continúa jugando para mejorar la precisión del análisis.`;

    return report;
};

module.exports = { analyzeProfile };