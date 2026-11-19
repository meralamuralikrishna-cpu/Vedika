import { resolveTemplateCover } from '@/data/templateCovers';
import { templates } from '@/data/templates';

const SLOT_PRESETS = [
  { x: 3, y: 5, w: 40, h: 52 },
  { x: 42, y: 3, w: 34, h: 40 },
  { x: 55, y: 28, w: 40, h: 50 },
  { x: 6, y: 50, w: 38, h: 42 },
  { x: 44, y: 56, w: 32, h: 36 },
  { x: 22, y: 22, w: 30, h: 34 },
  { x: 68, y: 8, w: 28, h: 32 },
  { x: 10, y: 12, w: 26, h: 28 },
];

export function resolveMoodboardMedia(value) {
  if (!value) return '';
  const raw = String(value);
  if (raw.startsWith('data:') || raw.startsWith('blob:') || raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('/')) {
    return raw;
  }
  return resolveTemplateCover(raw);
}

export function buildInspirationEntries(board, designs = []) {
  const entries = [];
  const linked = designs.filter((design) => (board.designIds ?? []).includes(design.id));

  for (const design of linked) {
    entries.push({
      id: `design-${design.id}`,
      kind: 'design',
      type: 'design',
      badge: 'Design',
      title: design.name,
      design,
      scene: design.scene,
      cover: design.coverImage,
      refId: design.id,
    });
  }

  for (const idea of board.inspirations ?? []) {
    entries.push({
      id: idea.id,
      kind: 'inspiration',
      type: 'template',
      badge: 'Template',
      title: idea.title,
      cover: idea.image,
      refId: idea.id,
      idea,
    });
  }

  for (const item of board.items ?? []) {
    const template = item.templateId ? templates.find((entry) => entry.id === item.templateId) : null;
    entries.push({
      id: item.id,
      kind: 'item',
      type: item.type || 'item',
      badge: item.type === 'image' ? 'Photo' : item.type === 'element' ? 'Element' : 'Template',
      title: item.title,
      item,
      scene: item.scene ?? template?.scene,
      cover: item.type === 'image' ? item.src : item.cover ?? template?.cover,
      color: item.color,
      refId: item.id,
    });
  }

  return entries;
}

export function collectMosaicTiles(board, designs = [], limit = 4) {
  const tiles = [];
  for (const entry of buildInspirationEntries(board, designs)) {
    if (tiles.length >= limit) break;
    if (entry.scene) {
      tiles.push({ key: entry.id, mode: 'scene', scene: entry.scene, title: entry.title });
      continue;
    }
    if (entry.type === 'image' && entry.item?.src) {
      tiles.push({ key: entry.id, mode: 'image', src: entry.item.src, title: entry.title });
      continue;
    }
    if (entry.cover) {
      tiles.push({ key: entry.id, mode: 'image', src: resolveMoodboardMedia(entry.cover), title: entry.title });
      continue;
    }
    if (entry.type === 'element' && entry.color) {
      tiles.push({ key: entry.id, mode: 'swatch', color: entry.color, title: entry.title });
    }
  }
  return tiles;
}

function nextSlot(index) {
  const preset = SLOT_PRESETS[index % SLOT_PRESETS.length];
  const wave = Math.floor(index / SLOT_PRESETS.length);
  return {
    x: Math.min(72, preset.x + ((wave * 5) % 12)),
    y: Math.min(68, preset.y + wave * 10),
    w: preset.w,
    h: preset.h,
  };
}

export function syncCollageTiles(board, designs = []) {
  const entries = buildInspirationEntries(board, designs);
  const existing = board.collage?.tiles ?? [];
  const byId = new Map(existing.map((tile) => [tile.id, tile]));
  const next = [];

  entries.forEach((entry, index) => {
    const prev = byId.get(entry.id);
    if (prev) {
      next.push(prev);
      return;
    }
    const slot = nextSlot(index);
    next.push({
      id: entry.id,
      kind: entry.kind === 'design' ? 'design' : entry.kind === 'inspiration' ? 'inspiration' : 'item',
      refId: entry.refId,
      x: slot.x,
      y: slot.y,
      w: slot.w,
      h: slot.h,
      z: index + 1,
      pinNote: '',
    });
  });

  for (const tile of existing) {
    if (tile.kind === 'note' && !next.some((entry) => entry.id === tile.id)) next.push(tile);
  }

  return next;
}

export function entryCoverValue(entry) {
  if (!entry) return '';
  if (entry.type === 'image' && entry.item?.src) return entry.item.src;
  if (entry.cover) return entry.cover;
  return '';
}
