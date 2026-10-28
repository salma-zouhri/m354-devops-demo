/** Informations de build injectées par le pipeline (variables VITE_*). */
export const BUILD = {
  version: import.meta.env.VITE_APP_VERSION ?? "dev",
  commit: import.meta.env.VITE_GIT_SHA ?? "local",
  environment: import.meta.env.VITE_ENVIRONMENT ?? "local",
};

export function shortSha(sha: string): string {
  return sha.length > 7 ? sha.slice(0, 7) : sha;
}
