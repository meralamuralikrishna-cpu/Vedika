import { W, H, FLOOR_Y, f } from "./shared.js";

// Element: lanterns. Takes the element props, returns an SVG fragment string.
export const lanterns = (e) =>
    e.items
      .map(
        (l) =>
          `<line x1="${l.x}" y1="0" x2="${l.x}" y2="${l.y}" stroke="${e.cord || "#ffffff"}" stroke-opacity=".5"/>` +
          `<rect x="${l.x - 10}" y="${l.y}" width="20" height="26" rx="8" fill="${l.color}"/><rect x="${l.x - 10}" y="${l.y + 11}" width="20" height="3" fill="#fff" opacity=".35"/>`
      )
      .join("");

export default lanterns;
