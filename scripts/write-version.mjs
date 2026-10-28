// Écrit public/version.json avant le build : la preuve, en production, de ce qui tourne réellement.
// Lit les mêmes variables que l'application (VITE_APP_VERSION, VITE_GIT_SHA, VITE_ENVIRONMENT).
import { mkdirSync, writeFileSync } from "node:fs";

const info = {
  version: process.env.VITE_APP_VERSION ?? "dev",
  commit: process.env.VITE_GIT_SHA ?? "local",
  environment: process.env.VITE_ENVIRONMENT ?? "local",
  builtAt: new Date().toISOString(),
};

mkdirSync("public", { recursive: true });
writeFileSync("public/version.json", JSON.stringify(info, null, 2) + "\n");
console.log("version.json :", info);
