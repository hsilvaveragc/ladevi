import { defineConfig, devices } from "@playwright/test";

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./e2e",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!import.meta.env.CI,
  /* Retry on CI only */
  retries: import.meta.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: import.meta.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: import.meta.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",

    /* Take screenshot on failure */
    screenshot: "only-on-failure",

    /* Record video on failure */
    video: "retain-on-failure",

    /* Ignore SSL certificate errors */
    ignoreHTTPSErrors: true,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:3000",
        ignoreHTTPSErrors: true,
      },
    },

    // Uncomment these if you want to test in more browsers
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: [
    {
      // Iniciar entorno de testing con Docker
      command:
        "docker-compose -f testing/docker-compose.test.yml up --build -d",
      url: "http://localhost:5002",
      reuseExistingServer: !import.meta.env.CI,
      timeout: 120000,
    },
    {
      // Iniciar React
      command: "NODE_OPTIONS=--openssl-legacy-provider npm run start:js",
      url: "http://localhost:3000",
      reuseExistingServer: !import.meta.env.CI,
      timeout: 60000,
      env: {
        NODE_OPTIONS: "--openssl-legacy-provider",
        VITE_API_URL: "http://localhost:5002/api/",
      },
    },
  ],
});
