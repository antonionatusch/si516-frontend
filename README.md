# SaludConecta Frontend

## Facultad de Ingeniería  
**Proyecto Final**  
Materia: Sistemas Inteligentes e Innovación (SI516)  
Docente: Ing. Carlos Wilfredo Egüez Terrazas  

---

## Introducción

Este repositorio contiene la interfaz web de **SaludConecta**, un sistema inteligente orientado a optimizar la experiencia hospitalaria y facilitar la gestión de pacientes, doctores, historiales clínicos, recetas y citas médicas. La aplicación fue desarrollada como parte del proyecto final de la materia **SI516 - Sistemas Inteligentes e Innovación**.

---

## Características Técnicas

- **Framework principal:** React + Vite
- **UI & Componentes:** CoreUI React
- **Gestión de estado:** Redux
- **Ruteo:** React Router DOM
- **Consumo de API:** Axios
- **Estilos:** SCSS (con soporte para temas claro/oscuro)
- **Gráficos:** Chart.js y CoreUI ChartJS
- **Compatibilidad:** Adaptado a dispositivos móviles y escritorio

---

## Funcionalidades Actuales

- **Gestión de Pacientes:** Registrar, listar y buscar pacientes.
- **Historial Clínico:** Crear, visualizar y buscar historiales médicos.
- **Gestión de Doctores:** Registrar y listar médicos.
- **Recetas Médicas:** Visualización de recetas.
- **Citas:** Programar y consultar citas médicas.
- **Autenticación:** Registro e inicio de sesión para doctores.
- **Transcripción de Audio:** (Integración visual; requiere backend configurado).

> **Nota:** Debido a restricciones de tiempo, la funcionalidad de chatbot no fue incluida en esta entrega. Sin embargo, la arquitectura del sistema permite su integración en futuras versiones.

---

## Instalación y Configuración

### Requisitos Previos

- **Node.js v18+** y **npm**
- Backend de SaludConecta en ejecución (ver [repositorio backend](https://github.com/antonionatusch/si516-backend/))

### Pasos de Instalación

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/antonionatusch/si516-frontend.git
   cd si516-frontend
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Inicia la aplicación en modo desarrollo:**
   ```bash
   npm run start
   ```
   Por defecto, la aplicación estará disponible en [http://localhost:5173](http://localhost:5173).

---

## Demo en Video



https://github.com/user-attachments/assets/34b2035b-7fb5-41ab-a6ed-37d996d35088



---

## Scripts Disponibles

- `npm run start` — Ejecuta la app en modo desarrollo (`vite`).
- `npm run build` — Compila la app para producción.
- `npm run serve` — Sirve una build de producción localmente.
- `npm run lint` — Analiza el código fuente con ESLint.

---

## Estructura de Archivos Relevantes

- `src/` — Código fuente principal de la aplicación React.
- `src/scss/` — Archivos de estilos SCSS personalizados.
- `vite.config.mjs` — Configuración de Vite y PostCSS (autoprefixer).
- `package.json` — Dependencias y scripts.

---

## Créditos y Agradecimientos

### Equipo de Desarrollo
- Lipsy Dalire Cardona Durán - a2022111834@estudiantes.upsa.edu.bo - [@lileeex](https://github.com/lileeex)
- Carlos Augusto Egüez Bazán - a2022112318@estudiantes.upsa.edu.bo - [@Aeguez233](https://github.com/Aeguez233)
- Camila Letizia Ortiz Vasquez - a2022112491@estudiantes.upsa.edu.bo - [@LetiziaOrtizVasq](https://github.com/LetiziaOrtizVasq)
- Paul Fernando Vino Herrera - a2022211405@estudiantes.upsa.edu.bo - [@paulfer03](https://github.com/paulfer03)
- Antonio Miguel Natusch Zarco - a2022111958@estudiantes.upsa.edu.bo - [@antonionatusch](https://github.com/antonionatusch)

### Agradecimientos Especiales
Un especial agradecimiento a nuestro docente, **Ing. Carlos Wilfredo Egüez Terrazas** (carloseguez@upsa.edu.bo), por su consejo y apoyo durante el desarrollo del proyecto.

---

## Licencia

Este proyecto fue desarrollado con fines académicos y está sujeto a la licencia MIT.
