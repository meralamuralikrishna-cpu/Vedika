// Draws a template cover (400x300 SVG) from its `elements` list,
// using the component registry in ./components.
import { components, W, H, FLOOR_Y } from "./components/index.js";

export { W, H, FLOOR_Y };

export function renderElement(el) {
  const draw = components[el.type];
  return draw ? `<g data-id="${el.id}" data-type="${el.type}">${draw(el)}</g>` : "";
}

export function renderCover(template) {
  const body = template.elements.map(renderElement).join("\n");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${template.name}">\n${body}\n</svg>`;
}

export const ELEMENT_TYPES = Object.keys(components);
