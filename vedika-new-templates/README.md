# vedika-new-templates

8 new starter layouts for Explore Templates, each with a cover and an editable element list.

| Template | Category | Theme | Elements | Floor plan |
|---|---|---|---|---|
| Mehendi Garden Swing | Mehendi | Parrot Green & Marigold | 5 | yes |
| Garba Navratri Mandap | Navratri | Saffron & Rani Pink | 7 | yes |
| Golden Anniversary Backdrop | Anniversary | Champagne & Gold | 7 | yes |
| Griha Pravesh Toran | Housewarming | Mango Green & Haldi | 5 | no |
| Diwali Diya Lounge | Diwali | Midnight & Amber | 6 | yes |
| Cradle Ceremony Bloom | Naming ceremony | Peach & Sage | 6 | yes |
| Starry Kids Birthday | Birthday | Sunny Yellow & Sky | 5 | no |
| Product Launch Stage | Corporate | Graphite & Electric Blue | 6 | yes |

## Files
- `newTemplates.js` – template data (id, name, category, theme, tags, floorPlanReady, elements, elementCount)
- `components/` – the element components, one file each (`Arch.js`, `Mandap.js`, `Swing.js` ...)
  - `index.js` – registry mapping element `type` to its component
  - `meta.js` – editor metadata (label, group, editable props) and default props for each component
  - `ElementView.jsx` – renders one element in React (supports click-to-select)
  - `ComponentPalette.jsx` – sidebar list that adds components to a design
  - `shared.js` – canvas size (400x300) and helpers
- `renderCover.js` – builds a cover SVG string from a template's elements
- `TemplateCover.jsx` – React cover: `<TemplateCover template={t} />`
- `build-covers.mjs` – `npm run build` writes `covers/*.svg`, `templates.json`, `preview.html`
- `covers/` – ready-made SVG covers

## Using in your site
1. Copy the folder into `src/` (or merge `newTemplates` into your existing templates array).
2. Render the card cover with `<TemplateCover template={t} />` or `<img src="/covers/<id>.svg">`.
3. New categories to add as filter chips: Mehendi, Navratri, Anniversary, Housewarming, Diwali, Naming ceremony.
4. Field names are generic. Rename them to match your own schema if they differ.

## Element types (components)
backdrop, curtain, floralWall, arch, mandap, swing, lights, diyas, balloons, lanterns,
sofa, pillars, rings, rangoli, stage, chandelier, toran, cradle, cake.
To add one: create `components/MyThing.js`, register it in `components/index.js`, and add entries in `components/meta.js`.
