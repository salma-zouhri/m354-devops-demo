import { EXPOSES } from "./data";
import { distinctDates, filterExposes, formatDate, normalize } from "./filter";
import { shortSha } from "./version";

describe("normalize", () => {
  it("retire les accents et met en minuscules", () => {
    expect(normalize("  Sécurité ")).toBe("securite");
  });
});

describe("filterExposes", () => {
  it("renvoie tout sans filtre", () => {
    expect(filterExposes(EXPOSES, { query: "", date: null })).toHaveLength(8);
  });

  it("filtre par date", () => {
    const ids = filterExposes(EXPOSES, { query: "", date: "2026-11-11" }).map((e) => e.id);
    expect(ids).toEqual([1, 2]);
  });

  it("filtre par texte sans tenir compte des accents", () => {
    const ids = filterExposes(EXPOSES, { query: "securite", date: null }).map((e) => e.id);
    expect(ids).toEqual([2]);
  });

  it("filtre aussi par thème", () => {
    expect(filterExposes(EXPOSES, { query: "conteneurs", date: null })).toHaveLength(2);
  });

  it("combine texte et date", () => {
    const ids = filterExposes(EXPOSES, { query: "kubernetes", date: "2026-12-23" }).map((e) => e.id);
    expect(ids).toEqual([8]);
  });
});

describe("utilitaires", () => {
  it("liste les dates distinctes triées", () => {
    expect(distinctDates(EXPOSES)).toEqual([
      "2026-11-11",
      "2026-11-25",
      "2026-12-02",
      "2026-12-09",
      "2026-12-16",
      "2026-12-23",
    ]);
  });

  it("formate une date en français", () => {
    expect(formatDate("2026-11-11")).toBe("11 nov. 2026");
  });

  it("raccourcit un hash de commit", () => {
    expect(shortSha("abcdef1234567")).toBe("abcdef1");
    expect(shortSha("local")).toBe("local");
  });
});
