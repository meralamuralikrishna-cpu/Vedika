import { W, H, FLOOR_Y, f } from "./shared.js";

// Element: swing. Takes the element props, returns an SVG fragment string.
export const swing = (e) =>
    `<rect x="${e.x}" y="${e.y}" width="${e.w}" height="5" fill="${e.frame}"/>` +
    `<rect x="${e.x}" y="${e.y}" width="5" height="${e.h}" fill="${e.frame}"/>` +
    `<rect x="${e.x + e.w - 5}" y="${e.y}" width="5" height="${e.h}" fill="${e.frame}"/>` +
    `<line x1="${e.x + e.w * 0.3}" y1="${e.y + 5}" x2="${e.x + e.w * 0.3}" y2="${e.y + e.h * 0.7}" stroke="${e.rope}" stroke-width="2"/>` +
    `<line x1="${e.x + e.w * 0.7}" y1="${e.y + 5}" x2="${e.x + e.w * 0.7}" y2="${e.y + e.h * 0.7}" stroke="${e.rope}" stroke-width="2"/>` +
    `<rect x="${e.x + e.w * 0.24}" y="${e.y + e.h * 0.7}" width="${e.w * 0.52}" height="7" rx="3" fill="${e.seat}"/>`;

export default swing;
