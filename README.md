# Career Flow

> **Jira para tu búsqueda de empleo.**  
> Un SaaS que transforma el caos de candidaturas en un flujo de trabajo estructurado tipo CRM/Kanban.

Deja atrás Excel, Notion o listas dispersas. Career Flow centraliza todo el proceso de buscar trabajo: ofertas, empresas, entrevistas y métricas, en un solo lugar.

---

## ¿Qué problema resuelve?

Buscar trabajo es un proceso desorganizado. Múltiples pestañas, correos perdidos, estados que no recuerdas. Career Flow convierte cada candidatura en una tarjeta dentro de un tablero Kanban, dándote visibilidad y control sobre cada etapa del proceso.

---

## Stack

```
backend/   Express 5 + Prisma + PostgreSQL   (CommonJS)
frontend/  Vite 8 + React 19 + TypeScript 6  (ESM)
```

---

## Funcionalidades

- **Kanban de candidaturas** — organiza tus ofertas en columnas: Applied, Interview, Offer, Rejected
- **Detalle de candidatura** — historial completo de eventos (entrevistas, pruebas técnicas, notas)
- **Gestión de empresas** — cada empresa con su propio contexto, contacto y seguimiento
- **Métricas** — entrevistas conseguidas, tasa de conversión, tiempo por etapa
- **Modo offline (próximamente)** — consulta tu progreso sin conexión

---

## Primeros pasos

### Requisitos

- [Node.js](https://nodejs.org/) 22+
- [Docker](https://www.docker.com/) (para PostgreSQL)
- [npm](https://www.npmjs.com/)

### Instalación

```bash
# 1. Clona el repositorio
git clone https://github.com/alvaruncio/career-flow.git
cd career-flow

# 2. Instala dependencias del backend
cd backend
npm install
npx prisma generate

# 3. Instala dependencias del frontend
cd ../frontend
npm install

# 4. Levanta la base de datos con Docker
cd ..
docker compose up -d

# 5. Inicia el backend (desde backend/)
npx nodemon server.js

# 6. Inicia el frontend (desde frontend/)
npm run dev
```

La aplicación estará disponible en `http://localhost:5173` (frontend) y `http://localhost:3000` (API).

---

## Desarrollo

Cada paquete tiene su propia configuración y scripts. Revisa `AGENTS.md` para ver la lista completa de comandos y convenciones del proyecto.

---

## Licencia

MIT
