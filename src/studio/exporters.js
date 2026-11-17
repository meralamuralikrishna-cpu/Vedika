import { CANVAS_W, CANVAS_H } from "./SceneView";

const download = (blob, name) => { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); };
const slug = (s) => (s || "design").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "design";

export async function exportPNG(svg, name, scale = 2) {
  const clone = svg.cloneNode(true);
  clone.querySelectorAll('[data-ui="true"]').forEach((n) => n.remove());
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", CANVAS_W * scale); clone.setAttribute("height", CANVAS_H * scale); clone.removeAttribute("style");
  const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: "image/svg+xml;charset=utf-8" }));
  const img = new Image();
  await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = url; });
  const c = document.createElement("canvas"); c.width = CANVAS_W * scale; c.height = CANVAS_H * scale;
  c.getContext("2d").drawImage(img, 0, 0); URL.revokeObjectURL(url);
  c.toBlob((b) => download(b, `${slug(name)}.png`));
}

export function exportJSON(scene) {
  download(new Blob([JSON.stringify({ version: 1, scene }, null, 2)], { type: "application/json" }), `${slug(scene.name)}.json`);
}
