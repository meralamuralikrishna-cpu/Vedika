import SceneView from "../../studio/SceneView";
import FavoriteButton from "./FavoriteButton";

export const formatDate = (iso) => (iso ? new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso)) : "");

export default function DesignCard({ design, onOpen, onToggleFavorite, onDuplicate, onDelete }) {
  return (
    <article className="ws-card">
      <button className="ws-thumb" onClick={() => onOpen?.(design)} aria-label={`Open ${design.name}`}>
        {design.scene ? <SceneView scene={design.scene} uid={`d-${design.id}`} aria-hidden="true" /> : <span className="ws-mosaic-empty">Scene preview unavailable</span>}
      </button>
      {onToggleFavorite && <div className="ws-card-fav"><FavoriteButton active={design.favorite ?? design.isFavorite} label={design.name} onClick={() => onToggleFavorite(design.id)} /></div>}
      <div className="ws-card-body">
        <h3>{design.name}</h3>
        <p>Edited {formatDate(design.updatedAt)}</p>
        <div className="ws-actions">
          <button className="ws-btn is-primary" onClick={() => onOpen(design)}>Open</button>
          {onDuplicate && <button className="ws-btn" onClick={() => onDuplicate(design.id)}>Duplicate</button>}
          {onDelete && <button className="ws-btn is-danger" onClick={() => { if (window.confirm(`Delete "${design.name}"? This can't be undone.`)) onDelete(design.id); }}>Delete</button>}
        </div>
      </div>
    </article>
  );
}
