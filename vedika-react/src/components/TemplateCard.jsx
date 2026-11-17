import { Heart } from "lucide-react";

export default function TemplateCard({ template, liked, onToggleLike, onOpen }) {
  const { title, category, palette, elements, floorPlan, cover } = template;
  return (
    <article className="tcard">
      <div className="tcard__img">
        <img src={cover} alt={title} loading="lazy" />
        <button
          className={`tcard__heart ${liked ? "is-liked" : ""}`}
          onClick={() => onToggleLike(template.id)}
          aria-label={liked ? "Remove from favourites" : "Add to favourites"}
          aria-pressed={liked}
        >
          <Heart size={16} fill={liked ? "currentColor" : "none"} />
        </button>
        {floorPlan && <span className="tcard__badge">Floor plan ready</span>}
      </div>
      <div className="tcard__body">
        <h3>{title}</h3>
        <p>{category} · {palette}</p>
        <div className="tcard__foot">
          <span>{elements} elements</span>
          <button className="btn-outline" onClick={() => onOpen(template)}>Open in editor</button>
        </div>
      </div>
    </article>
  );
}
