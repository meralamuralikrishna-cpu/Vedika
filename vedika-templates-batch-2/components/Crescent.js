import { W, H, FLOOR_Y, f } from "./shared.js";

// Element: crescent.
export const crescent = (e) =>
  `<circle cx="${e.x}" cy="${e.y}" r="${e.r}" fill="${e.color}"/>` +
  `<circle cx="${f(e.x + e.r * 0.42)}" cy="${f(e.y - e.r * 0.12)}" r="${f(e.r * 0.86)}" fill="${e.cut}"/>` +
  `<polygon points="${[0,1,2,3,4,5,6,7,8,9].map((i) => { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? e.r * 0.14 : e.r * 0.34; return f(e.x + e.r * 1.5 + rr * Math.cos(a)) + "," + f(e.y - e.r * 0.2 + rr * Math.sin(a)); }).join(" ")}" fill="${e.color}"/>`;

export default crescent;
