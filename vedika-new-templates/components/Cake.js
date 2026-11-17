import { W, H, FLOOR_Y, f } from "./shared.js";

// Element: cake. Takes the element props, returns an SVG fragment string.
export const cake = (e) =>
    `<rect x="${e.x}" y="${e.y}" width="40" height="22" rx="3" fill="${e.color}"/><rect x="${e.x + 6}" y="${e.y - 14}" width="28" height="14" rx="3" fill="${e.top}"/>` +
    `<line x1="${e.x + 20}" y1="${e.y - 14}" x2="${e.x + 20}" y2="${e.y - 22}" stroke="#ffd166" stroke-width="2"/>`;

export default cake;
