import { W, H, FLOOR_Y, f } from "./shared.js";

// Element: mandap. Takes the element props, returns an SVG fragment string.
export const mandap = (e) => {
    const { x, y, w, h } = e;
    return (
      `<rect x="${x}" y="${y + h * 0.22}" width="${w}" height="${h * 0.7}" fill="${e.inner || "#00000022"}"/>` +
      `<path d="M${x - 10} ${y + h * 0.24} L${x + w / 2} ${y} L${x + w + 10} ${y + h * 0.24} Z" fill="${e.roof}"/>` +
      [x, x + w - 7].map((px) => `<rect x="${px}" y="${y + h * 0.24}" width="7" height="${h * 0.76}" fill="${e.pillar}"/>`).join("") +
      `<rect x="${x + w * 0.3}" y="${y + h * 0.86}" width="${w * 0.4}" height="${h * 0.14}" rx="3" fill="${e.seat || "#c0392b"}"/>`
    );
  };

export default mandap;
