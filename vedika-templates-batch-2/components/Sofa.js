import { W, H, FLOOR_Y, f } from "./shared.js";

// Element: sofa. Takes the element props, returns an SVG fragment string.
export const sofa = (e) =>
    `<rect x="${e.x}" y="${e.y}" width="${e.w}" height="${e.w * 0.28}" rx="6" fill="${e.color}"/>` +
    `<rect x="${e.x - 6}" y="${e.y + e.w * 0.1}" width="10" height="${e.w * 0.28}" rx="4" fill="${e.color}"/>` +
    `<rect x="${e.x + e.w - 4}" y="${e.y + e.w * 0.1}" width="10" height="${e.w * 0.28}" rx="4" fill="${e.color}"/>`;

export default sofa;
