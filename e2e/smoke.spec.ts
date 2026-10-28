import { expect, test } from "@playwright/test";

// Smoke test : lancé sur le build local en CI, puis sur l'URL de production après le déploiement.
test("la page se charge et le filtre par date fonctionne", async ({ page }) => {
  await page.goto("./");
  await expect(page.getByRole("heading", { name: "Planning des exposés" })).toBeVisible();
  await expect(page.getByTestId("expose")).toHaveCount(8);
  await page.getByRole("button", { name: "11 nov. 2026" }).click();
  await expect(page.getByTestId("expose")).toHaveCount(2);
});

test("version.json est publié avec le commit attendu", async ({ request }) => {
  const res = await request.get("./version.json");
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  const expected = process.env.EXPECTED_SHA;
  if (expected) expect(body.commit).toBe(expected);
});
