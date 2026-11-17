import { W, H, FLOOR_Y, f } from "./shared.js";

// Element: balloons. Takes the element props, returns an SVG fragment string.
export const balloons = (e) =>
    e.items
      .map(
        (b) =>
          `<line x1="${b.x}" y1="${b.y + 18}" x2="${b.x}" y2="${b.y + 50}" stroke="#ffffff" stroke-opacity=".6"/>` +
          `<ellipse cx="${b.x}" cy="${b.y}" rx="13" ry="17" fill="${b.color}"/><ellipse cx="${b.x - 4}" cy="${b.y - 6}" rx="3" ry="5" fill="#fff" opacity=".4"/>`
      )
      .join("");

export default balloons;
