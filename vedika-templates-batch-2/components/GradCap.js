import { W, H, FLOOR_Y, f } from "./shared.js";

// Element: gradCap.
export const gradCap = (e) =>
  `<polygon points="${e.x},${e.y} ${e.x + 38},${e.y + 12} ${e.x},${e.y + 24} ${e.x - 38},${e.y + 12}" fill="${e.color}"/>` +
  `<path d="M${e.x - 20} ${e.y + 20} v14 q20 10 40 0 v-14 l-20 8 z" fill="${e.color}" opacity=".85"/>` +
  `<line x1="${e.x + 30}" y1="${e.y + 14}" x2="${e.x + 30}" y2="${e.y + 36}" stroke="${e.tassel}" stroke-width="2"/><circle cx="${e.x + 30}" cy="${e.y + 38}" r="3" fill="${e.tassel}"/>`;

export default gradCap;
