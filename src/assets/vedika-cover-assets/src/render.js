import { componentsById, sceneById } from "./components/index.js";
import { escapeAttr, f } from "./lib/helpers.js";

export const COVER_W = 1200;
export const COVER_H = 800;

const RESERVED = new Set(["id", "type", "x", "y", "s", "sx", "sy", "rot"]);

function makeCtx(prefix) {
  return { n: 0, uid(k) { return `${prefix}-${k}${this.n++}`; } };
}

// One cover element -> SVG. Components are placed by the centre of their 400x400 box
// (x, y), with uniform scale `s`, optional stretch sx/sy and rotation `rot`.
// Scene primitives (bg, rect, poly, ...) use absolute cover coordinates.
export function renderElement(el, ctx) {
  const sc = sceneById[el.type];
  if (sc) {
    const p = { ...sc.defaults, ...el };
    return `<g data-id="${escapeAttr(el.id)}" data-type="${escapeAttr(el.type)}">${sc.draw(p, ctx)}</g>`;
  }
  const c = componentsById[el.type];
  if (!c) return "";
  const p = { ...c.defaults };
  for (const [k, v] of Object.entries(el)) if (!RESERVED.has(k)) p[k] = v;
  const x = el.x ?? 200, y = el.y ?? 200, s = el.s ?? 1;
  const tf = `translate(${f(x)} ${f(y)}) rotate(${el.rot ?? 0}) scale(${f(s * (el.sx ?? 1))} ${f(s * (el.sy ?? 1))}) translate(-200 -200)`;
  return `<g data-id="${escapeAttr(el.id)}" data-type="${escapeAttr(el.type)}" transform="${tf}">${c.draw(p)}</g>`;
}

export function renderCoverInner(cover) {
  const ctx = makeCtx(cover.id);
  return cover.elements.map((el) => renderElement(el, ctx)).join("\n");
}

export function renderCoverSvg(cover) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${COVER_W} ${COVER_H}" width="${COVER_W}" height="${COVER_H}" role="img" aria-label="${cover.name.replace(/"/g, "&quot;")}">\n${renderCoverInner(cover)}\n</svg>\n`;
}

export function renderComponentSvg(def, overrides = {}) {
  const p = { ...def.defaults, ...overrides };
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400" role="img" aria-label="${def.label}">\n${def.draw(p)}\n</svg>\n`;
}
