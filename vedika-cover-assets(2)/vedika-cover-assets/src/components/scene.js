import { circle, ellipse, rect, poly, path, line, resample, gatePts, rad, lerpColor, f } from "../lib/helpers.js";

// Scene primitives: absolute-positioned pieces used to build cover backgrounds
// (gradients, floors, hills, garlands...). Unlike components they are not 400x400 boxes.
const stopsSvg = (st) => st.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("");
const style = (p) => ({ opacity: p.opacity, stroke: p.stroke, "stroke-width": p.sw });

export const scene = [
  {
    id: "bg",
    label: "Gradient background",
    defaults: { x: 0, y: 0, w: 1200, h: 800, dir: "v", stops: [[0, "#ffffff"], [1, "#000000"]], cx: 600, cy: 400, r: 600 },
    draw: (p, ctx) => {
      const id = ctx.uid("g");
      let def;
      if (p.dir === "radial")
        def = `<radialGradient id="${id}" cx="${p.cx}" cy="${p.cy}" r="${p.r}" gradientUnits="userSpaceOnUse">${stopsSvg(p.stops)}</radialGradient>`;
      else {
        const [x2, y2] = p.dir === "d" ? [p.x + p.w, p.y + p.h] : p.dir === "h" ? [p.x + p.w, p.y] : [p.x, p.y + p.h];
        def = `<linearGradient id="${id}" x1="${p.x}" y1="${p.y}" x2="${x2}" y2="${y2}" gradientUnits="userSpaceOnUse">${stopsSvg(p.stops)}</linearGradient>`;
      }
      return `<defs>${def}</defs>` + rect(p.x, p.y, p.w, p.h, `url(#${id})`);
    },
  },
  { id: "rect", label: "Rectangle", defaults: { x: 0, y: 0, w: 100, h: 100, fill: "#cccccc", rx: 0 }, draw: (p) => rect(p.x, p.y, p.w, p.h, p.fill, { rx: p.rx || undefined, ...style(p) }) },
  { id: "circle", label: "Circle", defaults: { cx: 0, cy: 0, r: 10, fill: "#cccccc" }, draw: (p) => circle(p.cx, p.cy, p.r, p.fill, style(p)) },
  { id: "ellipse", label: "Ellipse", defaults: { cx: 0, cy: 0, rx: 10, ry: 6, fill: "#cccccc" }, draw: (p) => ellipse(p.cx, p.cy, p.rx, p.ry, p.fill, style(p)) },
  { id: "poly", label: "Polygon", defaults: { points: [], fill: "#cccccc" }, draw: (p) => poly(p.points, p.fill, style(p)) },
  { id: "path", label: "Path", defaults: { d: "", fill: "none" }, draw: (p) => path(p.d, { fill: p.fill, ...style(p), "stroke-linecap": p.stroke ? "round" : undefined }) },
  { id: "line", label: "Line", defaults: { x1: 0, y1: 0, x2: 10, y2: 10, stroke: "#999999", w: 3 }, draw: (p) => line(p.x1, p.y1, p.x2, p.y2, p.stroke, p.w, { opacity: p.opacity }) },
  {
    id: "stars",
    label: "Star dots",
    defaults: { items: [], fill: "#ffffff" },
    draw: (p) => p.items.map(([x, y, r]) => circle(x, y, r, p.fill, { opacity: p.opacity })).join(""),
  },
  {
    id: "dotRow",
    label: "Dot row",
    defaults: { x0: 0, x1: 100, y: 0, n: 5, r: 10, fill: "#ffd24a" },
    draw: (p) => Array.from({ length: p.n }, (_, i) => circle(p.x0 + ((p.x1 - p.x0) * i) / (p.n - 1), p.y, p.r, p.fill)).join(""),
  },
  {
    id: "ringGarland",
    label: "Ring garland",
    defaults: { cx: 600, cy: 400, R: 200, n: 24, r: 24, a0: 0, a1: 360, from: "#b11f3c", to: "#b11f3c", inner: "", innerK: 0.7 },
    draw: (p) =>
      Array.from({ length: p.n }, (_, i) => {
        const t = p.n > 1 ? i / (p.n - 1) : 0;
        const a = rad(p.a0 + (p.a1 - p.a0) * t);
        const x = p.cx + p.R * Math.cos(a);
        const y = p.cy + p.R * Math.sin(a);
        return circle(x, y, p.r, lerpColor(p.from, p.to, t)) + (p.inner ? circle(x, y, p.r * p.innerK, p.inner) : "");
      }).join(""),
  },
  {
    id: "swagGarland",
    label: "Marigold swag",
    defaults: {
      x0: -20, x1: 1220, step: 22, baseY: 125, amp: 100, peakX: 579, period: 740,
      rows: [{ dy: 0, r: 24, fill: "#f0861c" }, { dy: 20, r: 16, fill: "#f7b82a" }],
    },
    draw: (p) =>
      p.rows
        .map((row) => {
          let s = "";
          for (let x = p.x0; x <= p.x1; x += p.step) s += circle(x, p.baseY - p.amp * Math.cos((2 * Math.PI * (x - p.peakX)) / p.period) + row.dy, row.r, row.fill);
          return s;
        })
        .join(""),
  },
  {
    id: "gate",
    label: "Marigold gate",
    defaults: { x0: 400, x1: 800, topY: 300, baseY: 650, r: 40, dot: 17, step: 22, fill: "#f0861c" },
    draw: (p) => resample(gatePts(p), p.step).map(([x, y]) => circle(x, y, p.dot, p.fill)).join(""),
  },
  {
    id: "scallops",
    label: "Scalloped band",
    defaults: { y: 200, x0: 0, x1: 1200, r: 40, gap: 60, rectH: 80, dir: "up", fill: "#9fb89f" },
    draw: (p) => {
      const rectY = p.dir === "down" ? p.y - p.rectH : p.y;
      let s = rect(p.x0, rectY, p.x1 - p.x0, p.rectH, p.fill);
      for (let x = p.x0; x <= p.x1 + p.gap; x += p.gap) s += circle(x, p.y, p.r, p.fill);
      return s;
    },
  },
  {
    id: "strand",
    label: "Hanging strand",
    defaults: { x: 0, y0: 0, y1: 100, r: 12, step: 20, fills: ["#f0861c", "#f7b82a"] },
    draw: (p) => {
      let s = "";
      let i = 0;
      for (let y = p.y0; y <= p.y1; y += p.step) s += circle(p.x, y, p.r, p.fills[i++ % p.fills.length]);
      return s;
    },
  },
];
