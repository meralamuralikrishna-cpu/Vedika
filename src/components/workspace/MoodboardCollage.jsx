import { useEffect, useMemo, useRef, useState } from 'react';
import { ExternalLink, Images, StickyNote, Trash2, X } from 'lucide-react';
import { v4 as uuid } from 'uuid';
import { Button } from '@/components/ui/Button';
import SceneView from '@/studio/SceneView';
import { clamp } from '@/lib/utils';
import { buildInspirationEntries, resolveMoodboardMedia, syncCollageTiles } from '@/lib/moodboard';

function CollageTile({ tile, entry, selected, boardId, onSelect, onChange, onCommit, onRemove }) {
  const modeRef = useRef(null);
  const pointerIdRef = useRef(null);
  const startRef = useRef({ mx: 0, my: 0, x: 0, y: 0, w: 0, h: 0 });
  const boardRef = useRef(null);
  const latestRef = useRef(tile);
  latestRef.current = tile;

  useEffect(() => () => {
    modeRef.current = null;
    pointerIdRef.current = null;
  }, []);

  const begin = (mode, event) => {
    event.preventDefault();
    event.stopPropagation();
    onSelect(tile.id);
    boardRef.current = event.currentTarget.closest('.mb-collage-board');
    modeRef.current = mode;
    pointerIdRef.current = event.pointerId;
    startRef.current = { mx: event.clientX, my: event.clientY, x: tile.x, y: tile.y, w: tile.w, h: tile.h };

    const onMove = (ev) => {
      if (modeRef.current == null || ev.pointerId !== pointerIdRef.current || !boardRef.current) return;
      const rect = boardRef.current.getBoundingClientRect();
      const dx = ((ev.clientX - startRef.current.mx) / rect.width) * 100;
      const dy = ((ev.clientY - startRef.current.my) / rect.height) * 100;
      let next = latestRef.current;
      if (modeRef.current === 'move') {
        next = {
          ...latestRef.current,
          x: clamp(startRef.current.x + dx, 0, 100 - latestRef.current.w),
          y: clamp(startRef.current.y + dy, 0, 100 - latestRef.current.h),
          z: Math.max(latestRef.current.z ?? 1, 50),
        };
      } else if (modeRef.current === 'resize') {
        next = {
          ...latestRef.current,
          w: clamp(startRef.current.w + dx, 14, 100 - latestRef.current.x),
          h: clamp(startRef.current.h + dy, 14, 100 - latestRef.current.y),
          z: Math.max(latestRef.current.z ?? 1, 50),
        };
      }
      latestRef.current = next;
      onChange(next);
    };

    const onUp = () => {
      modeRef.current = null;
      pointerIdRef.current = null;
      onCommit?.(latestRef.current);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  };

  if (tile.kind === 'note') {
    return (
      <article
        className={`mb-collage-tile mb-collage-note${selected ? ' is-selected' : ''}`}
        style={{ left: `${tile.x}%`, top: `${tile.y}%`, width: `${tile.w}%`, height: `${tile.h}%`, zIndex: selected ? 80 : tile.z }}
        onPointerDown={(event) => begin('move', event)}
        onClick={(event) => { event.stopPropagation(); onSelect(tile.id); }}
      >
        <StickyNote size={14} />
        <textarea
          value={tile.pinNote ?? ''}
          placeholder="Pin a note…"
          onPointerDown={(event) => event.stopPropagation()}
          onChange={(event) => {
            const next = { ...tile, pinNote: event.target.value };
            onChange(next);
            onCommit?.(next);
          }}
        />
        {selected && (
          <>
            <button type="button" className="mb-collage-delete" aria-label="Remove note" onClick={(event) => { event.stopPropagation(); onRemove(tile); }}><Trash2 size={12} /></button>
            <button type="button" className="mb-collage-resize" aria-label="Resize note" onPointerDown={(event) => begin('resize', event)} />
          </>
        )}
      </article>
    );
  }

  if (!entry) return null;

  const cover = entry.type === 'image' && entry.item?.src
    ? entry.item.src
    : entry.cover
      ? resolveMoodboardMedia(entry.cover)
      : '';

  return (
    <article
      className={`mb-collage-tile${selected ? ' is-selected' : ''}`}
      style={{ left: `${tile.x}%`, top: `${tile.y}%`, width: `${tile.w}%`, height: `${tile.h}%`, zIndex: selected ? 80 : tile.z }}
      onPointerDown={(event) => begin('move', event)}
      onClick={(event) => { event.stopPropagation(); onSelect(tile.id); }}
    >
      <div className="mb-collage-tile-media">
        {entry.scene ? (
          <SceneView scene={entry.scene} uid={`collage-${boardId}-${tile.id}`} aria-hidden="true" />
        ) : cover ? (
          <img src={cover} alt="" draggable={false} />
        ) : entry.color ? (
          <span className="mb-collage-swatch" style={{ backgroundColor: entry.color }} />
        ) : (
          <div className="mb-cover-placeholder"><Images size={18} /></div>
        )}
      </div>
      <span className="mb-collage-badge">{entry.badge}</span>
      {tile.pinNote ? <p className="mb-collage-pin">{tile.pinNote}</p> : null}
      {selected && (
        <>
          <button type="button" className="mb-collage-delete" aria-label={`Remove ${entry.title}`} onClick={(event) => { event.stopPropagation(); onRemove(tile, entry); }}><Trash2 size={12} /></button>
          {entry.kind === 'design' && entry.refId && (
            <a className="mb-collage-open" href={`/studio?design=${encodeURIComponent(entry.refId)}`} aria-label={`Open ${entry.title} in Studio`} onPointerDown={(event) => event.stopPropagation()} onClick={(event) => event.stopPropagation()}>
              <ExternalLink size={12} />
            </a>
          )}
          <button type="button" className="mb-collage-resize" aria-label={`Resize ${entry.title}`} onPointerDown={(event) => begin('resize', event)} />
        </>
      )}
    </article>
  );
}

export default function MoodboardCollage({ board, designs, onUpdateTiles, onRemoveEntry, onSetCover, coverImage }) {
  const entries = useMemo(() => buildInspirationEntries(board, designs), [board, designs]);
  const entryById = useMemo(() => new Map(entries.map((entry) => [entry.id, entry])), [entries]);
  const synced = useMemo(() => syncCollageTiles(board, designs), [board, designs]);
  const [tiles, setTiles] = useState(synced);
  const [selectedId, setSelectedId] = useState(null);
  const selected = tiles.find((tile) => tile.id === selectedId) ?? null;
  const selectedEntry = selected ? entryById.get(selected.id) : null;
  const persistRef = useRef(onUpdateTiles);
  persistRef.current = onUpdateTiles;

  useEffect(() => {
    setTiles(synced);
    const currentIds = (board.collage?.tiles ?? []).map((tile) => tile.id).join('|');
    const nextIds = synced.map((tile) => tile.id).join('|');
    if (currentIds !== nextIds) persistRef.current(synced);
  }, [synced, board.collage?.tiles]);

  const persist = (next) => {
    setTiles(next);
    onUpdateTiles(next);
  };

  const patchLocal = (nextTile) => {
    setTiles((current) => current.map((tile) => (tile.id === nextTile.id ? nextTile : tile)));
  };

  const commitTile = (nextTile) => {
    setTiles((current) => {
      const next = current.map((tile) => (tile.id === nextTile.id ? nextTile : tile));
      onUpdateTiles(next);
      return next;
    });
  };

  const addNote = () => {
    const note = {
      id: `note-${uuid()}`,
      kind: 'note',
      refId: null,
      x: 34,
      y: 36,
      w: 24,
      h: 22,
      z: tiles.length + 2,
      pinNote: '',
    };
    persist([...tiles, note]);
    setSelectedId(note.id);
  };

  const removeTile = (tile, entry) => {
    const next = tiles.filter((item) => item.id !== tile.id);
    persist(next);
    if (tile.kind !== 'note') onRemoveEntry?.(tile, entry);
    if (selectedId === tile.id) setSelectedId(null);
  };

  return (
    <div className="mb-collage">
      <div className="mb-collage-toolbar">
        <div>
          <span className="mb-eyebrow">Collage canvas</span>
          <p>Drag to arrange · resize from the corner · pin notes on tiles</p>
        </div>
        <div className="mb-collage-toolbar-actions">
          <Button size="sm" variant="secondary" onClick={addNote}><StickyNote size={13} />Pin note</Button>
          {selectedEntry && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                if (selectedEntry.type === 'image' && selectedEntry.item?.src) onSetCover?.(selectedEntry.item.src);
                else if (selectedEntry.cover) onSetCover?.(selectedEntry.cover);
              }}
            >
              Use as cover
            </Button>
          )}
          {coverImage && <Button size="sm" variant="secondary" onClick={() => onSetCover?.('')}>Auto mosaic cover</Button>}
        </div>
      </div>

      <div className="mb-collage-board" onClick={() => setSelectedId(null)}>
        {tiles.length === 0 && (
          <div className="mb-collage-empty">
            <Images size={26} />
            <p>Upload a photo, add an element, or link a Studio design to start the collage.</p>
          </div>
        )}
        {tiles.map((tile) => (
          <CollageTile
            key={tile.id}
            tile={tile}
            entry={entryById.get(tile.id)}
            selected={selectedId === tile.id}
            boardId={board.id}
            onSelect={setSelectedId}
            onChange={patchLocal}
            onCommit={commitTile}
            onRemove={removeTile}
          />
        ))}
      </div>

      {selected && selected.kind !== 'note' && (
        <div className="mb-collage-inspector">
          <div>
            <strong>{selectedEntry?.title ?? 'Tile'}</strong>
            <small>{selectedEntry?.badge ?? 'Inspiration'}</small>
          </div>
          <label>
            Pin note
            <input
              value={selected.pinNote ?? ''}
              maxLength={120}
              placeholder="Quick reminder on this tile…"
              onChange={(event) => commitTile({ ...selected, pinNote: event.target.value })}
            />
          </label>
          <button type="button" aria-label="Close tile details" onClick={() => setSelectedId(null)}><X size={14} /></button>
        </div>
      )}
    </div>
  );
}
