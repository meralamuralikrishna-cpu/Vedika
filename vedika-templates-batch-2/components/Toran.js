import { W, H, FLOOR_Y, f } from "./shared.js";

// Element: toran. Takes the element props, returns an SVG fragment string.
export const toran = (e) => {
    let s = `<rect x="${e.x}" y="${e.y}" width="${e.w}" height="5" fill="${e.rail || "#6b3f1d"}"/>`;
    for (let i = 0; i < e.count; i++) {
      const x = e.x + 10 + (i * (e.w - 20)) / (e.count - 1);
      const len = 22 + (i % 2) * 12;
      s += `<line x1="${f(x)}" y1="${e.y + 5}" x2="${f(x)}" y2="${e.y + 5 + len}" stroke="#2e7d32" stroke-width="2"/>`;
      for (let k = 0; k < 3; k++)
        s += `<circle cx="${f(x)}" cy="${e.y + 9 + (k * len) / 3}" r="4.5" fill="${e.colors[(i + k) % e.colors.length]}"/>`;
    }
    return s;
  };

export default toran;
