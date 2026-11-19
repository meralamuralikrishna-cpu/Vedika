# vedika-cover-assets

Vector (SVG) versions of the 14 template covers and the 48 components from your `Vedika_Template_Covers` zip.
Covers are built *from* the components, so every cover element can be moved, recoloured or swapped in the Studio.

## What's inside
| Folder | Contents |
|---|---|
| `svg/covers/` | 14 covers, 1200x800 |
| `png/covers/` | the same covers as PNG |
| `svg/components/<group>/` | 48 components, 400x400 each (Backdrops, Fabric, Flowers, Furniture, Lights, Props, 8 each) |
| `png/components/<group>/` | PNG versions |
| `svg/sheets/`, `png/sheets/` | the six asset sheets, redrawn in the same layout as yours |
| `data/covers.json` | every cover with its element list, ready to load into the site |
| `data/components.json` | every component with its editable defaults (colours, sizes) |
| `data/scene-primitives.json` | background pieces used by covers (gradient, rect, garland ...) |
| `src/` | source: components, covers, renderer, React components |
| `preview.html` | open in a browser to see all 14 covers |

## Covers
Birthday Balloon Bash, Blush Arch Ceremony, Diwali Glow Courtyard, Engagement Ring Night, Ivory Elegance Dinner,
Marigold Courtyard, Mehendi Courtyard Bloom, Sage Garden Reception, Sangeet Night Lights, Silver Anniversary Soirée,
Soft Baby Shower Garden, Valentine's Candlelit Dinner, Valentine's Sweetheart Stage, Royal Gold Mandap.

## Cover data format
```js
{ id, name, category, theme, tags, floorPlanReady, elementCount,
  elements: [
    { id: "arch", type: "floral-arch", x: 200, y: 200, s: 1, color: "#e8a5a8" },  // component
    { id: "floor", type: "rect", x: 0, y: 660, w: 1200, h: 140, fill: "#07374d" } // scene primitive
  ] }
```
- Component elements: `x, y` is the centre of the component's 400x400 box, `s` is scale (`sx`/`sy` stretch, `rot` rotates).
  Any other key overrides that component's defaults (see `data/components.json`).
- Scene primitives (`bg, rect, circle, ellipse, poly, path, line, stars, dotRow, ringGarland, swagGarland, gate, scallops, strand`)
  use absolute cover coordinates.

## Use in the website
```jsx
import CoverView from "./src/react/CoverView.jsx";
import ComponentPalette from "./src/react/ComponentPalette.jsx";
import { covers } from "./src/covers/covers.js";

<CoverView cover={covers[0]} />                       // template card
<ComponentPalette onAdd={(el) => addElement(el)} />   // Studio sidebar
```
Or just use the files: `<img src="/svg/covers/royal-gold-mandap.svg">`.

## Rebuild / extend
`npm run build` regenerates everything in `svg/`, `png/` and `data/` (PNG needs `rsvg-convert`).
To add a component: add `{ id, label, defaults, draw }` to a file in `src/components/`, and it appears in the palette,
the sheets and `data/components.json` automatically.

Note: these are redrawn vector versions that follow your PNGs closely, not pixel-exact copies.
