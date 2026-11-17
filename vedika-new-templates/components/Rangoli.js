import { W, H, FLOOR_Y, f } from "./shared.js";

// Element: rangoli. Takes the element props, returns an SVG fragment string.
export const rangoli = (e) => {
    let s = "";
    e.colors.forEach((c, i) => {
      const r = e.r * (1 - i / e.colors.length);
      s += `<circle cx="${e.x}" cy="${e.y}" r="${f(r)}" fill="${c}"/>`;
    });
    for (let i = 0; i < 8; i++) {
      const a = (Math.PI * 2 * i) / 8;
      s += `<circle cx="${f(e.x + e.r * 0.62 * Math.cos(a))}" cy="${f(e.y + e.r * 0.62 * Math.sin(a))}" r="${f(e.r * 0.12)}" fill="#fff" opacity=".7"/>`;
    }
    return s;
  };

export default rangoli;
