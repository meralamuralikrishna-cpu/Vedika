import { W, H, FLOOR_Y, f } from "./shared.js";

// Element: curtain. Takes the element props, returns an SVG fragment string.
export const curtain = (e) => {
    const x = e.side === "left" ? 0 : W - 62;
    let folds = "";
    for (let i = 1; i < 4; i++)
      folds += `<rect x="${x + i * 15}" y="0" width="3" height="${FLOOR_Y}" fill="#000" opacity=".16"/>`;
    return `<rect x="${x}" y="0" width="62" height="${FLOOR_Y}" fill="${e.color}"/>` + folds;
  };

export default curtain;
