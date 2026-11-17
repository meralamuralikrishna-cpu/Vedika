import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { TEMPLATES, CATEGORIES } from "../data/templates";
import TemplateGrid from "./TemplateGrid";

export default function TemplatesPage({ onOpen }) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [likedIds, setLikedIds] = useState(() => new Set());

  const toggleLike = (id) =>
    setLikedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TEMPLATES.filter(
      (t) =>
        (category === "All" || t.category === category) &&
        (!q || `${t.title} ${t.category} ${t.palette}`.toLowerCase().includes(q))
    );
  }, [category, query]);

  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Explore Templates</h1>
          <p className="muted">{visible.length} designs ready to customise</p>
        </div>
        <label className="search">
          <Search size={16} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search templates" />
        </label>
      </div>

      <div className="chips">
        {CATEGORIES.map((c) => (
          <button key={c} className={`chip ${c === category ? "is-active" : ""}`} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </div>

      <TemplateGrid templates={visible} likedIds={likedIds} onToggleLike={toggleLike} onOpen={onOpen} />
    </section>
  );
}
