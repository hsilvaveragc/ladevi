// Configuración simple para tests E2E - solo valores variables
export const TEST_CONFIG = {
  baseURL: "http://localhost:3000",
  apiURL: "http://localhost:5002",

  credentials: {
    admin: {
      username: "gpribi@admin.com",
      password: "Inicio321!",
    },
    invalid: {
      username: "wrong@email.com",
      password: "wrongpassword",
    },
  },
};
