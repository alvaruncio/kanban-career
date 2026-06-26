# KanbanCareer

> **Jira para tu búsqueda de empleo.**  
> Un SaaS que transforma el caos de candidaturas en un flujo de trabajo estructurado tipo CRM/Kanban.

Deja atrás Excel, Notion o listas dispersas. KanbanCareer centraliza todo el proceso de buscar trabajo: ofertas, empresas, entrevistas y métricas, en un solo lugar.

---

## Stack

```
backend/   Express 5 + Prisma + PostgreSQL   (ESM)
frontend/  Vite 8 + React 19 + TypeScript 6  (ESM)
```

---

## Funcionalidades

- **Kanban de candidaturas** — organiza tus ofertas en columnas: Applied, Interview, Offer, Rejected
- **Detalle de candidatura** — historial completo de eventos (entrevistas, pruebas técnicas, notas)
- **Gestión de empresas** — cada empresa con su propio contexto, contacto y seguimiento
- **Métricas** — entrevistas conseguidas, tasa de conversión, tiempo por etapa
  
---

## Primeros pasos

### Requisitos

- [Node.js](https://nodejs.org/) 22+
- [Docker](https://www.docker.com/)
- [npm](https://www.npmjs.com/)

### Instalación

```bash
# 1. Clona el repositorio
git clone git@github.com:alvaruncio/kanban-career.git
cd kanban-career

# 2. Instala dependencias del backend
cd backend && npm install

# 3. Instala dependencias del frontend
cd ../frontend && npm install

# 4. Levanta la base de datos y el backend
cd .. && docker compose up -d

# 5. Ejecuta las migraciones de Prisma
cd backend && npx prisma migrate dev

# 6. Inicia el frontend
cd ../frontend && npm run dev
```

La aplicación estará disponible en `http://localhost:5173` (frontend) y `http://localhost:3000` (API).

> **Nota:** El `docker-compose.yml` incluye PostgreSQL y el backend. Si prefieres ejecutar el backend fuera de Docker, inicia solo PostgreSQL con `docker compose up -d db` y luego `npm run dev` desde `backend/`.

---

## Documentación API

El spec OpenAPI 3.1 está en `backend/docs/openapi.yaml`. Para visualizarlo:

```bash
cd backend
npx @redocly/cli build-docs docs/openapi.yaml
# Abre redoc-static.html en el navegador
```

---

## Desarrollo

Cada paquete tiene su propia configuración y scripts. Los comandos principales:

| Contexto | Comando | Descripción |
|---|---|---|
| `backend/` | `npm run dev` | Servidor Express con --watch (puerto 3000) |
| `backend/` | `npx prisma studio` | GUI de Prisma para explorar la DB |
| `frontend/` | `npm run dev` | Vite dev server |
| `frontend/` | `npm run build` | TypeScript check + build |
| `frontend/` | `npm run lint` | ESLint |

Consulta `AGENTS.md` para la lista completa de comandos, convenciones y skills disponibles.

---

## Licencia

MIT
