import { test, expect } from "@playwright/test";
import { TEST_CONFIG } from "../utils/config.js";

test.describe("Autenticación", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_CONFIG.baseURL);
  });

  test("debe mostrar formulario de login en página inicial", async ({
    page,
  }) => {
    await expect(page.locator('[data-testid="username-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="password-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="login-button"]')).toBeVisible();
  });

  test("login exitoso redirige al dashboard", async ({ page }) => {
    const { username, password } = TEST_CONFIG.credentials.admin;

    await page.locator('[data-testid="username-input"]').fill(username);
    await page.locator('[data-testid="password-input"]').fill(password);
    await page.locator('[data-testid="login-button"]').click();

    await page.waitForURL(TEST_CONFIG.baseURL, { timeout: 10000 });
    await expect(page.locator('[data-testid="page-title"]')).toHaveText("Home");
  });

  test("login con credenciales incorrectas muestra error", async ({ page }) => {
    const { username, password } = TEST_CONFIG.credentials.invalid;

    await page.locator('[data-testid="username-input"]').fill(username);
    await page.locator('[data-testid="password-input"]').fill(password);
    await page.locator('[data-testid="login-button"]').click();

    await expect(
      page.locator('[data-testid="error-container-login"]')
    ).toBeVisible();
  });

  test("campos requeridos muestran validación", async ({ page }) => {
    await page.locator('[data-testid="login-button"]').click();

    await expect(page.locator('[id="username-error"]')).toBeVisible();
    await expect(page.locator('[id="password-error"]')).toBeVisible();
  });
});
