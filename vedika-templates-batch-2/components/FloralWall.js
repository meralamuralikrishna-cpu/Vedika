import { W, H, FLOOR_Y, f } from "./shared.js";

// Element: floralWall. Takes the element props, returns an SVG fragment string.
export const floralWall = (e) => {
    let s = `<rect x="${e.x}" y="${e.y}" width="${e.w}" height="${e.h}" fill="${e.base || "#2f3b2f"}"/>`;
    const step = e.r * 1.8;
    let row = 0;
    for (let y = e.y + e.r; y < e.y + e.h; y += step * 0.9, row++)
      for (let x = e.x + e.r + (row % 2 ? step / 2 : 0); x < e.x + e.w - e.r / 2; x += step) {
        const c = e.colors[(Math.floor(x / step) + row) % e.colors.length];
        s += `<circle cx="${f(x)}" cy="${f(y)}" r="${e.r}" fill="${c}"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(e.r * 0.35)}" fill="#fff" opacity=".35"/>`;
      }
    return s;
  };

export default floralWall;
