import { useMemo, useState } from "react";
import DesignCard from "./DesignCard";
import EmptyState from "./EmptyState";
import "./workspace.css";

export default function MyDesigns({ designs, onOpen, onNew, onBrowseTemplates, onToggleFavorite, onDuplicate, onDelete }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recent");
  const [favOnly, setFavOnly] = useState(false);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return designs.filter((d) => (!favOnly || d.favorite) && (!q || d.name.toLowerCase().includes(q)))
      .sort((a, b) => (sort === "name" ? a.name.localeCompare(b.name) : new Date(b.updatedAt) - new Date(a.updatedAt)));
  }, [designs, query, sort, favOnly]);

  return (
    <section className="ws">
      <header className="ws-head"><h2>My designs</h2>{onNew && <button className="ws-btn is-primary" onClick={onNew}>New design</button>}</header>
      {designs.length === 0 ? (
        <EmptyState title="No designs yet" text="Start from a template or open a blank canvas." actions={[onBrowseTemplates && { label: "Browse templates", onClick: onBrowseTemplates, primary: true }, onNew && { label: "Blank canvas", onClick: onNew }].filter(Boolean)} />
      ) : (
        <>
          <div className="ws-toolbar">
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search designs" aria-label="Search designs" />
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort designs"><option value="recent">Recently edited</option><option value="name">Name</option></select>
            <button className={`ws-chip${favOnly ? " is-on" : ""}`} aria-pressed={favOnly} onClick={() => setFavOnly(!favOnly)}>Favorites</button>
          </div>
          {list.length === 0 ? <p className="ws-muted">No designs match your search.</p> : (
            <div className="ws-grid">{list.map((d) => <DesignCard key={d.id} design={d} onOpen={onOpen} onToggleFavorite={onToggleFavorite} onDuplicate={onDuplicate} onDelete={onDelete} />)}</div>
          )}
        </>
      )}
    </section>
  );
}
