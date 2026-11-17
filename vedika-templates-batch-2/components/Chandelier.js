import { W, H, FLOOR_Y, f } from "./shared.js";

// Element: chandelier. Takes the element props, returns an SVG fragment string.
export const chandelier = (e) =>
    `<line x1="${e.x}" y1="0" x2="${e.x}" y2="${e.y}" stroke="${e.color}"/>` +
    `<path d="M${e.x - 16} ${e.y + 18} Q${e.x} ${e.y - 4} ${e.x + 16} ${e.y + 18} Z" fill="${e.color}"/>` +
    [-12, -4, 4, 12].map((d) => `<line x1="${e.x + d}" y1="${e.y + 18}" x2="${e.x + d}" y2="${e.y + 28}" stroke="${e.color}"/><circle cx="${e.x + d}" cy="${e.y + 30}" r="2" fill="#ffe9a8"/>`).join("");

export default chandelier;
