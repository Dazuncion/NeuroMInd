# 🧠 NeuroMind

> **Plataforma de Estimulación Cognitiva Open Source & Offline-First.**
> *Democratizando el acceso a la neuroeducación en Latinoamérica a través de la tecnología.*

![React](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react)
![Capacitor](https://img.shields.io/badge/Mobile-Capacitor-119EFF.svg?logo=capacitor)
![Node](https://img.shields.io/badge/Backend-Node.js-339933.svg?logo=nodedotjs)
![MongoDB](https://img.shields.io/badge/Data-MongoDB-47A248.svg?logo=mongodb)
![License](https://img.shields.io/badge/license-GPLv3-blue.svg)

---

## 📋 Sobre el Proyecto

**NeuroMind** es una herramienta de **tecnología social** diseñada para entrenar funciones ejecutivas en niños con neurodivergencia (TDAH, TEA, Dislexia), especialmente en zonas con conectividad limitada.

Nuestra filosofía es **"Local-First"**:
1.  **📲 Offline por defecto:** La aplicación funciona al 100% sin internet. Los datos viven en el dispositivo del estudiante.
2.  **☁️ Nube Opcional:** Cuando hay conexión, la app se sincroniza automáticamente con nuestro servidor para generar reportes de progreso y copias de seguridad (Funcionalidad Premium/Escuelas).
3.  **🚫 Ética:** Sin anuncios, sin microtransacciones depredadoras y con diseño sensorial amigable.

---

## 🧠 Áreas de Entrenamiento (Gamificación)

La aplicación utiliza mecánicas de juego validadas para estimular áreas cognitivas específicas:

| Área Cognitiva | Juegos Incluidos | Objetivo Pedagógico |

| **Control Inhibitorio** | *Neon Jump*, *Stroop* | Frenar impulsos y mejorar la concentración sostenida. |
| **Memoria de Trabajo** | *Eco de Luces*, *Matrix* | Retener y manipular información a corto plazo. |
| **Flexibilidad Cognitiva** | *Puzzle Deslizante*, *Sudoku* | Adaptarse a nuevas reglas y cambios de patrón. |
| **Teoría de la Mente** | *Caras y Gestos* | Identificación y comprensión de emociones ajenas. |
| **Regulación Emocional** | *Zona de Calma* | Biofeedback visual para reducir la ansiedad. |
| **Lógica Matemática** | *Junior Math* | Razonamiento lógico y cálculo mental ágil. |



## 🛠️ Stack Tecnológico

NeuroMind utiliza una arquitectura híbrida moderna y escalable:

### Frontend (Aplicación)
* **Core:** React 18 (Hooks, Context API).
* **Móvil:** Capacitor.js (Compilación nativa para Android).
* **Estilos:** Tailwind CSS (Diseño responsivo y accesible).
* **Persistencia:** `localStorage` (Para funcionamiento Offline).
* **Iconografía:** Lucide React.

### Backend & Servicios
La lógica de servidor, base de datos y sincronización offline se encuentra en un repositorio separado:
👉 **[Repositorio Backend (API)](https://github.com/Dazuncion/neuromind-api)**

* **API:** Node.js + Express.
* **Base de Datos:** MongoDB Atlas (NoSQL).
* **Sincronización:** Custom Hook `useCloudSync` para gestión de estados de red.
* 
* 🤝 Contribución
¡Las contribuciones son bienvenidas! Este es un proyecto educativo de código abierto. Por favor, lee CONTRIBUTING.md para detalles sobre nuestro código de conducta y el proceso para enviarnos pull requests.

👨‍💻 Autor y Créditos
Desarrollado con ❤️ por Danny Azuncion Vinces.

"La tecnología debe ser un puente, no una barrera, para la educación inclusiva."

## 📂 Estructura del Proyecto

```text
src/
├── assets/          # Recursos estáticos (Imágenes, Sonidos)
├── components/      # UI Reutilizable (Hub, Wrappers, Menús)
├── games/           # Módulos de juego (Lógica encapsulada por juego)
│   ├── KidsMemory.js
│   ├── KidsAttention.js
│   └── ...
├── hooks/           # Lógica de Negocio (Custom Hooks)
│   ├── useAudio.js      # Sistema de sonido centralizado
│   └── useCloudSync.js  # Sincronización Local <-> Nube
└── App.js           # Orquestador principal y Router


🚀 Instalación y Despliegue
Requisitos Previos
Node.js (v18 o superior)

Android Studio (Solo para compilar la APK)

1. Desarrollo Local (Frontend)
Bash

# Clonar el repositorio
git clone [https://github.com/Dazuncion/NeuroMInd.git](https://github.com/Dazuncion/NeuroMInd.git)

# Entrar a la carpeta
cd neuromind

# Instalar dependencias
npm install

# Ejecutar en el navegador
npm start
2. Configuración del Backend (Opcional)
Para habilitar las funciones de sincronización en la nube:

Clona y despliega el repositorio del servidor: https://github.com/Dazuncion/neuromind-api

Configura la URL de tu API (ej. Render) en src/hooks/useCloudSync.js.

3. Generar APK (Android)
Bash

# Crear la build de producción de React
npm run build

# Sincronizar con la carpeta nativa de Android
npx cap sync

# Abrir el proyecto en Android Studio
npx cap open android
(Desde Android Studio: Build > Generate Signed Bundle / APK)

