#!/bin/bash
set -e

echo "🚀 Iniciando tests E2E completos..."

# Función para limpiar al salir
cleanup() {
  echo "🧹 Limpiando entorno de testing..."
  docker-compose -f testing/docker-compose.test.yml down -v 2>/dev/null || true
}

# Configurar limpieza automática
trap cleanup EXIT

echo "🛠️ Preparando entorno de testing..."

# Limpiar contenedores previos
cleanup

echo "🐳 Levantando servicios Docker..."
docker-compose -f testing/docker-compose.test.yml up --build -d

echo "⏳ Esperando a que los servicios estén listos..."

# Esperar PostgreSQL
echo "🔍 Verificando PostgreSQL..."
until docker-compose -f testing/docker-compose.test.yml exec test-db pg_isready -U sa -d ladevi_ventas_test >/dev/null 2>&1; do
  echo "⏳ PostgreSQL iniciando..."
  sleep 2
done
echo "✅ PostgreSQL listo"

# Esperar API
echo "🔍 Verificando API..."
until curl -f http://localhost:5003/swagger >/dev/null 2>&1; do
  echo "⏳ API iniciando..."
  sleep 3
done
echo "✅ API lista"

# Verificar que el frontend esté corriendo
echo "🔍 Verificando Frontend..."
if ! curl -f http://localhost:3000 >/dev/null 2>&1; then
  echo "❌ Error: Frontend no está corriendo en localhost:3000"
  echo "   Por favor ejecuta 'npm start' en otro terminal primero"
  exit 1
fi
echo "✅ Frontend listo"

echo "🧪 Ejecutando tests E2E..."
npm run test:e2e

echo "🎉 Tests completados exitosamente!"