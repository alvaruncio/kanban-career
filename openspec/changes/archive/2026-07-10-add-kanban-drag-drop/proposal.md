## Why

El tablero kanban actual muestra las candidaturas en columnas por estado, pero el usuario no puede mover las tarjetas entre columnas mediante drag & drop. Esto obliga a editar la candidatura para cambiar su estado, rompiendo el flujo visual e intuitivo que un kanban deberia ofrecer.

Ademas, el backend carece del endpoint necesario para actualizar una candidatura, por lo que cualquier cambio de estado requiere crearlo.

## What Changes

- Anadir drag & drop en el tablero kanban usando `@dnd-kit/react` v2 (multiple sortable lists pattern)
- Crear `PATCH /api/v1/applications/:id` en backend para actualizar el estado de una candidatura
- Las tarjetas pueden reordenarse dentro de la misma columna (solo client-side, sin persistencia)
- Las tarjetas pueden moverse entre columnas (persiste el cambio de estado via API)
- Feedback visual durante el arrastre con DragOverlay
- Las columnas permiten soltar tarjetas aunque esten vacias (useDroppable con collision priority baja)

## Capabilities

### New Capabilities
- `application-update`: Endpoint PATCH para actualizar campos de una candidatura existente

### Modified Capabilities

_(Ninguna — no existen specs previas en openspec/specs/)_

## Impact

- **backend**: Nuevo schema Zod (`updateApplicationSchema`), validator, repository method, service method, controller method, y ruta `PATCH /:id`
- **frontend**: Instalar `@dnd-kit/react` y `@dnd-kit/helpers`. Nuevo componente `SortableKanbanCard`. Modificar `KanbanColumn` (anadir `useDroppable`). Modificar `KanbanPage` (anadir `DragDropProvider`, `DragOverlay`, estado local de items)
- **No breaking**: no se modifican endpoints existentes ni se altera el comportamiento actual
