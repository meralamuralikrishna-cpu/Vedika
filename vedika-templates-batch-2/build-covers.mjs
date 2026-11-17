import { writeFileSync, mkdirSync } from "node:fs";
import { newTemplates } from "./newTemplates.js";
import { renderCover } from "./renderCover.js";

mkdirSync("covers", { recursive: true });
for (const t of newTemplates) {
  writeFileSync(`covers/${t.id}.svg`, renderCover(t));
}
writeFileSync("templates.json", JSON.stringify(newTemplates, null, 2));

// Preview sheet to eyeball all covers in a browser
const cards = newTemplates
  .map(
    (t) => `<figure><img src="covers/${t.id}.svg" width="300"><figcaption><b>${t.name}</b><br>${t.category} · ${t.theme}<br>${t.elementCount} elements${t.floorPlanReady ? " · Floor plan ready" : ""}</figcaption></figure>`
  )
  .join("");
writeFileSync(
  "preview.html",
  `<!doctype html><meta charset="utf-8"><title>New templates</title><style>body{font:14px system-ui;background:#eef2ef;display:flex;flex-wrap:wrap;gap:16px;padding:20px}figure{margin:0;background:#fff;border-radius:10px;overflow:hidden;width:300px}figcaption{padding:10px}</style>${cards}`
);
console.log(`Built ${newTemplates.length} covers`);
