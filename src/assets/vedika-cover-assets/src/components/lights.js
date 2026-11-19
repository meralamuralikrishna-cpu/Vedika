import { circle, ellipse, rect, poly, path, line } from "../lib/helpers.js";

export const lights = [
  {
    id: "fairy-lights",
    label: "Fairy lights",
    defaults: { wire: "#6b5a38", bulb: "#ffd88a", glow: "#fff0d0" },
    draw: (p) =>
      path("M20 80 C 70 180, 140 180, 200 80 S 330 -15, 380 80", { fill: "none", stroke: p.wire, "stroke-width": 4, "stroke-linecap": "round" }) +
      circle(200, 120, 32, p.glow, { opacity: 0.8 }) +
      [[60, 156], [110, 180], [160, 152], [240, 152], [290, 180], [340, 156]].map(([x, y]) => circle(x, y, 10, p.bulb)).join(""),
  },
  {
    id: "chandelier",
    label: "Chandelier",
    defaults: { metal: "#a9b0bb", shade: "#d6d9df", crystal: "#eef2f9" },
    draw: (p) =>
      line(200, 17, 200, 100, p.metal, 6) +
      poly([[108, 110], [292, 110], [252, 170], [148, 170]], p.shade, { stroke: p.metal, "stroke-width": 6, "stroke-linejoin": "round" }) +
      [[120, 170, 200], [160, 172, 252], [200, 172, 312], [240, 172, 252], [280, 170, 200]]
        .map(([x, y0, y1]) => line(x, y0, x, y1 - 12, p.metal, 4) + circle(x, y1, 12, p.crystal))
        .join(""),
  },
  {
    id: "lantern",
    label: "Lantern",
    defaults: { cord: "#6b4a2a", cap: "#c9a050", body: "#ff9a2e", glow: "#ffe6a3" },
    draw: (p) =>
      line(200, 17, 200, 60, p.cord, 6) +
      rect(140, 60, 120, 32, p.cap, { rx: 6 }) +
      rect(150, 92, 100, 180, p.body, { rx: 24 }) +
      rect(170, 112, 60, 140, p.glow, { rx: 12 }) +
      rect(140, 272, 120, 24, p.cap, { rx: 6 }),
  },
  {
    id: "diya",
    label: "Diya",
    defaults: { glow: "#fff3d6", glowOpacity: 0.85, bowl: "#bd8530", flame: "#ffd24a" },
    draw: (p) =>
      path("M100 240 L300 240 Q 280 312 200 312 Q 120 312 100 240 Z", { fill: p.bowl }) +
      (p.glowOpacity ? circle(200, 200, 80, p.glow, { opacity: p.glowOpacity }) : "") +
      ellipse(200, 190, 16, 44, p.flame),
  },
  {
    id: "neon-ring",
    label: "Neon ring",
    defaults: { halo: "#fff0d6", ring: "#ffd685", fill: "#fffdf8" },
    draw: (p) =>
      circle(200, 200, 154, p.halo) + circle(200, 200, 112, p.fill) +
      circle(200, 200, 130, "none", { stroke: p.ring, "stroke-width": 18 }),
  },
  {
    id: "string-bulbs",
    label: "String bulbs",
    defaults: { wire: "#444444", bulb: "#ffd685", glow: "#fff0d6" },
    draw: (p) =>
      path("M20 60 Q200 180 380 60", { fill: "none", stroke: p.wire, "stroke-width": 4, "stroke-linecap": "round" }) +
      [[70, 96], [140, 124], [200, 132], [260, 124], [330, 96]].map(([x, y]) => circle(x, y, 32, p.glow) + circle(x, y, 18, p.bulb)).join(""),
  },
  {
    id: "candle",
    label: "Candle",
    defaults: { wax: "#f6e6cc", glow: "#fff0d6", flame: "#ffd24a" },
    draw: (p) =>
      rect(172, 160, 56, 180, p.wax, { rx: 6 }) +
      circle(200, 132, 68, p.glow, { opacity: 0.75 }) +
      ellipse(200, 128, 14, 32, p.flame),
  },
  {
    id: "uplight",
    label: "Uplight",
    defaults: { beam: "#fff3dc", base: "#3a3a3a" },
    draw: (p) => poly([[80, 20], [320, 20], [200, 240]], p.beam) + poly([[140, 360], [260, 360], [200, 240]], p.base),
  },
];
