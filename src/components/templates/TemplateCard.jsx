import SceneView from "../../studio/SceneView";
import SaveToMoodboardButton from "@/components/workspace/SaveToMoodboardButton";
import { ELEMENT_MAP } from "../../studio/elements";

export default function TemplateCard({ template, isFavorite, onToggleFavorite, onOpen }) {
  const { title, category, theme, elementCount, venueMode } = template;
  const elementNames = [...new Set((template.scene?.elements ?? []).map((element) => ELEMENT_MAP[element.type]?.name ?? element.type))].slice(0, 4);
  return (
    <article className="tpl-card">
      <button className="tpl-cover" onClick={() => onOpen(template)} aria-label={`Open ${title} in editor`}>
        {template.cover ? (
          <img src={template.cover} alt="" aria-hidden="true" />
        ) : (
          <SceneView scene={template.scene} uid={`sc-${template.id}`} aria-hidden="true" />
        )}
        {venueMode && <span className="tpl-badge">Floor plan ready</span>}
      </button>
      <button
        className={`tpl-fav${isFavorite ? " is-on" : ""}`}
        onClick={() => onToggleFavorite(template.id)}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? `Remove ${title} from favorites` : `Add ${title} to favorites`}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="M12 21s-7.5-4.6-9.6-9.2C1 8.6 2.9 5 6.3 5c2 0 3.2 1 3.7 2 .5-1 1.7-2 3.7-2 3.4 0 5.3 3.6 3.9 6.8C19.5 16.4 12 21 12 21z" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      </button>
      <div className="tpl-body">
        <h3>{title}</h3>
        <p>{category} · {theme}</p>
        {template.tags?.length > 0 && <small className="tpl-tags">{template.tags.slice(0, 4).join(' · ')}</small>}
        {elementNames.length > 0 && <small className="tpl-elements">Includes {elementNames.join(', ')}</small>}
        <div className="tpl-foot">
          <span>{elementCount} elements</span>
          <button className="tpl-open" onClick={() => onOpen(template)}>Open in editor</button>
        </div>
        <SaveToMoodboardButton className="tpl-save-moodboard" item={{ type: 'template', templateId: template.id, title, category, cover: template.cover, theme, elementCount }} />
      </div>
    </article>
  );
}
