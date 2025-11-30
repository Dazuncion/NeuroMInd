# 🧠 NeuroMind

> **Plataforma Open Source de Estimulación Cognitiva y Desarrollo de Funciones Ejecutivas.**
> *Diseñada para democratizar el acceso a herramientas neuroeducativas en Latinoamérica.*

![React](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react)
![Capacitor](https://img.shields.io/badge/Capacitor-Android-119EFF.svg?logo=capacitor)
![Status](https://img.shields.io/badge/status-MVP%20Complete-success.svg)
![License](https://img.shields.io/badge/license-GPLv3-blue.svg)

---

## 📋 Sobre el Proyecto

**NeuroMind** no es solo un juego; es una herramienta de **tecnología social**. Nace de la necesidad de proporcionar recursos educativos digitales de alta calidad, gratuitos y accesibles para niños con neurodivergencia (TDAH, TEA, Dislexia) en entornos con recursos limitados.

A diferencia de las aplicaciones comerciales, NeuroMind es:
* 🚫 **100% Libre de Anuncios:** Cero distracciones para garantizar la concentración.
* 📶 **Offline-First:** Funciona perfectamente sin conexión a internet (ideal para zonas rurales).
* 🤝 **Ética:** Sin microtransacciones ni recopilación de datos invasiva.

### 🎯 Objetivo Pedagógico
La aplicación entrena funciones ejecutivas clave mediante gamificación:
1.  **Control Inhibitorio:** Juegos *Neon Jump* y *Stroop*.
2.  **Memoria de Trabajo:** Juegos *Eco de Luces* y *Matrix*.
3.  **Flexibilidad Cognitiva:** *Rompecabezas Deslizante* y *Sudoku*.
4.  **Teoría de la Mente:** Reconocimiento emocional en *Caras y Gestos*.
5.  **Regulación Emocional:** Módulo de *Zona de Calma* (Biofeedback visual).

---

## 🛠️ Stack Tecnológico

Este proyecto demuestra una arquitectura de software moderna, modular y escalable:

* **Frontend:** React.js (Hooks, Functional Components).
* **Estado:** Gestión de estado nativa (`useState`, `useRef`, `useCallback`) optimizada para rendimiento (60 FPS).
* **Móvil:** Capacitor.js (para compilación nativa en Android).
* **Estilos:** CSS-in-JS (Componentes estilizados para consistencia visual).
* **Arquitectura:** Separation of Concerns (Lógica en Hooks personalizados, UI en Componentes).

---

## 📂 Estructura del Proyecto

El código está organizado modularmente para facilitar la escalabilidad:

```text
src/
├── assets/          # Recursos estáticos (Imágenes optimizadas)
├── components/      # UI reutilizable (Header, Wrappers, Menús)
├── games/           # Módulos de juego independientes (Lógica encapsulada)
├── hooks/           # Lógica de negocio extraída (Custom Hooks)
└── App.js           # Orquestador principal de la aplicación


Istalación y Despliegue
Requisitos Previos
Node.js (v16 o superior)

Android Studio (para compilar el APK)

Desarrollo Local

Clonar el repositorio:
git clone https://github.com/Dazuncion/NeuroMInd.git

Instalar dependencias:
cd neuromind
npm install


Ejecutar en modo web:
npm start

Generar APK (Android)

Construir el proyecto de React:
npm run build

Sincronizar con Capacitor:
npx cap sync


Abrir en Android Studio:
npx cap open android

🤝 Contribución
Este es un proyecto educativo de código abierto. ¡Las contribuciones son bienvenidas!

👨‍💻 Autor
Desarrollado con ❤️ por Danny Azuncion Vinces.

"La tecnología debe ser un puente, no una barrera, para la educación inclusiva."