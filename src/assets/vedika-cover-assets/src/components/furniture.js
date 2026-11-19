import { circle, ellipse, rect, poly, path, line } from "../lib/helpers.js";

export const furniture = [
  {
    id: "sofa",
    label: "Sofa",
    defaults: { cushion: "#d9bcb0", body: "#c9a89d", arm: "#b59084", leg: "#6b4a3a" },
    draw: (p) =>
      rect(80, 320, 16, 36, p.leg) + rect(304, 320, 16, 36, p.leg) +
      rect(60, 180, 280, 100, p.body, { rx: 40 }) +
      rect(80, 140, 240, 68, p.cushion, { rx: 30 }) +
      rect(40, 200, 56, 120, p.arm, { rx: 20 }) + rect(304, 200, 56, 120, p.arm, { rx: 20 }),
  },
  {
    id: "throne",
    label: "Throne",
    defaults: { gold: "#d9a441", back: "#8e1f4d", seat: "#a32a5c" },
    draw: (p) =>
      rect(90, 308, 28, 60, p.gold) + rect(282, 308, 28, 60, p.gold) +
      rect(110, 50, 180, 150, p.back, { rx: 22 }) +
      rect(90, 20, 220, 44, p.gold, { rx: 20 }) +
      rect(70, 200, 260, 68, p.seat, { rx: 24 }) +
      rect(70, 268, 260, 40, p.gold, { rx: 10 }),
  },
  {
    id: "chiavari-chair",
    label: "Chiavari chair",
    defaults: { frame: "#d9a441", seat: "#f2e8d2" },
    draw: (p) =>
      rect(120, 60, 160, 180, "none", { stroke: p.frame, "stroke-width": 10 }) +
      line(120, 100, 280, 100, p.frame, 10) +
      rect(110, 240, 180, 28, p.seat, { rx: 8 }) +
      line(124, 268, 100, 380, p.frame, 10) + line(140, 268, 140, 380, p.frame, 10) +
      line(260, 268, 260, 380, p.frame, 10) + line(276, 268, 300, 380, p.frame, 10),
  },
  {
    id: "round-table",
    label: "Round table",
    defaults: { cloth: "#f5f0e4", top: "#fffaee", edge: "#d8d2c4" },
    draw: (p) =>
      path("M40 180 L80 370 L320 370 L360 180 Z", { fill: p.cloth, stroke: p.edge, "stroke-width": 5, "stroke-linejoin": "round" }) +
      path("M40 180 Q200 80 360 180 Z", { fill: p.top, stroke: p.edge, "stroke-width": 5, "stroke-linejoin": "round" }),
  },
  {
    id: "banquet-table",
    label: "Banquet table",
    defaults: { top: "#fffaee", edge: "#d8d2c4", leg: "#e6dcc8" },
    draw: (p) =>
      [40, 120, 200, 280, 360].map((x) => line(x, 200, x, 360, p.leg, 6)).join("") +
      poly([[40, 160], [100, 120], [300, 120], [360, 160], [360, 200], [40, 200]], p.top, { stroke: p.edge, "stroke-width": 5, "stroke-linejoin": "round" }),
  },
  {
    id: "loveseat",
    label: "Loveseat",
    defaults: { cushion: "#d9475a", body: "#c0344b", arm: "#9e2236", button: "#f3d57a", buttons: true },
    draw: (p) =>
      rect(80, 160, 240, 88, p.body, { rx: 40 }) +
      rect(100, 120, 200, 60, p.cushion, { rx: 30 }) +
      rect(60, 192, 48, 100, p.arm, { rx: 22 }) + rect(292, 192, 48, 100, p.arm, { rx: 22 }) +
      (p.buttons ? circle(160, 220, 16, p.button) + circle(240, 220, 16, p.button) : ""),
  },
  {
    id: "plinth",
    label: "Plinth",
    defaults: { slab: "#e6dcc8", body: "#f3efe6", edge: "#d8d2c4" },
    draw: (p) => rect(123, 131, 154, 226, p.body, { stroke: p.edge, "stroke-width": 6, rx: 3 }) + rect(100, 100, 200, 28, p.slab, { rx: 4 }),
  },
  {
    id: "cocktail-table",
    label: "Cocktail table",
    defaults: { top: "#d9a441", base: "#bd8530" },
    draw: (p) =>
      ellipse(200, 368, 66, 10, p.top) + ellipse(200, 365, 66, 10, p.base) +
      line(200, 140, 200, 340, p.top, 12) +
      ellipse(200, 120, 92, 24, p.top),
  },
];
