import { W, H, FLOOR_Y, f } from "./shared.js";

// Element: backdrop. Takes the element props, returns an SVG fragment string.
export const backdrop = (e) =>
    `<rect width="${W}" height="${FLOOR_Y}" fill="${e.fill}"/>` +
    `<rect y="${FLOOR_Y}" width="${W}" height="${H - FLOOR_Y}" fill="${e.floor}"/>` +
    `<rect y="${FLOOR_Y}" width="${W}" height="2" fill="${e.trim || "#ffffff"}" opacity=".35"/>`;

export default backdrop;
