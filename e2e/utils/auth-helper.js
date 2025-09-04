import { expect } from "@playwright/test";
import { TEST_CONFIG } from "./config.js";

/**
 * Realiza login y espera a que la aplicación esté lista
 * @param {Page} page - Página de Playwright
 * @param {string} userType - Tipo de usuario ('admin', 'invalid')
 */
export async function login(page, userType = "admin") {
  const credentials = TEST_CONFIG.credentials[userType];

  await page.goto(TEST_CONFIG.baseURL);

  await expect(page.locator('[data-testid="username-input"]')).toBeVisible();

  await page
    .locator('[data-testid="username-input"]')
    .fill(credentials.username);
  await page
    .locator('[data-testid="password-input"]')
    .fill(credentials.password);
  await page.locator('[data-testid="login-button"]').click();

  await page.waitForURL(TEST_CONFIG.baseURL, { timeout: 10000 });
  await expect(page.locator('[data-testid="page-title"]')).toHaveText("Home");
}

/**
 * Espera a que Redux termine de cargar datos iniciales
 * @param {Page} page - Página de Playwright
 */
export async function waitForAppReady(page) {
  // Esperar a que desaparezcan los spinners de carga
  await page
    .waitForSelector(".loading-spinner", { state: "detached", timeout: 10000 })
    .catch(() => {
      // Si no hay spinner, continúa
    });

  // Esperar a que la app esté completamente cargada
  await page.waitForLoadState("networkidle");
}
