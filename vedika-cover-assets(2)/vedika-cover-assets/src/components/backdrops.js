import { circle, rect, poly, path, resample, archPts, rad } from "../lib/helpers.js";

// Every component draws inside a 400x400 box and takes its colours/sizes from `p`.
export const backdrops = [
  {
    id: "floral-arch",
    label: "Floral arch",
    defaults: { cx: 200, baseY: 385, legTopY: 175, rx: 120, ry: 120, r: 20, gap: 30, color: "#e8a5a8", bloom: "#f7c6cc", bloomR: 0, vine: "#8da88a" },
    draw: (p) => {
      const outer = resample(archPts(p), p.gap)
        .map(([x, y]) => circle(x, y, p.r, p.color) + (p.bloomR ? circle(x, y, p.bloomR, p.bloom) : ""))
        .join("");
      const inner = p.vine
        ? resample(archPts({ ...p, rx: p.rx - 40, ry: p.ry - 40 }), 24).map(([x, y]) => circle(x, y, 6, p.vine)).join("")
        : "";
      return outer + inner;
    },
  },
  {
    id: "moon-gate",
    label: "Moon gate",
    defaults: { cx: 200, cy: 200, R: 138, n: 24, r: 27, color: "#b11f3c", inner: "#f7b8c6" },
    draw: (p) =>
      Array.from({ length: p.n }, (_, i) => {
        const a = rad(-90 + (360 / p.n) * i);
        const x = p.cx + p.R * Math.cos(a);
        const y = p.cy + p.R * Math.sin(a);
        return circle(x, y, p.r, p.color) + circle(x, y, p.r * 0.4, p.inner);
      }).join(""),
  },
  {
    id: "mandap",
    label: "Mandap",
    defaults: { roof: "#1f4b37", beam: "#e6c27a", pillar: "#d8b25a", seat: "#e6c27a" },
    draw: (p) =>
      poly([[40, 140], [200, 60], [360, 140]], p.roof) +
      rect(40, 140, 320, 16, p.beam) +
      rect(52, 156, 24, 199, p.pillar) +
      rect(324, 156, 24, 199, p.pillar) +
      rect(120, 320, 160, 40, p.seat),
  },
  {
    id: "floral-wall",
    label: "Floral wall",
    defaults: { base: "#6f8f75", colors: ["#f0b8c0", "#fffaee", "#f7cad4", "#f3d57a"] },
    draw: (p) => {
      let s = rect(40, 40, 320, 320, p.base, { rx: 14 });
      for (let r = 0; r < 5; r++)
        for (let c = 0; c < 4; c++) s += circle(80 + 80 * c + (r % 2 ? 20 : 0), 90 + 64 * r, 26, p.colors[(c + r) % p.colors.length]);
      return s;
    },
  },
  {
    id: "drape-panel",
    label: "Drape panel",
    defaults: { rail: "#7a6a58", color: "#f0e4d3", fold: "#d8c9b0" },
    draw: (p) =>
      rect(40, 40, 320, 20, p.rail) +
      path("M60 60 C 85 150, 85 270, 60 360 L340 360 C 315 270, 315 150, 340 60 Z", { fill: p.color }) +
      [140, 220, 300].map((x) => path(`M${x} 62 Q ${x + 12} 210 ${x} 360`, { fill: "none", stroke: p.fold, "stroke-width": 4 })).join(""),
  },
  {
    id: "floral-hoop",
    label: "Floral hoop",
    defaults: { ring: "#d9a441", bloom: "#f0b8c0", leaf: "#6f8f75" },
    draw: (p) => {
      const pts = [[88, 260, 24], [108, 288, 24], [136, 310, 24], [168, 326, 22], [204, 332, 22], [232, 328, 20]];
      return (
        circle(200, 200, 133, "none", { stroke: p.ring, "stroke-width": 10 }) +
        pts.map(([x, y, r]) => circle(x, y, r, p.bloom)).join("") +
        pts.map(([x, y]) => circle(x, y, 6, p.leaf)).join("")
      );
    },
  },
  {
    id: "balloon-arch",
    label: "Balloon arch",
    defaults: { cx: 200, cy: 380, rx: 150, ry: 305, n: 15, r: 30, pink: "#ff7fb0", yellow: "#ffd24a", blue: "#7fd1e8" },
    draw: (p) => {
      let s = "";
      for (let i = 0; i < p.n; i++) {
        const a = rad(180 + (180 * i) / (p.n - 1));
        const x = p.cx + p.rx * Math.cos(a);
        const y = p.cy + p.ry * Math.sin(a);
        s += circle(x, y, p.r, p.pink) + circle(x + p.r * 0.15, y - p.r * 0.15, p.r * 0.7, p.yellow);
        if (i % 2) s += circle(x + p.r * 0.27, y - p.r * 0.27, p.r * 0.58, p.blue);
      }
      return s;
    },
  },
  {
    id: "pillar-pair",
    label: "Pillar pair",
    defaults: { pillar: "#d8b25a", cap: "#e6c27a", garland: "#f0b8c0" },
    draw: (p) =>
      [60, 284].map((x) => rect(x, 68, 56, 284, p.pillar) + rect(x - 12, 48, 80, 20, p.cap) + rect(x - 12, 352, 80, 20, p.cap)).join("") +
      Array.from({ length: 8 }, (_, i) => {
        const t = i / 7;
        return circle(116 + 156 * t, 78 + 14 * t + 62 * Math.sin(Math.PI * t), 10, p.garland);
      }).join(""),
  },
];
