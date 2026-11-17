import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ExternalLink, Images, Link2, Plus, Trash2, Upload, X } from 'lucide-react';
import { v4 as uuid } from 'uuid';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { THEMES } from '@/studio/themes';
import { ELEMENTS } from '@/studio/elements';
import { resolveTemplateCover } from '@/data/templateCovers';
import { templates } from '@/data/templates';
import { createSharedDesign, shareUrl } from '@/lib/share';
import MoodboardCard from './MoodboardCard';
import './moodboards.css';

const dateLabel = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
};
const eventTypes = ['Wedding', 'Reception', 'Haldi', 'Mehendi', 'Sangeet', 'Engagement', 'Birthday', 'Baby shower', 'Anniversary', 'Other celebration'];

function MoodboardForm({ board, designs, onSave }) {
  const [name, setName] = useState(board?.name ?? board?.title ?? '');
  const [eventType, setEventType] = useState(board?.eventType ?? 'Wedding');
  const [eventDate, setEventDate] = useState(board?.eventDate ?? '');
  const [note, setNote] = useState(board?.note ?? board?.notes ?? '');
  const [referenceUrl, setReferenceUrl] = useState(board?.referenceUrl ?? '');
  const [coverImage, setCoverImage] = useState(board?.coverImage ?? '');
  const existingPalette = board?.palette ?? board?.colors ?? [];
  const matched = THEMES.find((theme) => theme.palette.join('|') === existingPalette.join('|'));
  const [themeId, setThemeId] = useState(matched?.id ?? (existingPalette.length ? 'custom' : THEMES[0].id));
  const [budget, setBudget] = useState(board?.budget ?? '');
  const [designIds, setDesignIds] = useState(board?.designIds ?? []);

  const submit = (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    const selected = THEMES.find((theme) => theme.id === themeId);
    onSave({ id: board?.id, name: name.trim(), eventType, eventDate, note: note.trim(), coverImage, palette: selected?.palette ?? existingPalette, budget: budget === '' ? '' : Number(budget), referenceUrl: referenceUrl.trim(), designIds });
  };

  return <form id="moodboard-form" className="mb-form" onSubmit={submit}>
    <div className="mb-form-cover">{coverImage ? <img src={resolveTemplateCover(coverImage)} alt="Moodboard cover preview" /> : <div className="mb-cover-placeholder"><Images size={24} /><span>Collection cover</span></div>}</div>
    <div className="mb-form-fields">
      <label>Moodboard Name<input autoFocus required maxLength={80} value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Garden ceremony ideas" /></label>
      <div className="mb-form-row"><label>Event Type<select value={eventType} onChange={(event) => setEventType(event.target.value)}>{eventTypes.map((type) => <option key={type}>{type}</option>)}</select></label><label>Event Date<input type="date" value={eventDate} onChange={(event) => setEventDate(event.target.value)} /></label></div>
      <label>Collection Notes<textarea rows={3} maxLength={500} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Describe the feeling, colors, or details you have in mind." /></label>
      <div className="mb-form-row"><label>Estimated Budget<input type="number" min="0" step="100" value={budget} onChange={(event) => setBudget(event.target.value)} placeholder="Optional" /></label><label>Color Palette<select value={themeId} onChange={(event) => setThemeId(event.target.value)}>{themeId === 'custom' && <option value="custom">Keep existing palette</option>}{THEMES.map((theme) => <option key={theme.id} value={theme.id}>{theme.name}</option>)}</select></label></div>
      <label>Vendor or Reference Link<input type="url" value={referenceUrl} onChange={(event) => setReferenceUrl(event.target.value)} placeholder="https://…" /></label>
      {designs.length > 0 && <fieldset className="mb-design-picker"><legend>Linked Studio designs</legend>{designs.map((design) => <label key={design.id}><input type="checkbox" checked={designIds.includes(design.id)} onChange={(event) => setDesignIds((current) => event.target.checked ? [...current, design.id] : current.filter((id) => id !== design.id))} />{design.name}</label>)}</fieldset>}
    </div>
  </form>;
}

function resizeImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const image = new Image();
      image.onerror = reject;
      image.onload = () => {
        const scale = Math.min(1, 1400 / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function MoodboardWorkspace({ board, designs, onClose, onUpdate }) {
  const [note, setNote] = useState(board.note ?? board.notes ?? '');
  const [paletteName, setPaletteName] = useState('');
  const [colors, setColors] = useState(['#A8B5A0', '#C5A46D', '#FAF7F2', '#CFA09C']);
  const [elementId, setElementId] = useState(ELEMENTS[0]?.id ?? '');
  const [message, setMessage] = useState('');
  const items = board.items ?? [];
  const linkedDesigns = designs.filter((design) => (board.designIds ?? []).includes(design.id));
  const shareItems = [...items, ...linkedDesigns.map((design) => ({ id: `design-${design.id}`, type: 'design', title: design.name, category: 'Studio design' }))];
  const updateItems = (nextItems) => onUpdate(board.id, { items: nextItems });

  const addImage = async (event) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (!files.length) return;
    if (files.some((file) => !file.type.startsWith('image/'))) { setMessage('Choose image files only.'); return; }
    try {
      const uploads = await Promise.all(files.map(async (file) => ({ id: uuid(), type: 'image', title: file.name.replace(/\.[^.]+$/, ''), src: await resizeImage(file), savedAt: new Date().toISOString() })));
      updateItems([...items, ...uploads]);
      setMessage(`${uploads.length} reference image${uploads.length === 1 ? '' : 's'} added.`);
    } catch { setMessage('Could not read that image. Try another file.'); }
  };

  const addElement = () => {
    const element = ELEMENTS.find((entry) => entry.id === elementId);
    if (!element || items.some((item) => item.type === 'element' && item.elementId === element.id)) return;
    updateItems([...items, { id: uuid(), type: 'element', elementId: element.id, title: element.name, category: element.category, color: element.color }]);
  };

  const addPalette = () => {
    const next = { id: uuid(), name: paletteName.trim() || 'Personal palette', colors };
    onUpdate(board.id, { palettes: [...(board.palettes ?? []), next] });
    setPaletteName('');
  };

  const shareBoard = async () => {
    try {
      const share = await createSharedDesign({
        designId: `moodboard:${board.id}`,
        name: board.name ?? board.title,
        elements: [],
        settings: { moodboardSnapshot: { name: board.name ?? board.title, eventType: board.eventType, eventDate: board.eventDate, note, palette: board.palette ?? board.colors ?? [], palettes: board.palettes ?? [], items: shareItems } },
        venuePlan: {},
      });
      const url = shareUrl(share.id);
      if (navigator.share) await navigator.share({ title: board.name ?? board.title, text: `Moodboard collection: ${board.name ?? board.title}`, url });
      else if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(url); setMessage('Guest link copied. They can view the collection and leave feedback.'); }
      else { window.prompt('Copy this guest link', url); }
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not share the collection.'); }
  };

  const moveItem = (index, delta) => {
    const next = [...items];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    updateItems(next);
  };

  return <div className="mb-detail-workspace">
    <div className="mb-detail-toolbar"><div><span className="mb-eyebrow">{board.eventType || 'Event'}{board.eventDate ? ` · ${dateLabel(board.eventDate)}` : ''}</span><p>{items.length + linkedDesigns.length} saved references · Updated {dateLabel(board.updatedAt ?? board.createdAt)}</p></div><Button variant="secondary" size="sm" onClick={shareBoard}><Link2 size={14} />Share Moodboard</Button></div>
    {message && <p className="mb-share-message" role="status">{message}</p>}
    <div className="mb-detail-actions"><label className="mb-upload-action"><Upload size={14} />Upload Reference Images<input type="file" accept="image/*" multiple onChange={addImage} /></label><label className="mb-detail-add-element">Add decoration element<select value={elementId} onChange={(event) => setElementId(event.target.value)}>{ELEMENTS.map((element) => <option key={element.id} value={element.id}>{element.name} · {element.category}</option>)}</select></label><Button size="sm" variant="secondary" onClick={addElement}><Plus size={14} />Add Element</Button></div>
    {items.length || linkedDesigns.length ? <div className="mb-detail-grid">{items.map((item, index) => {
      const template = item.templateId ? templates.find((entry) => entry.id === item.templateId) : null;
      const cover = item.type === 'image' ? item.src : item.cover ?? template?.cover;
      return <article className="mb-detail-item" key={item.id}>
        <div className="mb-detail-item-preview">{cover ? <img src={item.type === 'image' ? cover : resolveTemplateCover(cover)} alt="" /> : item.type === 'element' ? <span className="mb-element-swatch" style={{ backgroundColor: item.color }} /> : <div className="mb-cover-placeholder"><Images size={18} /></div>}</div>
        <div className="mb-detail-item-copy"><strong>{item.title}</strong><small>{item.type === 'template' ? `Template · ${item.category}` : item.type === 'element' ? `Decoration · ${item.category}` : 'Reference image'}</small></div>
        <div className="mb-detail-item-actions"><button type="button" disabled={index === 0} aria-label="Move item up" onClick={() => moveItem(index, -1)}><ArrowLeft size={13} /></button><button type="button" disabled={index === items.length - 1} aria-label="Move item down" onClick={() => moveItem(index, 1)}><ArrowRight size={13} /></button><button type="button" aria-label={`Remove ${item.title}`} onClick={() => updateItems(items.filter((entry) => entry.id !== item.id))}><Trash2 size={13} /></button></div>
      </article>;
    })}{linkedDesigns.map((design) => <article className="mb-detail-item" key={`design-${design.id}`}><div className="mb-detail-item-preview"><img src={resolveTemplateCover(design.coverImage)} alt="" /></div><div className="mb-detail-item-copy"><strong>{design.name}</strong><small>Saved Studio design</small></div><a className="mb-detail-open" href={`/studio?design=${encodeURIComponent(design.id)}`} aria-label={`Open ${design.name} in Studio`}><ExternalLink size={14} /></a></article>)}</div> : <div className="mb-detail-empty"><Images size={26} /><p>No inspiration saved yet. Upload a reference or add a decoration element.</p></div>}
    <section className="mb-detail-section"><div className="mb-detail-section-heading"><div><span className="mb-eyebrow">Your personal palettes</span><h3>Color stories</h3></div></div><div className="mb-palette-list">{board.palette?.length > 0 && <div className="mb-saved-palette"><strong>Collection palette</strong><div>{board.palette.map((color) => <i key={color} style={{ backgroundColor: color }} />)}</div></div>}{(board.palettes ?? []).map((palette) => <div className="mb-saved-palette" key={palette.id}><strong>{palette.name}</strong><div>{palette.colors.map((color, index) => <i key={`${color}-${index}`} style={{ backgroundColor: color }} />)}</div><button type="button" aria-label={`Remove ${palette.name}`} onClick={() => onUpdate(board.id, { palettes: (board.palettes ?? []).filter((entry) => entry.id !== palette.id) })}><X size={13} /></button></div>)}</div><div className="mb-palette-create"><input aria-label="Palette name" value={paletteName} onChange={(event) => setPaletteName(event.target.value)} placeholder="Palette name" /><div>{colors.map((color, index) => <input key={index} type="color" aria-label={`Palette color ${index + 1}`} value={color} onChange={(event) => setColors((current) => current.map((entry, i) => i === index ? event.target.value : entry))} />)}</div><Button size="sm" variant="secondary" onClick={addPalette}><Plus size={13} />Save palette</Button></div></section>
    <section className="mb-detail-section"><div className="mb-detail-section-heading"><div><span className="mb-eyebrow">Collection notes</span><h3>Keep the details</h3></div><Button size="sm" onClick={() => { onUpdate(board.id, { note, notes: note }); setMessage('Notes saved.'); }}>Save Notes</Button></div><textarea className="mb-detail-notes" value={note} maxLength={1000} onChange={(event) => setNote(event.target.value)} placeholder="Add your event notes, vendor ideas, or details to remember…" />{board.referenceUrl && <a className="mb-detail-reference" href={board.referenceUrl} target="_blank" rel="noreferrer">Open saved reference <ExternalLink size={13} /></a>}</section>
  </div>;
}

export default function Moodboards({ moodboards = [], designs = [], canSaveData = false, offlineDemo = false, cloudSaveStatus, onCreate, onUpdate, onDelete, onToggleFavorite }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [editingBoard, setEditingBoard] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saveError, setSaveError] = useState('');
  const sortedBoards = useMemo(() => [...moodboards].sort((a, b) => new Date(b.updatedAt ?? b.createdAt ?? 0) - new Date(a.updatedAt ?? a.createdAt ?? 0)), [moodboards]);
  const selectedBoard = sortedBoards.find((board) => board.id === searchParams.get('board'));
  const boardItems = sortedBoards.flatMap((board) => board.items ?? []);
  const savedImages = boardItems.filter((item) => item.type === 'image');
  const savedElements = boardItems.filter((item) => item.type === 'element');
  const palettes = sortedBoards.flatMap((board) => (board.palettes ?? []).map((palette) => ({ ...palette, boardName: board.name ?? board.title })));
  const openBoard = (board) => setSearchParams({ board: board.id });
  const closeBoard = () => setSearchParams({});
  const editBoard = (board) => { setEditingBoard(board); setSaveError(''); setFormOpen(true); };
  const boardCards = sortedBoards.map((board) => <MoodboardCard key={board.id} board={{ ...board, name: board.name ?? board.title, note: board.note ?? board.notes, palette: board.palette ?? board.colors ?? [], linkedDesigns: designs.filter((design) => (board.designIds ?? []).includes(design.id)) }} onOpen={openBoard} onEdit={editBoard} onDelete={onDelete} onToggleFavorite={onToggleFavorite} />);
  const saveForm = (draft) => {
    try { onCreate(draft); setEditingBoard(null); setFormOpen(false); setSaveError(''); }
    catch { setSaveError('This moodboard could not be saved. Please try again.'); }
  };
  const updateBoard = (id, patch) => {
    const board = moodboards.find((entry) => entry.id === id);
    if (board) onUpdate({ ...board, ...patch, updatedAt: new Date().toISOString() });
  };
  const editorModal = <Modal open={formOpen} onClose={() => { setFormOpen(false); setEditingBoard(null); setSaveError(''); }} title={editingBoard?.id ? 'Edit Moodboard' : 'Create New Moodboard'} size="lg" footer={<><Button type="button" variant="secondary" onClick={() => { setFormOpen(false); setEditingBoard(null); setSaveError(''); }}>Cancel</Button><Button type="submit" form="moodboard-form">{editingBoard?.id ? 'Save Changes' : 'Create Moodboard'}</Button></>}><MoodboardForm key={editingBoard?.id ?? 'new'} board={editingBoard} designs={designs} onSave={saveForm} />{saveError && <p className="mb-form-error" role="alert">{saveError}</p>}</Modal>;

  if (selectedBoard) return <div className="moodboards-page"><main className="mb-main mb-detail-page"><button type="button" className="mb-detail-back" onClick={closeBoard}><ArrowLeft size={15} />All moodboards</button><div className="mb-detail-page-heading"><div><span className="mb-eyebrow">{selectedBoard.eventType ?? 'Personal collection'}</span><h1>{selectedBoard.name ?? selectedBoard.title}</h1><p>{selectedBoard.note ?? selectedBoard.notes ?? 'Your saved inspiration workspace.'}</p></div><Button variant="secondary" onClick={() => editBoard(selectedBoard)}>Edit collection details</Button></div><MoodboardWorkspace key={selectedBoard.id} board={selectedBoard} designs={designs} onUpdate={updateBoard} /></main>{editorModal}</div>;

  return <div className="moodboards-page">
    <header className="mb-hero"><img className="mb-hero-image" src={resolveTemplateCover('Sage Garden Reception.png')} alt="" /><div className="mb-hero-wash" /><div className="mb-hero-content"><nav className="mb-breadcrumb" aria-label="Breadcrumb"><button onClick={() => navigate('/')}>Home</button><span>/</span><span>Creative Studio</span><span>/</span><span aria-current="page">Moodboards</span></nav><div className="mb-hero-layout"><div><span className="mb-hero-kicker">Your inspiration, gathered in one place</span><h1>Moodboard Collections</h1><p>Build personal collections of reference images, decoration elements, color palettes, and event notes.</p></div><div className="mb-hero-actions"><Button onClick={() => { setSaveError(''); setEditingBoard(null); setFormOpen(true); }}><Plus size={16} />Create New Moodboard</Button></div></div></div></header>
    <main className="mb-main">
      {canSaveData && cloudSaveStatus === 'error' && <p className="mb-sync-error" role="alert">Your latest moodboard changes could not sync. They remain available in this session.</p>}
      {!canSaveData && !offlineDemo && <p className="mb-session-note" role="status">Collections save on this device. Sign in with a connected account to sync them across devices.</p>}
      <section className="mb-page-section"><div className="mb-section-heading"><div><span className="mb-eyebrow">Your workspace</span><h2>My Moodboard Collections</h2><p>{sortedBoards.length ? 'Recently updated collections appear first.' : 'Create a collection, then save references from templates or Studio.'}</p></div><Button variant="secondary" onClick={() => { setSaveError(''); setEditingBoard(null); setFormOpen(true); }}><Plus size={15} />New collection</Button></div>
        {boardCards.length ? <div className="mb-board-grid">{boardCards}</div> : <div className="mb-detail-empty"><Images size={28} /><p>Your collections will appear here. Create one to start gathering ideas.</p></div>}
      </section>
      <section className="mb-page-section"><div className="mb-section-heading"><div><span className="mb-eyebrow">Visual references</span><h2>Saved Inspiration Images</h2><p>Images saved across your collections.</p></div><span className="mb-section-count">{savedImages.length} images</span></div>{savedImages.length ? <div className="mb-saved-image-strip">{savedImages.slice(0, 8).map((item) => <button type="button" key={item.id} onClick={() => openBoard(sortedBoards.find((board) => board.items?.some((entry) => entry.id === item.id)))}><img src={item.src} alt={item.title} /><span>{item.title}</span></button>)}</div> : <p className="mb-section-empty">Uploaded references will gather here as you add them to collections.</p>}</section>
      <section className="mb-page-section"><div className="mb-section-heading"><div><span className="mb-eyebrow">Saved references</span><h2>Saved Decoration Elements</h2><p>Decoration items collected from Studio’s elements library.</p></div><span className="mb-section-count">{savedElements.length} elements</span></div>{savedElements.length ? <div className="mb-element-overview">{savedElements.slice(0, 12).map((item) => <button type="button" key={item.id} onClick={() => openBoard(sortedBoards.find((board) => board.items?.some((entry) => entry.id === item.id)))}><i style={{ backgroundColor: item.color || '#B7C9B8' }} /><span>{item.title}</span><small>{item.category}</small></button>)}</div> : <p className="mb-section-empty">Save elements from the Studio library to build this reference list.</p>}</section>
      <section className="mb-page-section"><div className="mb-section-heading"><div><span className="mb-eyebrow">Saved colors</span><h2>Personal Color Palettes</h2><p>Your collection palettes and custom color stories.</p></div><span className="mb-section-count">{palettes.length + sortedBoards.filter((board) => board.palette?.length).length} palettes</span></div><div className="mb-palette-overview">{sortedBoards.filter((board) => board.palette?.length).map((board) => <button type="button" key={board.id} onClick={() => openBoard(board)}><span>{board.name ?? board.title}</span><i>{board.palette.map((color, index) => <b key={`${color}-${index}`} style={{ backgroundColor: color }} />)}</i></button>)}{palettes.map((palette) => <div key={palette.id}><span>{palette.name} · {palette.boardName}</span><i>{palette.colors.map((color, index) => <b key={`${color}-${index}`} style={{ backgroundColor: color }} />)}</i></div>)}{!palettes.length && !sortedBoards.some((board) => board.palette?.length) && <p className="mb-section-empty">Save a palette inside any collection to see it here.</p>}</div></section>
    </main>
    {editorModal}
  </div>;
}
