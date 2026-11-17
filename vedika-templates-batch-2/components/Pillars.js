import { W, H, FLOOR_Y, f } from "./shared.js";

// Element: pillars. Takes the element props, returns an SVG fragment string.
export const pillars = (e) =>
    e.xs
      .map(
        (x) =>
          `<rect x="${x}" y="${e.y}" width="12" height="${e.h}" fill="${e.color}"/><rect x="${x - 3}" y="${e.y}" width="18" height="6" fill="${e.cap || e.color}"/>`
      )
      .join("");

export default pillars;
