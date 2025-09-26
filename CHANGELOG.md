# Changelog

Todos los cambios importantes del proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [No Publicado]

## [1.2.1] - 2025-09-25

### Corregido

- Ordenes de publicación: Cambios en la validación de reglas de negocio para modificar una OP en caso de vendedores y supervisores. #T78

## [1.2.0] - 2025-09-24

### Añadido

- Clientes: Creacion de metodo para sincronizar clientes xubio comtur contra websami. #T76

## [1.1.4] - 2025-09-22

### Corregido

- Facturacion: al facturar ediciones, si hay solo una moneda, no la elige automaticamente en el combo. #T73

## [1.1.3] - 2025-09-22

### Corregido

- Al crear un cliente con el rol vendedor no permite seleccion provincia. #T75

## [1.1.2] - 2025-09-22

### Corregido

- Validar que solo los admin tengan acceso al modulo de Facturación. #T71

## [1.1.1] - 2025-09-19

### Corregido

- Error de validación "XubioProductCode field is required" al facturar contratos con un solo producto #T69
- Error de validación al facturar órdenes sin código de producto Xubio asignado
- Corrreción del mensaje de sin contrato y sin ordenes previo a la carga de la moneda en caso que que no haya datos
- Mejora en el manejo de errores en sagas de facturación para mostrar mensajes específicos

## [1.1.0] - 2025-09-12

### Añadido

- Nuevo módulo de facturación completo
- Inicio de creacion de test end to end con Playwright

### Cambiado

## [1.0.0] - [Fecha inicial]

### Añadido

- Versión inicial del sistema Ladevi
