import type { Expose } from "./data";

/** Met en minuscules et retire les accents, pour une recherche tolérante. */
export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

export type Filters = { query: string; date: string | null };

/** Filtre la liste par texte (sujet ou thème) et par date de passage. */
export function filterExposes(list: Expose[], { query, date }: Filters): Expose[] {
  const q = normalize(query);
  return list.filter((e) => {
    const matchesDate = date === null || e.date === date;
    const matchesQuery = q === "" || normalize(`${e.sujet} ${e.theme}`).includes(q);
    return matchesDate && matchesQuery;
  });
}

/** Dates de passage distinctes, triées. */
export function distinctDates(list: Expose[]): string[] {
  return [...new Set(list.map((e) => e.date))].sort();
}

/** "2026-11-11" -> "11 nov. 2026" */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" }).format(
    new Date(Date.UTC(y, m - 1, d)),
  );
}
