import { W, H, FLOOR_Y, f } from "./shared.js";

// Element: snow.
export const snow = (e) => {
  let s = "";
  for (let i = 0; i < e.count; i++) s += `<circle cx="${(i * 97 + i * i * 13) % W}" cy="${(i * 53 + i * i * 29) % FLOOR_Y}" r="${f(1 + (i % 3) * 0.6)}" fill="#ffffff" opacity="${i % 2 ? 0.8 : 0.5}"/>`;
  return s;
};

export default snow;
