import { W, H, FLOOR_Y, f } from "./shared.js";

// Element: tree.
export const tree = (e) => {
  const top = e.y - e.h, lw = e.h * 0.62;
  let s = `<rect x="${e.x - 5}" y="${e.y - 10}" width="10" height="12" fill="#6b3f1d"/>`;
  for (let i = 0; i < 3; i++) {
    const ty = top + i * e.h * 0.27, by = ty + e.h * 0.42, hw = (lw / 2) * (0.5 + i * 0.25);
    s += `<polygon points="${e.x},${f(ty)} ${f(e.x - hw)},${f(by)} ${f(e.x + hw)},${f(by)}" fill="${e.color}"/>`;
  }
  const dots = [[-12, 0.4], [10, 0.5], [-20, 0.7], [18, 0.72], [0, 0.6]];
  dots.forEach(([dx, t], i) => { s += `<circle cx="${e.x + dx}" cy="${f(top + e.h * t)}" r="3.5" fill="${e.trim[i % e.trim.length]}"/>`; });
  return s + `<polygon points="${[0,1,2,3,4,5,6,7,8,9].map((i) => { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? 3 : 8; return f(e.x + rr * Math.cos(a)) + "," + f(top - 2 + rr * Math.sin(a)); }).join(" ")}" fill="#ffd166"/>`;
};

export default tree;
