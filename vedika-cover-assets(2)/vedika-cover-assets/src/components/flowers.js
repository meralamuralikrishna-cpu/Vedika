import { circle, ellipse, path, petals, rad, line } from "../lib/helpers.js";

export const flowers = [
  {
    id: "peony",
    label: "Peony",
    defaults: { outer: "#f0b8c0", inner: "#f7cad4", center: "#f3d57a" },
    draw: (p) => {
      let s = circle(200, 200, 80, p.outer);
      for (let i = 0; i < 8; i++) s += circle(200 + 78 * Math.cos(rad(i * 45)), 200 + 78 * Math.sin(rad(i * 45)), 46, p.outer);
      s += circle(200, 200, 50, p.inner);
      for (let i = 0; i < 8; i++) s += circle(200 + 50 * Math.cos(rad(i * 45 + 22)), 200 + 50 * Math.sin(rad(i * 45 + 22)), 30, p.inner);
      return s + circle(200, 200, 24, p.center);
    },
  },
  {
    id: "rose",
    label: "Rose",
    defaults: { a: "#b11f3c", b: "#c9314d", c: "#d9506a", swirl: "#8e1a2f" },
    draw: (p) =>
      circle(200, 200, 104, p.a) + circle(200, 200, 76, p.b) + circle(200, 200, 48, p.c) +
      path("M160 198 Q 205 158 245 198 Q 205 218 166 206", { fill: "none", stroke: p.swirl, "stroke-width": 6, "stroke-linecap": "round" }),
  },
  {
    id: "marigold",
    label: "Marigold",
    defaults: { outer: "#f0861c", inner: "#f7b82a", center: "#e06f00" },
    draw: (p) => petals(200, 200, 18, 94, 21, 28, p.outer, 0) + petals(200, 200, 12, 60, 19, 26, p.inner, -90) + circle(200, 200, 24, p.center),
  },
  {
    id: "eucalyptus",
    label: "Eucalyptus",
    defaults: { stem: "#6f8f75", leaf: "#9fb89f" },
    draw: (p) =>
      path("M200 380 C 190 280, 205 160, 240 40", { fill: "none", stroke: p.stem, "stroke-width": 8, "stroke-linecap": "round" }) +
      [[205, 65, -30], [180, 110, 25], [220, 150, -30], [177, 195, 25], [222, 238, -30], [177, 280, 25], [223, 325, -30]]
        .map(([x, y, a]) => ellipse(x, y, 27, 17, p.leaf, { transform: `rotate(${a} ${x} ${y})` }))
        .join(""),
  },
  {
    id: "orchid",
    label: "Orchid",
    defaults: { petal: "#faf4fa", edge: "#dbb4d8", lip: "#d894be", center: "#f3d57a" },
    draw: (p) => {
      let s = "";
      for (let i = 0; i < 5; i++) {
        const a = -90 + i * 72;
        const x = 200 + 56 * Math.cos(rad(a));
        const y = 200 + 56 * Math.sin(rad(a));
        s += ellipse(x, y, 42, 68, p.petal, { stroke: p.edge, "stroke-width": 3, transform: `rotate(${a + 90} ${x} ${y})` });
      }
      return s + ellipse(200, 200, 20, 32, p.lip) + circle(200, 200, 18, p.center);
    },
  },
  {
    id: "jasmine-strand",
    label: "Jasmine strand",
    defaults: { stem: "#6f8f75", bud: "#fffcec" },
    draw: (p) => {
      let s = "";
      for (let i = 0; i <= 14; i++) {
        const t = i / 14;
        const x = (1 - t) * (1 - t) * 35 + 2 * (1 - t) * t * 200 + t * t * 360;
        const y = (1 - t) * (1 - t) * 75 + 2 * (1 - t) * t * 325 + t * t * 80;
        s += circle(x, y, 9, p.bud);
      }
      return s + path("M35 75 Q200 325 360 80", { fill: "none", stroke: p.stem, "stroke-width": 6, "stroke-dasharray": "12 22" });
    },
  },
  {
    id: "lotus",
    label: "Lotus",
    defaults: { outer: "#f3b0c8", mid: "#f5c2d3", center: "#f9cfdd" },
    draw: (p) =>
      path("M80 180 Q 150 200 200 340 Q 100 300 80 180 Z", { fill: p.outer }) +
      path("M320 180 Q 250 200 200 340 Q 300 300 320 180 Z", { fill: p.outer }) +
      path("M140 160 Q 190 200 200 340 Q 130 280 140 160 Z", { fill: p.mid }) +
      path("M260 160 Q 210 200 200 340 Q 270 280 260 160 Z", { fill: p.mid }) +
      path("M200 80 Q 255 160 240 250 L 200 340 L 160 250 Q 145 160 200 80 Z", { fill: p.center }),
  },
  {
    id: "pampas",
    label: "Pampas",
    defaults: { stem: "#d8c69b", plume: "#efe0c8" },
    draw: (p) => {
      const tops = [[20, -35], [110, -15], [200, 0], [290, 15], [380, 35]];
      return (
        tops.map(([tx]) => path(`M200 380 Q ${200 + (tx - 200) * 0.15} 230 ${tx} 150`, { fill: "none", stroke: p.stem, "stroke-width": 6, "stroke-linecap": "round" })).join("") +
        tops.map(([tx, a]) => ellipse(tx, 120, 18, 66, p.plume, { transform: `rotate(${a} ${tx} 120)` })).join("") +
        line(200, 120, 200, 380, p.stem, 5)
      );
    },
  },
];
