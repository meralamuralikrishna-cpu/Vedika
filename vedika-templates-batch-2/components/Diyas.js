import { W, H, FLOOR_Y, f } from "./shared.js";

// Element: diyas. Takes the element props, returns an SVG fragment string.
export const diyas = (e) => {
    let s = "";
    for (let i = 0; i < e.count; i++) {
      const x = e.x + (i * e.w) / (e.count - 1);
      s += `<path d="M${f(x - 7)} ${e.y} q7 9 14 0 z" fill="${e.color}"/><path d="M${f(x)} ${e.y - 3} q-4 -6 0 -11 q4 5 0 11" fill="#ffd166"/>`;
    }
    return s;
  };

export default diyas;
