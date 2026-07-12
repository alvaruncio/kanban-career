## ADDED Requirements

### Requirement: Actualizar estado de candidatura
El sistema SHALL permitir actualizar el estado de una candidatura existente mediante una peticion PATCH.

#### Scenario: Cambio de estado exitoso
- **WHEN** se envia PATCH /api/v1/applications/:id con `{ "status": "INTERVIEW" }`
- **THEN** el sistema responde 200 con la candidatura actualizada

#### Scenario: Estado invalido
- **WHEN** se envia PATCH /api/v1/applications/:id con un estado no valido
- **THEN** el sistema responde 400 con error de validacion

#### Scenario: Candidatura no encontrada
- **WHEN** se envia PATCH /api/v1/applications/:id con un id inexistente
- **THEN** el sistema responde 404

#### Scenario: Candidatura de otro usuario
- **WHEN** se envia PATCH /api/v1/applications/:id de una candidatura que no pertenece al usuario autenticado
- **THEN** el sistema responde 404 (no revelar existencia)

### Requirement: Arrastrar tarjeta entre columnas
El sistema SHALL permitir mover una tarjeta de una columna a otra mediante drag & drop.

#### Scenario: Mover a columna con tarjetas
- **WHEN** el usuario arrastra una tarjeta de APPLIED a INTERVIEW
- **THEN** la tarjeta aparece en INTERVIEW y el estado se persiste via PATCH

#### Scenario: Mover a columna vacia
- **WHEN** el usuario arrastra una tarjeta a una columna sin tarjetas
- **THEN** la tarjeta se muestra como unica en esa columna

### Requirement: Reordenar dentro de columna
El sistema SHALL permitir reordenar tarjetas dentro de la misma columna sin persistir el orden.

#### Scenario: Reorden local
- **WHEN** el usuario arrastra una tarjeta a una posicion distinta en la misma columna
- **THEN** la tarjeta cambia de posicion visualmente sin llamada a la API
