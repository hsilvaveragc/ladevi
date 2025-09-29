# Changelog

Todos los cambios importantes del proyecto serán documentados en este archivo.

El formato está basado en
[Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/), y este proyecto
adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [No Publicado]

## [1.1.1] - 2025-09-19

### Corregido

- Error de validación "XubioProductCode field is required" al facturar contratos
  con un solo producto
- Error de validación al facturar órdenes sin código de producto Xubio asignado
- Corrreción del mensaje de sin contrato y sin ordenes previo a la carga de la
  moneda en caso que que no haya datos
- Mejora en el manejo de errores en sagas de facturación para mostrar mensajes
  específicos

## [1.1.0] - 2025-09-12

### Añadido

- Nuevo módulo de facturación completo
- Inicio de creacion de test end to end con Playwright

### Cambiado

## [1.0.0] - [Fecha inicial]

### Añadido

- Versión inicial del sistema Ladevi
