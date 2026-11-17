import { W, H, FLOOR_Y, f } from "./shared.js";

// Element: stage. Takes the element props, returns an SVG fragment string.
export const stage = (e) =>
    `<rect x="${e.x}" y="${e.y}" width="${e.w}" height="${e.h}" fill="${e.color}"/><rect x="${e.x}" y="${e.y}" width="${e.w}" height="3" fill="#fff" opacity=".3"/>`;

export default stage;
