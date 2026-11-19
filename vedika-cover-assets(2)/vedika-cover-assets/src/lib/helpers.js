// Small SVG string helpers shared by every component and cover.
export const f = (n) => Math.round(n * 10) / 10;
export const rad = (d) => (d * Math.PI) / 180;

const attrs = (o) => {
  if (!o) return "";
  const s = Object.entries(o)
    .filter(([, v]) => v !== undefined && v !== null && v !== false)
    .map(([k, v]) => `${k}="${v}"`)
    .join(" ");
  return s ? " " + s : "";
};

export const circle = (cx, cy, r, fill, o) =>
  `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${fill}"${attrs(o)}/>`;
export const ellipse = (cx, cy, rx, ry, fill, o) =>
  `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}"${attrs(o)}/>`;
export const rect = (x, y, w, h, fill, o) =>
  `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${fill}"${attrs(o)}/>`;
export const poly = (pts, fill, o) =>
  `<polygon points="${pts.map(([x, y]) => `${f(x)},${f(y)}`).join(" ")}" fill="${fill}"${attrs(o)}/>`;
export const path = (d, o) => `<path d="${d}"${attrs(o)}/>`;
export const line = (x1, y1, x2, y2, stroke, w, o) =>
  `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round"${attrs(o)}/>`;

// n elliptical petals around (cx, cy), each rotated to point outward.
export const petals = (cx, cy, n, dist, rx, ry, fill, start = -90) =>
  Array.from({ length: n }, (_, i) => {
    const a = start + (360 / n) * i;
    const x = cx + dist * Math.cos(rad(a));
    const y = cy + dist * Math.sin(rad(a));
    return ellipse(x, y, rx, ry, fill, { transform: `rotate(${f(a + 90)} ${f(x)} ${f(y)})` });
  }).join("");

// Equally spaced points along a polyline.
export function resample(pts, spacing) {
  const out = [pts[0]];
  let carry = 0;
  for (let i = 1; i < pts.length; i++) {
    let [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    let seg = Math.hypot(x1 - x0, y1 - y0);
    while (carry + seg >= spacing) {
      const t = (spacing - carry) / seg;
      x0 += (x1 - x0) * t;
      y0 += (y1 - y0) * t;
      out.push([x0, y0]);
      seg = Math.hypot(x1 - x0, y1 - y0);
      carry = 0;
    }
    carry += seg;
  }
  return out;
}

// Dense polyline: up the left leg, over a half-ellipse, down the right leg.
export function archPts({ cx, baseY, legTopY, rx, ry }) {
  const pts = [];
  for (let y = baseY; y >= legTopY; y -= 2) pts.push([cx - rx, y]);
  for (let a = 180; a <= 360; a += 2) pts.push([cx + rx * Math.cos(rad(a)), legTopY + ry * Math.sin(rad(a))]);
  for (let y = legTopY; y <= baseY; y += 2) pts.push([cx + rx, y]);
  return pts;
}

// Rectangular gate with rounded top corners.
export function gatePts({ x0, x1, topY, baseY, r }) {
  const pts = [];
  for (let y = baseY; y >= topY + r; y -= 2) pts.push([x0, y]);
  for (let a = 180; a <= 270; a += 3) pts.push([x0 + r + r * Math.cos(rad(a)), topY + r + r * Math.sin(rad(a))]);
  for (let x = x0 + r; x <= x1 - r; x += 2) pts.push([x, topY]);
  for (let a = 270; a <= 360; a += 3) pts.push([x1 - r + r * Math.cos(rad(a)), topY + r + r * Math.sin(rad(a))]);
  for (let y = topY + r; y <= baseY; y += 2) pts.push([x1, y]);
  return pts;
}

export function lerpColor(a, b, t) {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (s) => ((pa >> s) & 255) + ((((pb >> s) & 255) - ((pa >> s) & 255)) * t);
  const h = (v) => Math.round(v).toString(16).padStart(2, "0");
  return "#" + h(ch(16)) + h(ch(8)) + h(ch(0));
}
