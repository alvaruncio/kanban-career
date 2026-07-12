## Context

El tablero kanban actual lista candidaturas agrupadas por estado (APPLIED, INTERVIEW, OFFER, HIRED, REJECTED). Las tarjetas se renderizan con componentes puramente presentacionales (KanbanColumn, KanbanCard) sin ninguna capacidad de arrastre. No existe endpoint PATCH para actualizar candidaturas.

## Goals / Non-Goals

**Goals:**
- Implementar drag & drop de tarjetas entre columnas usando dnd-kit v2
- Reordenar tarjetas dentro de la misma columna (solo client-side, sin persistencia)
- Crear endpoint `PATCH /api/v1/applications/:id` para cambiar estado
- Feedback visual durante el arrastre (DragOverlay)
- Soportar drop en columnas vacias

**Non-Goals:**
- Reordenar columnas (no se contempla)
- Reorden persistente en backend (el orden intra-columna es solo visual)
- Animaciones adicionales fuera del DragOverlay

## Decisions

### Libreria: dnd-kit v2 (`@dnd-kit/react`)
- v2 unifica `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` en un solo paquete `@dnd-kit/react`
- API moderna: `DragDropProvider`, `useSortable({id, index, group})`, `useDroppable`, `move()` de `@dnd-kit/helpers`
- Pattern "multiple sortable lists" con `group` por columna para arrastre entre listas
- Alternativa descartada: react-beautiful-dnd (no mantenido), dnd-kit v1 legacy (API antigua)

### Columnas vacias: useDroppable con CollisionPriority.Low
- Sin esto, las columnas sin tarjetas no aceptarian drops
- `CollisionPriority.Low` asegura que los items dentro de la columna tengan prioridad al detectar colisiones

### Estado local de items (React state, no Zustand)
- Las cards visibles se organizan en un objeto `{ [status]: string[] }` con los IDs
- Se inicializa desde `filtered` (aplicando filtros de mes/compania/busqueda)
- `move()` de `@dnd-kit/helpers` muta este objeto durante el arrastre
- Los datos reales persisten en `applicationsStore.applications`

### Actualizacion via API solo al cruzar columnas
- `onDragEnd` detecta `source.containerId !== target.containerId`
- Solo entonces llama a `PATCH /applications/:id { status }`
- El reorden dentro de la misma columna no persiste

## Risks / Trade-offs

- [Filtros activos] Si el usuario mueve una card y los filtros cambian, la card podria desaparecer de la vista. Mitigacion: los filtros no se pueden cambiar durante un drag (interaccion mutuamente exclusiva de facto).
- [Rendimiento] dnd-kit v2 usa optimistic updates nativos, no deberia haber lag. Si hay muchas cards, considerar virtualizacion futura.
