// Batch 2: 8 more starter layouts (uses the 27 components in ./components).
const T = (t) => ({ ...t, elementCount: t.elements.length });

export const newTemplates = [
  T({
    id: "eid-crescent-night", name: "Eid Crescent Night", category: "Eid", theme: "Midnight Teal & Gold",
    tags: ["eid", "ramadan", "iftar", "crescent", "lanterns"], floorPlanReady: true,
    elements: [
      { id: "bg", type: "backdrop", fill: "#0f2a3f", floor: "#123a52", trim: "#f2c14e" },
      { id: "moon", type: "crescent", x: 90, y: 70, r: 32, color: "#f2c14e", cut: "#0f2a3f" },
      { id: "lanterns", type: "lanterns", cord: "#f2c14e", items: [{ x: 190, y: 44, color: "#f2c14e" }, { x: 250, y: 64, color: "#2a9d8f" }, { x: 310, y: 44, color: "#f2c14e" }, { x: 360, y: 70, color: "#2a9d8f" }] },
      { id: "arch", type: "arch", x: 140, y: 70, w: 120, h: 155, color: "#f2c14e", bloom: "#e9f5f2", thick: 6 },
      { id: "stage", type: "stage", x: 110, y: 205, w: 180, h: 20, color: "#1a5c73" },
      { id: "lights", type: "lights", y: 16, count: 24, color: "#ffe29a", sag: 8 },
    ],
  }),
  T({
    id: "christmas-winter-lounge", name: "Christmas Winter Lounge", category: "Christmas", theme: "Pine Green & Ruby",
    tags: ["christmas", "winter", "tree", "snow", "carols"], floorPlanReady: false,
    elements: [
      { id: "bg", type: "backdrop", fill: "#12324a", floor: "#e8eef2", trim: "#ffffff" },
      { id: "snow", type: "snow", count: 70 },
      { id: "tree", type: "tree", x: 200, y: 225, h: 160, color: "#1f6b3a", trim: ["#e63946", "#ffd166", "#4cc9f0"] },
      { id: "tree2", type: "tree", x: 90, y: 225, h: 95, color: "#2a8a4a", trim: ["#e63946", "#ffffff"] },
      { id: "tree3", type: "tree", x: 310, y: 225, h: 95, color: "#2a8a4a", trim: ["#ffd166", "#ffffff"] },
      { id: "lights", type: "lights", y: 18, count: 24, color: "#ffd166", sag: 10 },
    ],
  }),
  T({
    id: "satyanarayan-puja-altar", name: "Satyanarayan Puja Altar", category: "Puja", theme: "Saffron & Banana Leaf",
    tags: ["puja", "satyanarayan", "kalash", "altar", "religious"], floorPlanReady: true,
    elements: [
      { id: "bg", type: "backdrop", fill: "#fbe9c6", floor: "#c9a66b", trim: "#7a4a1d" },
      { id: "toran", type: "toran", x: 70, y: 30, w: 260, count: 9, colors: ["#f4a300", "#e8590c", "#ffc933"], rail: "#6b3f1d" },
      { id: "pillars", type: "pillars", xs: [70, 318], y: 40, h: 185, color: "#b5651d", cap: "#7a4a1d" },
      { id: "altar", type: "altar", x: 130, y: 160, w: 140, color: "#7a4a1d", cloth: "#e8590c" },
      { id: "rangoli", type: "rangoli", x: 200, y: 262, r: 26, colors: ["#e63946", "#f4a300", "#2a9d8f", "#ffffff"] },
    ],
  }),
  T({
    id: "beach-sunset-mandap", name: "Beach Sunset Mandap", category: "Wedding", theme: "Coral & Sea Glass",
    tags: ["wedding", "beach", "destination", "goa", "sunset"], floorPlanReady: true,
    elements: [
      { id: "sea", type: "sea", y: 90, colors: ["#ffd9a8", "#8fd3f4", "#4cc9f0", "#f2d49b"], sun: { x: 320, y: 62, r: 24, color: "#ff7b54" } },
      { id: "bg", type: "backdrop", fill: "#ffd9a8", floor: "#f2d49b", trim: "#ffffff" },
      { id: "sea2", type: "sea", y: 120, colors: ["#8fd3f4", "#4cc9f0", "#1a8fbf"], sun: null },
      { id: "arch", type: "arch", x: 140, y: 60, w: 120, h: 165, color: "#ffffff", bloom: "#ff9e80", thick: 7 },
      { id: "swing", type: "swing", x: 40, y: 110, w: 70, h: 110, frame: "#8d6e63", rope: "#d7ccc8", seat: "#ff9e80" },
      { id: "lights", type: "lights", y: 20, count: 22, color: "#fff3d6", sag: 8 },
    ],
  }),
  T({
    id: "boho-bridal-shower", name: "Boho Bridal Shower", category: "Bridal shower", theme: "Blush & Sage",
    tags: ["bridal shower", "boho", "bunting", "pastel", "brunch"], floorPlanReady: false,
    elements: [
      { id: "bg", type: "backdrop", fill: "#f8e6e0", floor: "#e7d3c4", trim: "#ffffff" },
      { id: "bunting", type: "bunting", y: 26, count: 12, colors: ["#e8b4a6", "#c5d5b5", "#f6e3c5", "#d9a5b3"], sag: 14 },
      { id: "arch", type: "arch", x: 120, y: 60, w: 160, h: 165, color: "#a7bf94", bloom: "#f0b8b0", thick: 7 },
      { id: "balloons", type: "balloons", items: [{ x: 60, y: 90, color: "#e8b4a6" }, { x: 90, y: 120, color: "#c5d5b5" }, { x: 340, y: 90, color: "#d9a5b3" }, { x: 312, y: 120, color: "#f6e3c5" }] },
      { id: "sofa", type: "sofa", x: 160, y: 200, w: 80, color: "#c98f86" },
    ],
  }),
  T({
    id: "graduation-night", name: "Graduation Night", category: "Graduation", theme: "Navy & Gold",
    tags: ["graduation", "convocation", "farewell", "party", "stage"], floorPlanReady: true,
    elements: [
      { id: "bg", type: "backdrop", fill: "#14213d", floor: "#0b1426", trim: "#fca311" },
      { id: "bunting", type: "bunting", y: 24, count: 14, colors: ["#fca311", "#ffffff", "#e5e5e5"], sag: 12 },
      { id: "cap", type: "gradCap", x: 200, y: 80, color: "#0b1426", tassel: "#fca311" },
      { id: "stage", type: "stage", x: 70, y: 185, w: 260, h: 40, color: "#22345c" },
      { id: "balloons", type: "balloons", items: [{ x: 60, y: 100, color: "#fca311" }, { x: 340, y: 100, color: "#fca311" }, { x: 90, y: 130, color: "#ffffff" }, { x: 310, y: 130, color: "#ffffff" }] },
      { id: "pillars", type: "pillars", xs: [40, 348], y: 70, h: 155, color: "#2c3e66", cap: "#fca311" },
    ],
  }),
  T({
    id: "holi-colour-splash", name: "Holi Colour Splash", category: "Holi", theme: "Gulal Pink, Cyan & Yellow",
    tags: ["holi", "colours", "gulal", "festival", "outdoor"], floorPlanReady: false,
    elements: [
      { id: "bg", type: "backdrop", fill: "#fff6e5", floor: "#f4d6a0", trim: "#ffffff" },
      { id: "splash", type: "splash", items: [{ x: 80, y: 80, r: 30, color: "#f72585" }, { x: 190, y: 120, r: 36, color: "#4cc9f0" }, { x: 310, y: 80, r: 32, color: "#ffd166" }, { x: 130, y: 170, r: 22, color: "#7209b7" }, { x: 270, y: 175, r: 24, color: "#06d6a0" }] },
      { id: "bunting", type: "bunting", y: 20, count: 12, colors: ["#f72585", "#4cc9f0", "#ffd166", "#06d6a0"], sag: 12 },
      { id: "rangoli", type: "rangoli", x: 200, y: 262, r: 26, colors: ["#f72585", "#ffd166", "#4cc9f0", "#ffffff"] },
    ],
  }),
  T({
    id: "sangeet-palace-night", name: "Sangeet Palace Night", category: "Sangeet", theme: "Royal Plum & Gold",
    tags: ["sangeet", "palace", "rajasthani", "dance floor", "chandelier"], floorPlanReady: true,
    elements: [
      { id: "bg", type: "backdrop", fill: "#3d1a4f", floor: "#220d2e", trim: "#f2c14e" },
      { id: "curtainL", type: "curtain", side: "left", color: "#7b2d8e" },
      { id: "curtainR", type: "curtain", side: "right", color: "#7b2d8e" },
      { id: "chandelier", type: "chandelier", x: 200, y: 34, color: "#f2c14e" },
      { id: "chandelier2", type: "chandelier", x: 120, y: 30, color: "#f2c14e" },
      { id: "chandelier3", type: "chandelier", x: 280, y: 30, color: "#f2c14e" },
      { id: "stage", type: "stage", x: 90, y: 180, w: 220, h: 45, color: "#5a2a73" },
      { id: "pillars", type: "pillars", xs: [78, 310], y: 80, h: 145, color: "#d4a73a", cap: "#f2c14e" },
      { id: "diyas", type: "diyas", x: 60, y: 245, w: 280, count: 8, color: "#d4881e" },
    ],
  }),
];

export default newTemplates;
