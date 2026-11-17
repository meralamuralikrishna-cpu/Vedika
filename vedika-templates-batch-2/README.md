# vedika-templates-batch-2

8 more starter layouts plus 8 new components (27 components total, self-contained).

| Template | Category | Theme | Elements | Floor plan |
|---|---|---|---|---|
| Eid Crescent Night | Eid | Midnight Teal & Gold | 6 | yes |
| Christmas Winter Lounge | Christmas | Pine Green & Ruby | 6 | no |
| Satyanarayan Puja Altar | Puja | Saffron & Banana Leaf | 5 | yes |
| Beach Sunset Mandap | Wedding | Coral & Sea Glass | 6 | yes |
| Boho Bridal Shower | Bridal shower | Blush & Sage | 5 | no |
| Graduation Night | Graduation | Navy & Gold | 6 | yes |
| Holi Colour Splash | Holi | Gulal Pink, Cyan & Yellow | 4 | no |
| Sangeet Palace Night | Sangeet | Royal Plum & Gold | 9 | yes |

## New components in this batch
crescent, tree, bunting, sea, altar, splash, gradCap, snow
(plus the 19 from batch 1: backdrop, curtain, floralWall, arch, mandap, swing, lights, diyas,
balloons, lanterns, sofa, pillars, rings, rangoli, stage, chandelier, toran, cradle, cake)

## Files
- `newTemplates.js` – template data
- `components/` – one file per element; `index.js` registry, `meta.js` editor labels/defaults,
  `ElementView.jsx`, `ComponentPalette.jsx`, `shared.js`
- `renderCover.js`, `TemplateCover.jsx` – cover rendering
- `build-covers.mjs` – `npm run build` writes `covers/*.svg`, `templates.json`, `preview.html`

## Using it
This folder includes all 27 components, so it can replace the batch 1 `components/` folder.
Merge `newTemplates` into your templates list, and add chips: Eid, Christmas, Puja, Bridal shower,
Graduation, Holi. To add a component: create `components/MyThing.js`, register it in
`components/index.js`, and add it to `components/meta.js`.
