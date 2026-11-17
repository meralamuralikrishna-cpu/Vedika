import TemplateCard from "./TemplateCard";

export default function TemplateGrid({ templates, likedIds, onToggleLike, onOpen }) {
  if (!templates.length) return <p className="muted">No templates match your search.</p>;
  return (
    <div className="tgrid">
      {templates.map((t) => (
        <TemplateCard key={t.id} template={t} liked={likedIds.has(t.id)} onToggleLike={onToggleLike} onOpen={onOpen} />
      ))}
    </div>
  );
}
