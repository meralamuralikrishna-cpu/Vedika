import { rect, poly, path, line } from "../lib/helpers.js";

export const fabric = [
  {
    id: "swag",
    label: "Swag",
    defaults: { color: "#f0e4d3", edge: "#d8c9b0" },
    draw: (p) => {
      const d = "M18 60 Q110 230 200 60 Q290 230 382 60";
      return (
        path(d, { fill: "none", stroke: p.color, "stroke-width": 44, "stroke-linecap": "round" }) +
        poly([[176, 40], [200, -10], [224, 40]], p.color) +
        path(d, { fill: "none", stroke: p.edge, "stroke-width": 3 })
      );
    },
  },
  {
    id: "ruffle-panel",
    label: "Ruffle panel",
    defaults: { color: "#f6c6ce" },
    draw: (p) =>
      [60, 120, 180, 240, 300]
        .map((y) =>
          path(`M44 ${y} C 110 ${y + 26}, 170 ${y + 20}, 200 ${y - 4} S 290 ${y - 36}, 356 ${y - 14}`, {
            fill: "none", stroke: p.color, "stroke-width": 44, "stroke-linecap": "round",
          })
        )
        .join(""),
  },
  {
    id: "silk-ribbon",
    label: "Silk ribbon",
    defaults: { color: "#c1384f" },
    draw: (p) =>
      path("M40 340 C 80 200, 110 120, 142 145 C 180 175, 200 280, 255 255 C 320 225, 340 120, 360 55", {
        fill: "none", stroke: p.color, "stroke-width": 30, "stroke-linecap": "round",
      }),
  },
  {
    id: "curtain",
    label: "Curtain",
    defaults: { rail: "#7a6a58", color: "#8e1f4d", fold: "#6b1238" },
    draw: (p) =>
      rect(40, 40, 320, 16, p.rail) +
      path("M60 56 L180 56 C 108 150, 100 250, 160 360 L40 360 C 80 270, 80 150, 60 56 Z", { fill: p.color }) +
      path("M340 56 L220 56 C 292 150, 300 250, 240 360 L360 360 C 320 270, 320 150, 340 56 Z", { fill: p.color }) +
      path("M100 80 Q 106 200 90 340", { fill: "none", stroke: p.fold, "stroke-width": 4, "stroke-linecap": "round" }),
  },
  {
    id: "table-runner",
    label: "Table runner",
    defaults: { cloth: "#fffaee", band: "#d9a441", edge: "#bd8530" },
    draw: (p) => rect(20, 160, 360, 80, p.cloth) + rect(20, 184, 360, 32, p.band) + rect(20, 184, 360, 4, p.edge),
  },
  {
    id: "pleated-drape",
    label: "Pleated drape",
    defaults: { a: "#f0e4d3", b: "#e6d6c0" },
    draw: (p) =>
      Array.from({ length: 6 }, (_, i) =>
        path(`M${60 + 56 * i} 40 Q ${72 + 56 * i} 200 ${60 + 56 * i} 360`, {
          fill: "none", stroke: i % 2 ? p.b : p.a, "stroke-width": 52, "stroke-linecap": "round",
        })
      ).join(""),
  },
  {
    id: "chair-sash",
    label: "Chair sash",
    defaults: { chair: "#fff9ec", sash: "#d9a441" },
    draw: (p) =>
      rect(140, 40, 120, 180, p.chair, { rx: 10 }) +
      path("M160 262 Q 200 300 285 365", { fill: "none", stroke: p.sash, "stroke-width": 22, "stroke-linecap": "round" }) +
      path("M240 262 Q 200 300 115 360", { fill: "none", stroke: p.sash, "stroke-width": 22, "stroke-linecap": "round" }) +
      poly([[120, 220], [280, 220], [260, 260], [140, 260]], p.sash),
  },
  {
    id: "tassel-tieback",
    label: "Tassel tie-back",
    defaults: { color: "#d9a441" },
    draw: (p) =>
      path("M60 120 Q200 30 340 120", { fill: "none", stroke: p.color, "stroke-width": 12, "stroke-linecap": "round" }) +
      line(200, 80, 200, 205, p.color, 10) +
      rect(180, 200, 40, 40, p.color, { rx: 8 }) +
      [184, 192, 200, 208, 216].map((x) => line(x, 240, x, 340, p.color, 4)).join(""),
  },
];
