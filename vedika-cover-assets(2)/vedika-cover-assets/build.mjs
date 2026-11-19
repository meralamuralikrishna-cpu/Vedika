import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { groups, componentList, scene } from "./src/components/index.js";
import { covers } from "./src/covers/covers.js";
import { renderComponentSvg, renderCoverSvg } from "./src/render.js";

const out = (p) => { mkdirSync(p.split("/").slice(0, -1).join("/") || ".", { recursive: true }); return p; };
const hasRsvg = (() => { try { execFileSync("rsvg-convert", ["--version"]); return true; } catch { return false; } })();
const png = (svg, dest, w) => hasRsvg && execFileSync("rsvg-convert", ["-w", String(w), svg, "-o", out(dest)]);

// 1) component SVGs (+ PNGs)
for (const c of componentList) {
  const svgPath = `svg/components/${c.group}/${c.id}.svg`;
  writeFileSync(out(svgPath), renderComponentSvg(c));
  png(svgPath, `png/components/${c.group}/${c.id}.png`, 400);
}

// 2) cover SVGs (+ PNGs)
for (const cv of covers) {
  const svgPath = `svg/covers/${cv.id}.svg`;
  writeFileSync(out(svgPath), renderCoverSvg(cv));
  png(svgPath, `png/covers/${cv.id}.png`, 1200);
}

// 3) asset sheets, same layout as the Vedika sheets (1800x1280, 4x2 cards)
for (const [key, g] of Object.entries(groups)) {
  const cards = g.items.map((c, i) => {
    const x = 60 + 430 * (i % 4), y = 140 + 580 * Math.floor(i / 4);
    return `<rect x="${x}" y="${y}" width="400" height="400" rx="36" fill="#fffdf9" stroke="#e6dcc8" stroke-width="3"/>` +
      `<g transform="translate(${x} ${y})">${c.draw({ ...c.defaults })}</g>` +
      `<text x="${x + 200}" y="${y + 450}" text-anchor="middle" font-family="DejaVu Serif, serif" font-size="34" fill="#3d3125">${c.label}</text>`;
  }).join("");
  const sheet = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1800 1280" width="1800" height="1280"><rect width="1800" height="1280" fill="#f6efe4"/>` +
    `<text x="60" y="92" font-family="DejaVu Serif, serif" font-size="56" fill="#3d3125">${g.title}</text>${cards}</svg>`;
  const p = `svg/sheets/${g.title} assets.svg`;
  writeFileSync(out(p), sheet);
  png(p, `png/sheets/${g.title} assets.png`, 1800);
}

// 4) JSON data for the website
const controls = (d) => Object.fromEntries(Object.entries(d).map(([k, v]) => [k, typeof v === "string" && /^#/.test(v) ? "color" : typeof v === "number" ? "number" : Array.isArray(v) ? "list" : typeof v]));
writeFileSync(out("data/components.json"), JSON.stringify(componentList.map((c) => ({ id: c.id, label: c.label, group: c.group, defaults: c.defaults, controls: controls(c.defaults) })), null, 2));
writeFileSync(out("data/scene-primitives.json"), JSON.stringify(scene.map((c) => ({ id: c.id, label: c.label, defaults: c.defaults })), null, 2));
writeFileSync(out("data/covers.json"), JSON.stringify(covers, null, 2));

// 5) cover grid preview page
writeFileSync(out("preview.html"), `<!doctype html><meta charset="utf-8"><title>Vedika covers</title><style>body{font:14px system-ui;background:#eef2ef;display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:16px;padding:20px}figure{margin:0;background:#fff;border-radius:10px;overflow:hidden}img{width:100%;display:block}figcaption{padding:10px}</style>` +
  covers.map((c) => `<figure><img src="svg/covers/${c.id}.svg"><figcaption><b>${c.name}</b><br>${c.category} · ${c.theme}<br>${c.elementCount} elements</figcaption></figure>`).join(""));

console.log(`components: ${componentList.length}, covers: ${covers.length}, png: ${hasRsvg}`);
