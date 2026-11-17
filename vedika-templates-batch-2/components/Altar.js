import { W, H, FLOOR_Y, f } from "./shared.js";

// Element: altar.
export const altar = (e) => {
  const cx = e.x + e.w / 2;
  return (
    `<rect x="${e.x}" y="${e.y}" width="${e.w}" height="14" rx="3" fill="${e.color}"/>` +
    `<rect x="${e.x + 8}" y="${e.y + 14}" width="${e.w - 16}" height="${f(FLOOR_Y - e.y - 14)}" fill="${e.cloth}"/>` +
    `<path d="M${cx - 12} ${e.y - 6} q12 -24 24 0 z" fill="#c98a2b"/>` +
    `<circle cx="${cx}" cy="${e.y - 26}" r="6" fill="#8b5a2b"/>` +
    [-14, 0, 14].map((d) => `<path d="M${cx + d} ${e.y - 32} q-6 -12 0 -16 q6 4 0 16" fill="#2e7d32"/>`).join("") +
    `<path d="M${e.x + 16} ${e.y} q6 8 12 0 z" fill="#b5651d"/><path d="M${e.x + e.w - 28} ${e.y} q6 8 12 0 z" fill="#b5651d"/>` +
    `<path d="M${e.x + 22} ${e.y - 3} q-3 -6 0 -10 q3 4 0 10" fill="#ffd166"/><path d="M${e.x + e.w - 22} ${e.y - 3} q-3 -6 0 -10 q3 4 0 10" fill="#ffd166"/>`
  );
};

export default altar;
