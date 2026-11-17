import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { templates as bundled, TEMPLATE_CATEGORIES } from "../../data/templates";
import TemplateCard from "./TemplateCard";
import TemplateFilters from "./TemplateFilters";
import "./templates.css";

// Pass favorites / onToggleFavorite from your app context to persist them.
// onOpen(template) should navigate to the Design Studio, e.g. navigate(`/studio?template=${t.id}`).
export default function TemplateGrid({ templates = bundled, favorites, onToggleFavorite, onOpen }) {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(() => {
    const requested = searchParams.get("category");
    return TEMPLATE_CATEGORIES.includes(requested) ? requested : "All";
  });
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [localFavs, setLocalFavs] = useState([]);

  const favs = favorites ?? localFavs;
  const toggle = onToggleFavorite ?? ((id) => setLocalFavs((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id])));

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return templates.filter((t) => {
      if (category !== "All" && t.category !== category) return false;
      if (favoritesOnly && !favs.includes(t.id)) return false;
      if (!q) return true;
      return [t.title, t.category, t.theme, ...t.tags].some((s) => s.toLowerCase().includes(q));
    });
  }, [templates, query, category, favoritesOnly, favs]);

  return (
    <section className="tpl-wrap">
      <TemplateFilters query={query} onQuery={setQuery} category={category} onCategory={setCategory} favoritesOnly={favoritesOnly} onFavoritesOnly={setFavoritesOnly} />
      {visible.length === 0 ? (
        <p className="tpl-empty">No templates match. Clear the search or pick another event type.</p>
      ) : (
        <div className="tpl-grid">
          {visible.map((t) => (
            <TemplateCard key={t.id} template={t} isFavorite={favs.includes(t.id)} onToggleFavorite={toggle} onOpen={onOpen ?? (() => {})} />
          ))}
        </div>
      )}
    </section>
  );
}
