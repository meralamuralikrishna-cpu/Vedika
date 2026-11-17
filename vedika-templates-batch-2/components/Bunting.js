import { W, H, FLOOR_Y, f } from "./shared.js";

// Element: bunting.
export const bunting = (e) => {
  let s = "";
  for (let i = 0; i < e.count; i++) {
    const t = (i + 0.5) / e.count, x = t * W, y = e.y + Math.sin(t * Math.PI) * (e.sag || 14);
    s += `<polygon points="${f(x - 9)},${f(y)} ${f(x + 9)},${f(y)} ${f(x)},${f(y + 20)}" fill="${e.colors[i % e.colors.length]}"/>`;
  }
  return `<path d="M0 ${e.y} Q${W / 2} ${e.y + (e.sag || 14) * 2} ${W} ${e.y}" fill="none" stroke="#ffffff" stroke-opacity=".6"/>` + s;
};

export default bunting;
