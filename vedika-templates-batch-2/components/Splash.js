import { W, H, FLOOR_Y, f } from "./shared.js";

// Element: splash.
export const splash = (e) =>
  e.items.map((b) => {
    let s = `<circle cx="${b.x}" cy="${b.y}" r="${b.r}" fill="${b.color}" opacity=".9"/>`;
    for (let i = 0; i < 6; i++) { const a = (Math.PI * 2 * i) / 6 + b.x; s += `<circle cx="${f(b.x + (b.r + 7) * Math.cos(a))}" cy="${f(b.y + (b.r + 7) * Math.sin(a))}" r="${f(b.r * 0.18)}" fill="${b.color}" opacity=".8"/>`; }
    return s;
  }).join("");

export default splash;
