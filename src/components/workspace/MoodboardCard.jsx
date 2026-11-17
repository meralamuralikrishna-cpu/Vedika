import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Ellipsis, ExternalLink, Link2, Pencil, Trash2 } from 'lucide-react';
import { resolveTemplateCover } from '@/data/templateCovers';
import FavoriteButton from './FavoriteButton';
import SceneView from '../../studio/SceneView';
import { createSharedDesign, shareUrl } from '@/lib/share';

const dateLabel = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
};

export default function MoodboardCard({ board, onOpen, onEdit, onToggleFavorite, onDelete }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const palette = board.palette ?? board.colors ?? [];
  const linkedDesigns = board.linkedDesigns ?? [];
  const savedIdeas = board.inspirations ?? [];
  const savedItems = board.items ?? [];
  const savedCount = Math.max(board.designIds?.length ?? 0, board.scenes?.length ?? 0) + savedIdeas.length + savedItems.length;
  const edited = dateLabel(board.updatedAt ?? board.createdAt);
  const category = board.eventType ?? board.category;

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
        <img src={resolveTemplateCover(board.coverImage)} alt="" loading="lazy" />
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
        {linkedDesigns.length > 0 && <div className="mb-linked-designs" aria-label="Saved design inspirations">{linkedDesigns.slice(0, 3).map((design) => <span className="mb-linked-design" key={design.id} title={design.name}>{design.scene ? <SceneView scene={design.scene} uid={`mb-${board.id}-${design.id}`} aria-hidden="true" /> : <span className="mb-linked-empty" aria-hidden="true" /> }<small>{design.name}</small></span>)}{linkedDesigns.length > 3 && <span className="mb-linked-more">+{linkedDesigns.length - 3}</span>}</div>}
        {savedIdeas.length > 0 && <div className="mb-linked-designs" aria-label="Saved template inspirations">{savedIdeas.slice(0, 3).map((idea) => <span className="mb-linked-design" key={idea.id}><img src={resolveTemplateCover(idea.image)} alt="" /><small>{idea.title}</small></span>)}</div>}
        {savedItems.length > 0 && <div className="mb-linked-designs" aria-label="Saved inspiration items">{savedItems.slice(0, 3).map((item) => <span className="mb-linked-design" key={item.id}>{item.type === 'image' && item.src ? <img src={item.src} alt="" /> : item.cover ? <img src={resolveTemplateCover(item.cover)} alt="" /> : <i className="mb-linked-swatch" style={{ backgroundColor: item.color || '#B7C9B8' }} />}<small>{item.title}</small></span>)}{savedItems.length > 3 && <span className="mb-linked-more">+{savedItems.length - 3}</span>}</div>}
        <div className="mb-board-meta">
          <span className="mb-board-palette" aria-label="Color palette">{palette.slice(0, 5).map((color) => <i key={color} style={{ backgroundColor: color }} />)}</span>
          {board.eventDate && <span className="mb-board-date"><CalendarDays size={12} />{dateLabel(board.eventDate)}</span>}
        </div>
        {edited && <small className="mb-board-updated">Updated {edited}</small>}
        {(board.budget || board.referenceUrl) && <div className="mb-planning-meta">{board.budget > 0 && <span>Budget · {new Intl.NumberFormat(undefined, { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(board.budget)}</span>}{board.referenceUrl && <span><ExternalLink size={11} /> Reference link saved</span>}</div>}
      </button>
      <div className="mb-board-footer"><button type="button" onClick={edit}>Edit collection<ArrowIcon /></button>{(linkedDesigns[0]?.id || savedIdeas[0]?.templateId || savedItems[0]?.templateId) ? <button type="button" onClick={() => navigate(linkedDesigns[0]?.id ? `/studio?design=${encodeURIComponent(linkedDesigns[0].id)}` : `/studio?template=${encodeURIComponent((savedIdeas[0]?.templateId ?? savedItems[0]?.templateId))}`)}>Open in Studio<ArrowIcon /></button> : <span>Open to see the details</span>}{board.referenceUrl && <a href={board.referenceUrl} target="_blank" rel="noreferrer">Open reference <ExternalLink size={11} /></a>}{linkedDesigns[0]?.id && <button type="button" onClick={shareDesign}><Link2 size={12} />Share for feedback</button>}</div>
      {shareMessage && <p className="mb-share-message" role="status">{shareMessage}</p>}
    </article>
  );
}

function ArrowIcon() {
  return <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true"><path d="M4 10h11m-5-5 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
