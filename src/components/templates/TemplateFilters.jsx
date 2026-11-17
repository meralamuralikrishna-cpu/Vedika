import { TEMPLATE_CATEGORIES } from "../../data/templates";

export default function TemplateFilters({ query, onQuery, category, onCategory, favoritesOnly, onFavoritesOnly }) {
  return (
    <div className="tpl-filters">
      <input
        className="tpl-search"
        type="search"
        value={query}
        onChange={(e) => onQuery(e.target.value)}
        placeholder="Search templates, themes, tags"
        aria-label="Search templates"
      />
      <div className="tpl-chips" role="group" aria-label="Filter by event type">
        {["All", ...TEMPLATE_CATEGORIES].map((c) => (
          <button key={c} className={`tpl-chip${category === c ? " is-on" : ""}`} aria-pressed={category === c} onClick={() => onCategory(c)}>
            {c}
          </button>
        ))}
        <button className={`tpl-chip${favoritesOnly ? " is-on" : ""}`} aria-pressed={favoritesOnly} onClick={() => onFavoritesOnly(!favoritesOnly)}>
          Favorites
        </button>
      </div>
    </div>
  );
}
