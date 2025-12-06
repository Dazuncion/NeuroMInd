/**
 * MOTOR DE INTERPRETACIÓN COGNITIVA
 * Basado en paradigmas de Funciones Ejecutivas (Miyake et al., 2000).
 */

const analyzeProfile = (user) => {
    const report = {
        summary: "",
        strengths: [],
        areas_of_support: [],
        neuro_indicators: {} // Indicadores de alerta temprana
    };

    const { levels } = user.stats;
    const history = user.performanceHistory || [];

    // --- 1. ANÁLISIS DE ATENCIÓN Y CONTROL INHIBITORIO ---
    // Filtramos juegos de atención (Stroop, Whack-a-mole, etc.)
    const attentionGames = history.filter(h => h.gameId === 'attention' || h.gameId === 'stroop');
    
    if (attentionGames.length > 5) { // Necesitamos mínimo 5 partidas para opinar
        // Calculamos promedios
        const avgErrors = attentionGames.reduce((acc, cur) => acc + (cur.metrics.errors || 0), 0) / attentionGames.length;
        const avgTime = attentionGames.reduce((acc, cur) => acc + (cur.metrics.reactionTime || 0), 0) / attentionGames.length;

        // LÓGICA: Rápido pero con muchos errores = Impulsividad
        if (avgErrors > 3 && avgTime < 800) {
            report.neuro_indicators.impulsivity = "Alto";
            report.areas_of_support.push("Control de Impulsos: Responde con velocidad pero sacrifica precisión. Sugiere un estilo de procesamiento impulsivo.");
        } 
        // LÓGICA: Lento y preciso = Estilo reflexivo o Lentitud de Procesamiento
        else if (avgErrors < 1 && avgTime > 1500) {
            report.strengths.push("Precisión y Detalle: Muestra un enfoque cauteloso y de alta calidad.");
        }
    }

    // --- 2. FLEXIBILIDAD COGNITIVA ---
    // Basado en nivel alcanzado en Lógica
    if (levels.logic >= 5) {
        report.strengths.push("Razonamiento Fluido: Gran capacidad para deducir patrones nuevos.");
    } else if (user.stats.xp.logic > 200 && levels.logic <= 2) {
        // Juega mucho (XP alta) pero no sube de nivel = Rigidez
        report.areas_of_support.push("Flexibilidad Mental: Dificultad para cambiar de estrategia cuando la actual falla.");
    }

    // --- 3. RESUMEN GENERAL ---
    report.summary = `El perfil muestra un desempeño destacado en ${report.strengths.length > 0 ? report.strengths[0].split(':')[0] : 'persistencia'}.`;

    return report;
};

module.exports = { analyzeProfile };