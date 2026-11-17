import { W, H, FLOOR_Y, f } from "./shared.js";

// Element: cradle. Takes the element props, returns an SVG fragment string.
export const cradle = (e) =>
    `<line x1="${e.x}" y1="${e.y - 60}" x2="${e.x}" y2="${e.y}" stroke="${e.rope}" stroke-width="2"/>` +
    `<line x1="${e.x + e.w}" y1="${e.y - 60}" x2="${e.x + e.w}" y2="${e.y}" stroke="${e.rope}" stroke-width="2"/>` +
    `<path d="M${e.x - 6} ${e.y} H${e.x + e.w + 6} Q${e.x + e.w} ${e.y + 26} ${e.x + e.w / 2} ${e.y + 28} Q${e.x} ${e.y + 26} ${e.x - 6} ${e.y} Z" fill="${e.color}"/>` +
    `<path d="M${e.x - 2} ${e.y - 4} Q${e.x + e.w / 2} ${e.y + 10} ${e.x + e.w + 2} ${e.y - 4}" fill="none" stroke="#fff" stroke-width="3" opacity=".7"/>`;

export default cradle;
