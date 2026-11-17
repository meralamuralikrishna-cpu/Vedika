import { useState } from 'react';
import { createPortal } from 'react-dom';
import { v4 as uuid } from 'uuid';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useApp } from '@/context/AppContext';

export default function SaveToMoodboardButton({ item, className = '' }) {
  const { moodboards, saveMoodboard } = useApp();
  const [open, setOpen] = useState(false);
  const [boardId, setBoardId] = useState(moodboards[0]?.id ?? 'new');
  const [name, setName] = useState('');
  const [saved, setSaved] = useState(false);

  const save = () => {
    const entry = { ...item, id: uuid(), savedAt: new Date().toISOString() };
    if (boardId === 'new' || !moodboards.some((board) => board.id === boardId)) {
      const title = name.trim() || (item.category ? `${item.category} ideas` : 'My inspirations');
      saveMoodboard({ id: uuid(), name: title, title, eventType: item.category || 'Wedding', coverImage: item.cover || '', palette: [], colors: [], note: '', notes: '', designIds: [], scenes: [], inspirations: [], items: [entry], palettes: [], isFavorite: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    } else {
      const board = moodboards.find((current) => current.id === boardId);
      const duplicate = (board.items ?? []).some((saved) => saved.type === item.type && ((item.templateId && saved.templateId === item.templateId) || (item.elementId && saved.elementId === item.elementId)));
      if (duplicate) { setSaved(true); setOpen(false); return; }
      saveMoodboard({ ...board, items: [...(board.items ?? []), entry], updatedAt: new Date().toISOString() });
    }
    setSaved(true);
    setOpen(false);
  };

  return <>
    <Button type="button" variant="secondary" size="sm" className={className} onClick={(event) => { event.stopPropagation(); setSaved(false); setBoardId(moodboards[0]?.id ?? 'new'); setOpen(true); }}><Plus className="h-3.5 w-3.5" />{saved ? 'Saved' : 'Save to Moodboard'}</Button>
    <span onClick={(event) => event.stopPropagation()}>{createPortal(<Modal open={open} onClose={() => setOpen(false)} title="Save to Moodboard" size="sm" footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save}>Save inspiration</Button></>}>
      <div className="grid gap-3 text-sm">
        <label className="grid gap-1 text-xs font-medium text-charcoal/70">Choose a collection<select className="rounded-lg border border-sage/40 bg-white px-3 py-2" value={boardId} onChange={(event) => setBoardId(event.target.value)}><option value="new">Create a new moodboard</option>{moodboards.map((board) => <option key={board.id} value={board.id}>{board.name ?? board.title}</option>)}</select></label>
        {boardId === 'new' && <label className="grid gap-1 text-xs font-medium text-charcoal/70">New moodboard name<input className="rounded-lg border border-sage/40 bg-white px-3 py-2" value={name} onChange={(event) => setName(event.target.value)} placeholder={item.category ? `${item.category} ideas` : 'My inspirations'} /></label>}
        <p className="text-xs text-charcoal/55">{item.title} will be saved as a reference. The catalogue item remains unchanged.</p>
      </div>
    </Modal>, document.body)}</span>
  </>;
}
