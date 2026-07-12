# 0. Lectura obligatoria de contexto

Antes de iniciar cualquier tarea de implementacion, el agente debe leer y comprender estos archivos para conocer las reglas, prohibiciones, estructura y convenciones del proyecto:

- [x] 0.1 Leer `@AGENTS.md` — reglas globales del monorepo, what NOT to do, skills disponibles y comandos
- [x] 0.2 Leer `@backend/AGENTS.md` — arquitectura backend (capas, barriles, validacion Zod, ESM, naming)
- [x] 0.3 Leer `@frontend/AGENTS.md` — arquitectura frontend (component-per-subfolder, barriles, i18n, React Compiler, lazy loading)

# 1. Backend — PATCH /applications/:id

- [x] 1.1 Notificar al usuario y obtener su autorizacion explicita antes de iniciar este bloque
- [x] 1.2 Crear `updateApplicationSchema` en `backend/src/schemas/application/application.schema.js` (z.object con status opcional y otros campos editables)
- [x] 1.3 Crear `validateUpdateApplication` en `backend/src/validators/application/application.validator.js`
- [x] 1.4 Anadir metodo `update(id, data)` en `backend/src/repositories/application/application.repository.js`
- [x] 1.5 Anadir metodo `update(id, userId, data)` en `backend/src/services/application/application.service.js` con verificacion de pertenencia
- [x] 1.6 Anadir metodo `update(req, res)` en `backend/src/controllers/application/application.controller.js`
- [x] 1.7 Anadir ruta `PATCH /:id` en `backend/src/routes/application/application.routes.js` con `requireAuth` y `validateUpdateApplication`
- [x] 1.8 Re-exportar nuevos modulos en barrels correspondientes
- [x] 1.9 Presentar al usuario un resumen en lenguaje natural de los cambios efectuados y detener la ejecucion para su revision y validacion

# 2. Frontend — Instalar dnd-kit

- [x] 2.1 Notificar al usuario y obtener su autorizacion explicita antes de iniciar este bloque
- [x] 2.2 Instalar `@dnd-kit/react` y `@dnd-kit/helpers` en frontend
- [x] 2.3 Presentar al usuario un resumen en lenguaje natural de los cambios efectuados y detener la ejecucion para su revision y validacion

# 3. Frontend — Crear SortableKanbanCard

- [x] 3.1 Notificar al usuario y obtener su autorizacion explicita antes de iniciar este bloque
- [x] 3.2 Crear `frontend/src/components/SortableKanbanCard/SortableKanbanCard.tsx`
- [x] 3.3 Usar `useSortable({id, index, group})` conectando refs al DOM
- [x] 3.4 Re-exportar en barrel de components
- [x] 3.5 Presentar al usuario un resumen en lenguaje natural de los cambios efectuados y detener la ejecucion para su revision y validacion

# 4. Frontend — Modificar KanbanColumn

- [x] 4.1 Notificar al usuario y obtener su autorizacion explicita antes de iniciar este bloque
- [x] 4.2 Anadir prop `id` a KanbanColumn
- [x] 4.3 Aplicar `useDroppable({id, collisionPriority: CollisionPriority.Low})` para columnas vacias
- [x] 4.4 Presentar al usuario un resumen en lenguaje natural de los cambios efectuados y detener la ejecucion para su revision y validacion


# 5. Frontend — Modificar KanbanPage

- [x] 5.1 Notificar al usuario y obtener su autorizacion explicita antes de iniciar este bloque
- [x] 5.2 Anadir estado local `items: Record<ApplicationStatus, string[]>` para IDs ordenados
- [x] 5.3 Inicializar items desde `filtered` (segun filtros activos)
- [x] 5.4 Envolver columnas con `DragDropProvider`
- [x] 5.5 Implementar `onDragStart`: guardar activeApp para DragOverlay
- [x] 5.6 Implementar `onDragOver`: llamar `move(items, event)` para reorden optimista
- [x] 5.7 Implementar `onDragEnd`: si cambio de columna, llamar `updateApplication(id, { status })` y reorden final
- [x] 5.8 Anadir `DragOverlay` con copia visual de la card activa
- [x] 5.9 Reemplazar KanbanCard directo por SortableKanbanCard dentro de cada columna
- [x] 5.10 Presentar al usuario un resumen en lenguaje natural de los cambios efectuados y detener la ejecucion para su revision y validacion

# 6. Actualizaciones de documentacion

- [x] 6.1 Anadir endpoint `PATCH /api/v1/applications/{id}` en `backend/docs/openapi.yaml` con su schema de request y responses
- [x] 6.2 Anadir `@dnd-kit/react` 0.5 y `@dnd-kit/helpers` 0.5 en la tabla de tecnologias de `AGENTS.md`
- [x] 6.3 Anadir `@dnd-kit/react` 0.5 y `@dnd-kit/helpers` 0.5 en la tabla de tecnologias de `frontend/AGENTS.md`
