import { useMemo, useState } from "react";
import { EXPOSES } from "./data";
import { distinctDates, filterExposes, formatDate } from "./filter";
import { BUILD, shortSha } from "./version";

export default function App() {
  const [query, setQuery] = useState("");
  const [date, setDate] = useState<string | null>(null);

  const dates = useMemo(() => distinctDates(EXPOSES), []);
  const results = filterExposes(EXPOSES, { query, date });

  return (
    <div className="page">
      <header className="hero">
        <p className="eyebrow">M354 · Virtualisation et Cloud Computing</p>
        <h1>Planning des exposés</h1>
        <p className="lead">Retrouvez la date et le sujet de chaque exposé du module.</p>
      </header>

      <section className="controls" aria-label="Filtres">
        <input
          type="search"
          placeholder="Rechercher un sujet ou un thème…"
          aria-label="Rechercher"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="chips" role="group" aria-label="Filtrer par date">
          <button type="button" aria-pressed={date === null} onClick={() => setDate(null)}>
            Toutes les dates
          </button>
          {dates.map((d) => (
            <button key={d} type="button" aria-pressed={date === d} onClick={() => setDate(d)}>
              {formatDate(d)}
            </button>
          ))}
        </div>
      </section>

      <p className="count" role="status">
        {results.length} exposé{results.length > 1 ? "s" : ""}
      </p>

      {results.length === 0 ? (
        <p className="empty">Aucun exposé ne correspond à votre recherche.</p>
      ) : (
        <ul className="grid">
          {results.map((e) => (
            <li key={e.id} className="card" data-testid="expose">
              <div className="card-top">
                <span className="num">{String(e.id).padStart(2, "0")}</span>
                <span className={`tag tag-${e.theme === "DevOps" ? "devops" : "other"}`}>{e.theme}</span>
              </div>
              <h2>{e.sujet}</h2>
              <p className="date">{formatDate(e.date)}</p>
            </li>
          ))}
        </ul>
      )}

      <footer className="footer" data-testid="build-info">
        <span className="badge">v{BUILD.version}</span>
        <span>
          commit <code>{shortSha(BUILD.commit)}</code>
        </span>
        <span>environnement : {BUILD.environment}</span>
      </footer>
    </div>
  );
}
