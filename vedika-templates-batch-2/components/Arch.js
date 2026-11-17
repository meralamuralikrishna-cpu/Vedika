import { W, H, FLOOR_Y, f } from "./shared.js";

// Element: arch. Takes the element props, returns an SVG fragment string.
export const arch = (e) => {
    const cx = e.x + e.w / 2, r = e.w / 2, top = e.y + r;
    let s = `<path d="M${e.x} ${e.y + e.h} V${top} A${r} ${r} 0 0 1 ${e.x + e.w} ${top} V${e.y + e.h}" fill="none" stroke="${e.color}" stroke-width="${e.thick || 9}" stroke-linecap="round"/>`;
    if (e.bloom)
      for (let i = 0; i <= 12; i++) {
        const a = Math.PI + (Math.PI * i) / 12;
        s += `<circle cx="${f(cx + r * Math.cos(a))}" cy="${f(top + r * Math.sin(a))}" r="6" fill="${e.bloom}"/>`;
      }
    return s;
  };

export default arch;
