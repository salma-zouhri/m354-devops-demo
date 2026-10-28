import { defineConfig, devices } from "@playwright/test";

// BASE_URL défini (ex. URL de production) : on teste ce site.
// Sinon : on teste le build local servi par `vite preview`.
const baseURL = process.env.BASE_URL ?? "http://localhost:4173/";

export default defineConfig({
  testDir: "e2e",
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
    // Optionnel : utiliser un Chromium déjà installé (ex. PW_CHROMIUM_PATH=/usr/bin/chromium)
    launchOptions: process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {},
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: process.env.BASE_URL
    ? undefined
    : { command: "npm run preview", url: "http://localhost:4173/", reuseExistingServer: !process.env.CI },
});
