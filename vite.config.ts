/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  // Chemins relatifs : le même build fonctionne sur GitHub Pages, dans Docker et en local
  base: "./",
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/setupTests.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/main.tsx", "src/**/*.test.{ts,tsx}", "src/setupTests.ts"],
      thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 },
      reporter: ["text", "html"],
    },
  },
});
