import { circle, ellipse, rect, poly, path, line, rad } from "../lib/helpers.js";

export const props = [
  {
    id: "kalash",
    label: "Kalash",
    defaults: { body: "#d9a441", collar: "#bd8a2f", ball: "#8fa86b", top: "#f7b82a", ballR: 44 },
    draw: (p) =>
      path("M140 140 L260 140 C 285 190 285 250 240 320 L160 320 C 115 250 115 190 140 140 Z", { fill: p.body }) +
      rect(160, 120, 80, 28, p.collar, { rx: 4 }) +
      circle(200, 134 - p.ballR, p.ballR, p.ball) +
      (p.top ? circle(200, 104 - p.ballR, p.ballR * 0.45, p.top) : ""),
  },
  {
    id: "urli-bowl",
    label: "Urli bowl",
    defaults: { bowl: "#c98741", rim: "#e6a95c", fruit: "#f0861c" },
    draw: (p) =>
      path("M40 200 Q200 380 360 200 Z", { fill: p.bowl }) +
      ellipse(200, 200, 160, 24, p.rim) +
      [120, 160, 200, 240, 280].map((x) => circle(x, 196, 16, p.fruit)).join(""),
  },
  {
    id: "brass-diya-set",
    label: "Brass diya set",
    defaults: { bowl: "#bd8530", flame: "#ffd24a" },
    draw: (p) =>
      [76, 186, 296]
        .map((x) => path(`M${x - 36} 260 L${x + 36} 260 Q${x + 28} 284 ${x} 284 Q${x - 28} 284 ${x - 36} 260 Z`, { fill: p.bowl }) + ellipse(x, 240, 8, 18, p.flame))
        .join(""),
  },
  {
    id: "rangoli",
    label: "Rangoli",
    defaults: { cx: 200, cy: 200, outer: "#e8457c", mid: "#f0861c", inner: "#2d8a6a", center: "#7b3fa0" },
    draw: (p) => {
      const ring = (R, n, r, fill) =>
        Array.from({ length: n }, (_, i) => circle(p.cx + R * Math.cos(rad((360 / n) * i)), p.cy + R * Math.sin(rad((360 / n) * i)), r, fill)).join("");
      return ring(140, 44, 8, p.outer) + ring(98, 32, 7.5, p.mid) + ring(54, 18, 7, p.inner) + circle(p.cx, p.cy, 16, p.center);
    },
  },
  {
    id: "cake",
    label: "Cake",
    defaults: { bottom: "#f6c6ce", middle: "#fde8bb", top: "#cfe0ef", candle: "#8b5a2b", flame: "#ffd24a" },
    draw: (p) =>
      rect(100, 260, 200, 72, p.bottom, { rx: 6 }) +
      rect(130, 192, 140, 68, p.middle, { rx: 4 }) +
      rect(160, 132, 80, 60, p.top, { rx: 4 }) +
      line(200, 100, 200, 132, p.candle, 4) +
      ellipse(200, 84, 8, 16, p.flame),
  },
  {
    id: "vase",
    label: "Vase",
    defaults: { glass: "#d9e5d8", edge: "#9bb59d", collar: "#c8d5c3", flower1: "#f0b8c0", flower2: "#fffaf0" },
    draw: (p) =>
      circle(182, 64, 22, p.flower2) + circle(224, 64, 24, p.flower1) +
      path("M156 124 C 130 180 140 260 160 340 L242 340 C 262 260 270 180 244 124 Z", { fill: p.glass, stroke: p.edge, "stroke-width": 8, "stroke-linejoin": "round" }) +
      rect(156, 100, 88, 24, p.collar, { rx: 4 }),
  },
  {
    id: "welcome-sign",
    label: "Welcome sign",
    defaults: { frame: "#d9a441", board: "#fffaee", text: "#e6dcc8", leg: "#8b5a2b" },
    draw: (p) =>
      line(140, 300, 100, 380, p.leg, 12) + line(260, 300, 300, 380, p.leg, 12) +
      rect(88, 38, 224, 262, p.board, { rx: 14, stroke: p.frame, "stroke-width": 10 }) +
      rect(120, 80, 160, 12, p.text) + rect(140, 120, 120, 12, p.text),
  },
  {
    id: "flower-basket",
    label: "Flower basket",
    defaults: { basket: "#c9a56b", handle: "#b08a3c", f1: "#f7b82a", f2: "#f0b8c0", f3: "#fffaee" },
    draw: (p) =>
      path("M80 200 Q200 20 320 200", { fill: "none", stroke: p.handle, "stroke-width": 10, "stroke-linecap": "round" }) +
      circle(222, 182, 32, p.f3) + circle(160, 184, 32, p.f2) + circle(192, 140, 28, p.f1) +
      poly([[80, 200], [320, 200], [290, 340], [110, 340]], p.basket),
  },
];
