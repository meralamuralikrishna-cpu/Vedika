import { W, H, FLOOR_Y, f } from "./shared.js";

// Element: lights. Takes the element props, returns an SVG fragment string.
export const lights = (e) => {
    let s = "";
    for (let i = 0; i < e.count; i++) {
      const t = i / (e.count - 1), x = 8 + t * (W - 16);
      const y = e.y + Math.sin(t * Math.PI) * (e.sag || 10);
      s += `<circle cx="${f(x)}" cy="${f(y)}" r="3" fill="${e.color}"/><circle cx="${f(x)}" cy="${f(y)}" r="6" fill="${e.color}" opacity=".25"/>`;
    }
    return s;
  };

export default lights;
