import { W, H, FLOOR_Y, f } from "./shared.js";

// Element: sea.
export const sea = (e) => {
  let s = "";
  e.colors.forEach((c, i) => {
    const y = e.y + i * ((FLOOR_Y - e.y) / e.colors.length);
    s += `<rect y="${f(y)}" width="${W}" height="${f((FLOOR_Y - e.y) / e.colors.length + 1)}" fill="${c}"/>`;
  });
  return s + (e.sun ? `<circle cx="${e.sun.x}" cy="${e.sun.y}" r="${e.sun.r}" fill="${e.sun.color}"/>` : "");
};

export default sea;
