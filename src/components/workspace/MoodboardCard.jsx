import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Ellipsis, ExternalLink, Images, Link2, Pencil, Trash2 } from 'lucide-react';
import FavoriteButton from './FavoriteButton';
import SceneView from '../../studio/SceneView';
import { createSharedDesign, shareUrl } from '@/lib/share';
import { buildInspirationEntries, collectMosaicTiles, resolveMoodboardMedia } from '@/lib/moodboard';

const dateLabel = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
};

function MoodboardCover({ board, designs }) {
  const mosaic = collectMosaicTiles(board, designs, 4);
  const coverSrc = board.coverImage ? resolveMoodboardMedia(board.coverImage) : '';

  if (coverSrc && board.coverMode !== 'mosaic') {
    return <img src={coverSrc} alt="" loading="lazy" />;
  }

  if (mosaic.length > 0) {
    return (
      <div className={`mb-scene-mosaic n${Math.min(mosaic.length, 4)}`} aria-hidden="true">
        {mosaic.slice(0, 4).map((tile) => {
          if (tile.mode === 'scene') {
            return <SceneView key={tile.key} scene={tile.scene} uid={`card-mb-${board.id}-${tile.key}`} />;
          }
          if (tile.mode === 'swatch') {
            return <span key={tile.key} className="mb-mosaic-swatch" style={{ backgroundColor: tile.color }} />;
          }
          return <img key={tile.key} src={tile.src} alt="" loading="lazy" />;
        })}
      </div>
    );
  }

  if (coverSrc) return <img src={coverSrc} alt="" loading="lazy" />;

  return (
    <div className="mb-board-cover-empty">
      <Images size={28} />
      <small>Add inspiration</small>
    </div>
  );
}

export default function MoodboardCard({ board, onOpen, onEdit, onToggleFavorite, onDelete }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const palette = board.palette ?? board.colors ?? [];
  const linkedDesigns = board.linkedDesigns ?? [];
  const inspirations = buildInspirationEntries(board, linkedDesigns);
  const savedCount = inspirations.length;
  const edited = dateLabel(board.updatedAt ?? board.createdAt);
  const category = board.eventType ?? board.category;
  const studioTemplateId = inspirations.find((entry) => entry.item?.templateId)?.item?.templateId
    ?? inspirations.find((entry) => entry.idea?.templateId)?.idea?.templateId;
  const openStudio = () => {
    if (linkedDesigns[0]?.id) navigate(`/studio?design=${encodeURIComponent(linkedDesigns[0].id)}`);
    else if (studioTemplateId) navigate(`/studio?template=${encodeURIComponent(studioTemplateId)}`);
  };

  const edit = () => { setMenuOpen(false); onEdit?.(board); };
  const remove = () => {
    setMenuOpen(false);
    if (window.confirm(`Delete moodboard "${board.name}"?`)) onDelete?.(board.id);
  };
  const shareDesign = async () => {
    const design = linkedDesigns[0];
    if (!design) return;
    try {
      const share = await createSharedDesign({ designId: design.id, name: `${design.name} · ${board.name}`, elements: design.elements, settings: design.settings, venuePlan: design.venuePlan });
      const url = shareUrl(share.id);
      await navigator.clipboard?.writeText(url);
      setShareMessage('Guest link copied. They can comment and give feedback.');
    } catch (error) {
      setShareMessage(error instanceof Error ? error.message : 'Could not create guest link.');
    }
  };

  return (
    <article className="mb-board-card">
      <button className="mb-board-cover" onClick={() => onOpen?.(board)} aria-label={`Open ${board.name}`}>
        <MoodboardCover board={board} designs={linkedDesigns} />
        {category && <span className="mb-board-category">{category}</span>}
      </button>
      {onToggleFavorite && <div className="mb-board-favorite"><FavoriteButton active={board.favorite ?? board.isFavorite} label={board.name} onClick={() => onToggleFavorite(board.id)} /></div>}
      <div className="mb-board-menu-wrap">
        <button className="mb-board-menu-trigger" type="button" aria-label={`More actions for ${board.name}`} aria-haspopup="menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><Ellipsis size={19} /></button>
        {menuOpen && <div className="mb-board-menu" role="menu"><button type="button" role="menuitem" onClick={edit}><Pencil size={14} />Edit Moodboard</button><button type="button" role="menuitem" onClick={remove}><Trash2 size={14} />Delete Moodboard</button></div>}
      </div>
      <button type="button" className="mb-board-content" onClick={() => onOpen?.(board)}>
        <div className="mb-board-title-row"><h3>{board.name ?? board.title}</h3><span>{savedCount} {savedCount === 1 ? 'inspiration' : 'inspirations'}</span></div>
        {board.note && <p className="mb-board-note">{board.note}</p>}
        {inspirations.length > 0 && (
          <div className="mb-inspiration-stream" aria-label="Inspiration">
            {inspirations.slice(0, 5).map((entry) => {
              const media = entry.type === 'image' && entry.item?.src
                ? entry.item.src
                : entry.cover
                  ? resolveMoodboardMedia(entry.cover)
                  : '';
              return (
                <span className="mb-stream-thumb" key={entry.id} title={entry.title}>
                  {entry.scene ? (
                    <SceneView scene={entry.scene} uid={`stream-${board.id}-${entry.id}`} aria-hidden="true" />
                  ) : media ? (
                    <img src={media} alt="" />
                  ) : (
                    <i className="mb-linked-swatch" style={{ backgroundColor: entry.color || '#B7C9B8' }} />
                  )}
                  <em>{entry.badge}</em>
                </span>
              );
            })}
            {inspirations.length > 5 && <span className="mb-linked-more">+{inspirations.length - 5}</span>}
          </div>
        )}
        <div className="mb-board-meta">
          <span className="mb-board-palette" aria-label="Color palette">{palette.slice(0, 5).map((color) => <i key={color} style={{ backgroundColor: color }} />)}</span>
          {board.eventDate && <span className="mb-board-date"><CalendarDays size={12} />{dateLabel(board.eventDate)}</span>}
        </div>
        {edited && <small className="mb-board-updated">Updated {edited}</small>}
        {(board.budget || board.referenceUrl) && <div className="mb-planning-meta">{board.budget > 0 && <span>Budget · {new Intl.NumberFormat(undefined, { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(board.budget)}</span>}{board.referenceUrl && <span><ExternalLink size={11} /> Reference link saved</span>}</div>}
      </button>
      <div className="mb-board-footer"><button type="button" onClick={edit}>Edit collection<ArrowIcon /></button>{(linkedDesigns[0]?.id || studioTemplateId) ? <button type="button" onClick={openStudio}>Open in Studio<ArrowIcon /></button> : <span>Open to see the details</span>}{board.referenceUrl && <a href={board.referenceUrl} target="_blank" rel="noreferrer">Open reference <ExternalLink size={11} /></a>}{linkedDesigns[0]?.id && <button type="button" onClick={shareDesign}><Link2 size={12} />Share for feedback</button>}</div>
      {shareMessage && <p className="mb-share-message" role="status">{shareMessage}</p>}
    </article>
  );
}

function ArrowIcon() {
  return <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true"><path d="M4 10h11m-5-5 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
