import { TEST_CONFIG } from './config.js';

export async function ensureTestDataReady() {
  // Solo verificar que la API esté lista y cargar datos básicos si es necesario
  const response = await fetch(`${TEST_CONFIG.apiURL}/Testing/health`);

  if (!response.ok) {
    throw new Error('Test API not ready');
  }

  // Opcional: Agregar datos específicos para este test
  await seedBasicTestData();
}

export async function seedBasicTestData() {
  const response = await fetch(`${TEST_CONFIG.apiURL}/Testing/seed-data`, {
    method: 'POST',
    headers: {
      'X-Test-Token': 'tfENXZ840DEO7GKVPQi3',
    },
  });

  // if (!response.ok) {
  //   console.warn("Could not seed test data, but continuing...");
  // }
}
