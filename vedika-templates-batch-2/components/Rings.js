import { W, H, FLOOR_Y, f } from "./shared.js";

// Element: rings. Takes the element props, returns an SVG fragment string.
export const rings = (e) =>
    `<circle cx="${e.x - 6}" cy="${e.y}" r="8" fill="none" stroke="${e.color}" stroke-width="3"/><circle cx="${e.x + 6}" cy="${e.y}" r="8" fill="none" stroke="${e.color}" stroke-width="3"/>`;

export default rings;
