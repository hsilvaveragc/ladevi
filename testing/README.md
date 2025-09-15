# Testing E2E Framework - Guía de Setup

Esta guía te permitirá configurar y ejecutar tests end-to-end (E2E) en el proyecto Ladevi Ventas Frontend.

## Arquitectura del Sistema de Testing

El sistema de testing E2E está compuesto por:

- **PostgreSQL**: Base de datos aislada con datos básicos precargados
- **API de Testing**: Instancia de la API configurada específicamente para testing
- **Playwright**: Framework de testing E2E para automatizar el navegador
- **Docker**: Containerización del entorno de testing

## Estructura de Archivos

```
ladevi-ventas-front/
├── e2e/                                 # Tests de Playwright
│   ├── auth/
│   │   └── login.spec.js               # Tests de autenticación
│   └── utils/
│       ├── config.js                   # Configuración centralizada
│       └── auth-helper.js              # Helpers reutilizables
├── testing/                            # Entorno Docker para testing
│   ├── docker-compose.test.yml         # Configuración de servicios
│   ├── Dockerfile.postgres             # BD personalizada con datos
│   ├── init-scripts/                   # Scripts SQL de inicialización
│   │   ├── 01-schema.sql               # Esquema de base de datos
│   │   └── 02-basic-data.sql           # Datos básicos (países, etc.)
│   └── init-test-db.sh                 # Script de inicialización de API
├── playwright.config.js                # Configuración de Playwright
└── package.json                        # Scripts npm disponibles
```

## Prerequisitos

### Software necesario:

- **Docker** y **Docker Compose** instalados
- **Node.js** (v18 o superior)
- **npm**

### Verificar instalaciones:

```bash
docker --version
docker-compose --version
node --version
npm --version
```

## Configuración Inicial (Primera vez)

### 1. Instalar dependencias

```bash
npm install
```

### 2. Instalar Playwright

```bash
# Instalar navegadores de Playwright
npx playwright install
```

### 3. Verificar archivos de configuración

Asegurate de que estos archivos existan:

**testing/docker-compose.test.yml**
**testing/Dockerfile.postgres**
**testing/init-scripts/02-basic-data.sql**
**e2e/utils/config.js**

## Scripts Disponibles

El `package.json` incluye estos scripts para testing:

```json
{
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui",
  "test:e2e:headed": "playwright test --headed",
  "test:e2e:debug": "playwright test --debug",
  "test:e2e:setup": "docker-compose -f testing/docker-compose.test.yml up --build -d",
  "test:e2e:teardown": "docker-compose -f testing/docker-compose.test.yml down -v",
  "test:e2e:full": "bash testing/run-tests.sh"
}
```

## Ejecución de Tests

### Flujo completo paso a paso:

#### 1. Levantar entorno de testing

```bash
npm run test:e2e:setup
```

Esto inicia:

- PostgreSQL en puerto 5434 con datos básicos
- API de testing en puerto 5003

#### 2. Levantar frontend (en otro terminal)

```bash
npm start
```

El frontend debe estar corriendo en `localhost:3000`

#### 3. Ejecutar tests

```bash
# Con interfaz gráfica (recomendado)
npm run test:e2e:headed

# Tests normales
npm run test:e2e

# Con UI de Playwright para debugging
npm run test:e2e:ui

# Para debugging detallado
npm run test:e2e:debug
```

#### 4. Limpiar entorno (opcional)

```bash
npm run test:e2e:teardown
```

### Flujo simplificado:

```bash
# IMPORTANTE: Primero levantar el frontend
npm start  # En un terminal separado

# Luego ejecutar el script completo
npm run test:e2e:full
```

**El script `test:e2e:full` hace:**

1. Limpia contenedores anteriores
2. Levanta entorno Docker (PostgreSQL + API)
3. Verifica que todos los servicios estén listos
4. **Requiere que el frontend YA esté corriendo**
5. Ejecuta los tests
6. Limpia automáticamente al finalizar

## Verificación del Entorno

### Verificar que los servicios estén corriendo:

```bash
# Ver estado de contenedores
docker-compose -f testing/docker-compose.test.yml ps

# Verificar API
curl http://localhost:5003/swagger

# Verificar frontend
curl http://localhost:3000
```

### Verificar base de datos:

```bash
# Conectarse a PostgreSQL
docker exec -it testing_test-db_1 psql -U sa -d ladevi_ventas_test

# Verificar datos básicos
SELECT COUNT(*) FROM "Country";
\dt
\q
```

## Características del Entorno de Testing

### Base de datos efímera

- Los datos se recrean en cada ejecución
- Sin volúmenes persistentes
- Scripts SQL se ejecutan automáticamente

### API aislada

- Configuración específica para testing
- Migraciones automáticas
- Endpoints de testing habilitados

### Tests organizados

- Configuración centralizada en `config.js`
- Helpers reutilizables
- Selectores consistentes

## Troubleshooting

### Error: "Connection refused"

- Verificar que el frontend esté en localhost:3000
- Verificar que la API esté en localhost:5003

### Error: "Usuario no existe"

- La base de testing inicia limpia sin usuarios
- Los tests deben crear usuarios de prueba según necesiten

### Error: "Docker containers not starting"

- Verificar que no haya conflictos de puertos
- Limpiar contenedores anteriores: `docker system prune -f`

### Logs útiles:

```bash
# Ver logs de la API
docker-compose -f testing/docker-compose.test.yml logs test-api

# Ver logs de PostgreSQL
docker-compose -f testing/docker-compose.test.yml logs test-db
```

## Agregar Nuevos Tests

### Estructura recomendada:

```javascript
import { test, expect } from "@playwright/test";
import { TEST_CONFIG } from "../utils/config.js";

test.describe("Nombre del módulo", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_CONFIG.baseURL);
  });

  test("descripción del test", async ({ page }) => {
    // Lógica del test usando selectores de TEST_CONFIG
  });
});
```

### Usar configuración centralizada:

- URLs en `TEST_CONFIG.baseURL` y `TEST_CONFIG.apiURL`
- Selectores en `TEST_CONFIG.selectors`
- Credenciales en `TEST_CONFIG.credentials`

## Buenas Prácticas

- Usar `data-testid` en componentes para selectores estables
- Mantener tests independientes entre sí
- Limpiar datos de prueba después de cada test
- Usar helpers reutilizables para acciones comunes
- Documentar casos de prueba complejos

## Puertos Utilizados

- **3000**: Frontend (React)
- **5003**: API de testing
- **5434**: PostgreSQL de testing

Asegurate de que estos puertos estén libres antes de ejecutar los tests.
