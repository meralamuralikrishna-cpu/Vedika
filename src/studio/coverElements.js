import { componentsById, sceneById } from '../assets/vedika-cover-assets/src/components/index.js';

export function isCoverComponent(element) {
  return Boolean(componentsById[element.type]);
}

export function coverElementName(element) {
  return componentsById[element.type]?.label ?? sceneById[element.type]?.label ?? element.type;
}

export function coverElementBounds(element) {
  if (isCoverComponent(element)) {
    const sx = (element.s ?? 1) * (element.sx ?? 1);
    const sy = (element.s ?? 1) * (element.sy ?? 1);
    return { x: (element.x ?? 200) - 200 * sx, y: (element.y ?? 200) - 200 * sy, w: 400 * sx, h: 400 * sy };
  }
  const points = element.points ?? element.items;
  if (Array.isArray(points) && points.length && Array.isArray(points[0])) {
    const coords = element.type === 'stars' ? points.map(([x, y, r]) => [[x - r, y - r], [x + r, y + r]]).flat() : points;
    const xs = coords.map((point) => Number(point[0]));
    const ys = coords.map((point) => Number(point[1]));
    return boundsFrom(xs, ys);
  }
  if (element.type === 'rect' || element.type === 'bg') return { x: element.x ?? 0, y: element.y ?? 0, w: element.w ?? 100, h: element.h ?? 100 };
  if (element.type === 'circle') return { x: element.cx - element.r, y: element.cy - element.r, w: element.r * 2, h: element.r * 2 };
  if (element.type === 'ellipse') return { x: element.cx - element.rx, y: element.cy - element.ry, w: element.rx * 2, h: element.ry * 2 };
  if (element.type === 'line') return boundsFrom([element.x1, element.x2], [element.y1, element.y2], Math.max(4, element.w ?? 2));
  const scalars = Object.entries(element).filter(([key, value]) => ['x', 'x0', 'x1', 'cx', 'cx1', 'cx2'].includes(key) && Number.isFinite(value));
  const ys = Object.entries(element).filter(([key, value]) => ['y', 'y0', 'y1', 'cy', 'cy1', 'cy2', 'baseY', 'topY'].includes(key) && Number.isFinite(value));
  if (scalars.length && ys.length) return boundsFrom(scalars.map(([, v]) => v), ys.map(([, v]) => v), 48);
  const nums = (element.d ?? '').match(/-?(?:\d*\.)?\d+/g)?.map(Number) ?? [];
  return nums.length >= 4 ? boundsFrom(nums.filter((_, i) => i % 2 === 0), nums.filter((_, i) => i % 2 === 1), 24) : { x: 0, y: 0, w: 1200, h: 800 };
}

function boundsFrom(xs, ys, pad = 0) {
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  return { x: minX - pad, y: minY - pad, w: Math.max(1, maxX - minX + pad * 2), h: Math.max(1, maxY - minY + pad * 2) };
}

function translatePath(path, dx, dy) {
  const tokens = path.match(/[a-zA-Z]|-?(?:\d*\.)?\d+(?:e[-+]?\d+)?/gi) ?? [];
  const arity = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 };
  let command = '', index = 0;
  const out = [];
  while (index < tokens.length) {
    if (/^[a-z]$/i.test(tokens[index])) { command = tokens[index++]; out.push(command); if (command.toUpperCase() === 'Z') continue; }
    const count = arity[command.toUpperCase()];
    if (!count || index + count > tokens.length) { out.push(tokens[index++]); continue; }
    const relative = command === command.toLowerCase();
    const values = tokens.slice(index, index + count).map(Number);
    index += count;
    if (!relative) {
      if (command.toUpperCase() === 'H') values[0] += dx;
      else if (command.toUpperCase() === 'V') values[0] += dy;
      else if (command.toUpperCase() === 'A') { values[5] += dx; values[6] += dy; }
      else for (let i = 0; i < values.length; i += 2) { values[i] += dx; values[i + 1] += dy; }
    }
    out.push(...values.map((value) => Number(value.toFixed(3))));
    if (command.toUpperCase() === 'M') command = relative ? 'l' : 'L';
  }
  return out.join(' ');
}

export function moveCoverElement(element, dx, dy) {
  if (isCoverComponent(element)) return { ...element, x: (element.x ?? 200) + dx, y: (element.y ?? 200) + dy };
  const next = { ...element };
  const add = (key, delta) => { if (Number.isFinite(next[key])) next[key] += delta; };
  switch (element.type) {
    case 'bg': case 'rect': add('x', dx); add('y', dy); break;
    case 'circle': case 'ellipse': add('cx', dx); add('cy', dy); break;
    case 'poly': next.points = element.points.map(([x, y]) => [x + dx, y + dy]); break;
    case 'line': add('x1', dx); add('x2', dx); add('y1', dy); add('y2', dy); break;
    case 'stars': next.items = element.items.map(([x, y, r]) => [x + dx, y + dy, r]); break;
    case 'dotRow': add('x0', dx); add('x1', dx); add('y', dy); break;
    case 'ringGarland': add('cx', dx); add('cy', dy); break;
    case 'swagGarland': add('x0', dx); add('x1', dx); add('baseY', dy); add('peakX', dx); break;
    case 'gate': add('x0', dx); add('x1', dx); add('topY', dy); add('baseY', dy); break;
    case 'scallops': add('x0', dx); add('x1', dx); add('y', dy); break;
    case 'strand': add('x', dx); add('y0', dy); add('y1', dy); break;
    case 'path': next.d = translatePath(element.d, dx, dy); break;
    default: add('x', dx); add('y', dy);
  }
  return next;
}
