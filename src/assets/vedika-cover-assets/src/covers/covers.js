// 14 template covers (1200x800), composed from the component library plus scene primitives.
// Components:  { id, type: "<component id>", x, y, s, ...colour overrides }  (x,y = centre of its 400x400 box)
// Primitives:  bg / rect / circle / ellipse / poly / path / line / stars / dotRow / ringGarland /
//              swagGarland / gate / scallops / strand  (absolute cover coordinates)

const R = (id, x, y, w, h, fill, o) => ({ id, type: "rect", x, y, w, h, fill, ...o });
const C = (id, cx, cy, r, fill, o) => ({ id, type: "circle", cx, cy, r, fill, ...o });
const E = (id, cx, cy, rx, ry, fill, o) => ({ id, type: "ellipse", cx, cy, rx, ry, fill, ...o });
const P = (id, points, fill, o) => ({ id, type: "poly", points, fill, ...o });
const D = (id, d, o) => ({ id, type: "path", d, ...o });
const L = (id, x1, y1, x2, y2, stroke, w, o) => ({ id, type: "line", x1, y1, x2, y2, stroke, w, ...o });
const BG = (id, stops, dir = "v", o) => ({ id, type: "bg", stops, dir, ...o });
const K = (id, type, x, y, s, o) => ({ id, type, x, y, s, ...o });
const S = (id, type, o) => ({ id, type, ...o });

const cover = (id, name, category, theme, tags, elements) => ({
  id, name, category, theme, tags, floorPlanReady: false, elementCount: elements.length, elements,
});

export const covers = [
  cover("birthday-balloon-bash", "Birthday Balloon Bash", "Birthday", "Teal & Candy", ["birthday", "balloons", "cake", "kids"], [
    BG("sky", [[0, "#0e7d92"], [1, "#0a4f68"]], "d"),
    K("arch", "balloon-arch", 200, 200, 1, { cx: 605, cy: 668, rx: 520, ry: 540, n: 26, r: 46, blue: "#f3eee6" }),
    R("floor", 0, 660, 1200, 140, "#07374d"),
    R("plate", 466, 548, 281, 26, "#f3eee6"),
    R("cakeBottom", 507, 459, 199, 89, "#ff7fb0", { rx: 6 }), R("cakeTop", 548, 387, 117, 72, "#ffd24a", { rx: 5 }),
    L("candle", 607, 358, 607, 387, "#f6e7b0", 4), E("flame", 607, 346, 6, 13, "#ffd24a"),
    S("sparkles", "stars", { items: [[252, 533, 6], [972, 552, 6], [314, 295, 6], [914, 314, 6]], fill: "#f6e7b0" }),
  ]),

  cover("blush-arch-ceremony", "Blush Arch Ceremony", "Wedding", "Blush & Sage", ["wedding", "arch", "ceremony", "outdoor"], [
    BG("sky", [[0, "#f6e5df"], [1, "#ece9df"]]),
    D("hillBack", "M0,540 C 220,450 430,500 640,550 S 1000,650 1200,500 L1200,800 L0,800 Z", { fill: "#bcc8b0" }),
    D("hillFront", "M0,690 C 260,590 520,640 800,690 S 1100,610 1200,640 L1200,800 L0,800 Z", { fill: "#8fa88a" }),
    D("drape", "M339,668 Q 520,430 596,205 Q 680,430 879,668 Z", { fill: "#f8f1e2", opacity: 0.95 }),
    K("arch", "floral-arch", 200, 200, 1, { cx: 600, baseY: 676, legTopY: 360, rx: 228, ry: 190, r: 24, gap: 34, bloomR: 11, bloom: "#f7cfd4", vine: "" }),
    R("plank", 300, 684, 600, 18, "#e8d9c0", { rx: 9 }),
  ]),

  cover("diwali-glow-courtyard", "Diwali Glow Courtyard", "Diwali", "Twilight & Marigold", ["diwali", "lanterns", "marigold", "diyas"], [
    BG("sky", [[0, "#241651"], [0.55, "#5b2a47"], [1, "#8f3b2e"]]),
    R("floor", 0, 641, 1200, 159, "#3b1913"),
    S("gate", "gate", { x0: 406, x1: 806, topY: 302, baseY: 656, r: 40, dot: 17, step: 22, fill: "#f0861c" }),
    K("kalash", "kalash", 607, 568, 0.8, { ball: "#2d8a6a", top: "", ballR: 30 }),
    ...[[226, 122], [607, 80], [987, 142]].flatMap(([x, t], i) => [
      L(`cord${i}`, x, 0, x, t, "#d9a441", 3),
      R(`lantern${i}`, x - 30, t, 60, 105, "#ff9a2e", { rx: 18 }),
      R(`lanternGlow${i}`, x - 17, t + 14, 34, 77, "#ffe6a3", { rx: 10 }),
    ]),
    C("glowL", 120, 705, 51, "#8a5a2a", { opacity: 0.55 }), C("glowR", 1032, 705, 51, "#8a5a2a", { opacity: 0.55 }),
    S("diyasL", "dotRow", { x0: 65, x1: 346, y: 710, n: 6, r: 15, fill: "#ffd24a" }),
    S("diyasR", "dotRow", { x0: 826, x1: 1107, y: 710, n: 6, r: 15, fill: "#ffd24a" }),
  ]),

  cover("engagement-ring-night", "Engagement Ring Night", "Engagement", "Midnight & Blush", ["engagement", "ring", "night", "romantic"], [
    R("bg", 0, 0, 1200, 800, "#0e0d0b"),
    R("floor", 0, 680, 1200, 120, "#1b1612"),
    C("halo", 600, 382, 338, "#251d12"),
    D("goldGlow", "M885 382 A285 285 0 0 1 600 667", { fill: "none", stroke: "#ffd685", sw: 26, opacity: 0.22 }),
    D("goldArc", "M885 382 A285 285 0 0 1 600 667", { fill: "none", stroke: "#ffd685", sw: 8 }),
    S("blooms", "ringGarland", { cx: 600, cy: 382, R: 283, n: 30, r: 29, a0: 92, a1: 360, from: "#e8a5a8", to: "#f7ead8" }),
    S("vine", "ringGarland", { cx: 600, cy: 382, R: 283, n: 22, r: 6, a0: 175, a1: 290, from: "#6f8f75", to: "#6f8f75" }),
    P("diamond", [[600, 344], [634, 382], [600, 420], [566, 382]], "#ececec"),
    S("stars", "stars", { items: [[120, 159, 5], [1080, 219, 5], [180, 600, 5], [1039, 581, 5]], fill: "#b8a67a" }),
  ]),

  cover("ivory-elegance-dinner", "Ivory Elegance Dinner", "Reception", "Ivory & Taupe", ["dinner", "ivory", "candles", "table"], [
    R("bg", 0, 0, 1200, 800, "#fbf7ee"),
    D("wave", "M0,200 C 200,100 420,120 560,190 S 1000,230 1200,150 L1200,540 L0,540 Z", { fill: "#f3ede2" }),
    D("waveLine", "M0,200 C 200,100 420,120 560,190 S 1000,230 1200,150", { fill: "none", stroke: "#e6dcc8", sw: 4 }),
    P("tableTop", [[178, 459], [1018, 459], [1200, 538], [0, 538]], "#fffaee"),
    R("tableFront", 0, 538, 1200, 262, "#fcf8ee"),
    L("tableEdge", 0, 538, 1200, 538, "#e6dcc8", 4),
    R("candleL", 300, 408, 10, 62, "#c9a878"), R("candleM", 586, 363, 10, 107, "#c9a878"), R("candleR", 888, 404, 10, 66, "#c9a878"),
    E("flameL", 305, 396, 5, 10, "#ffd24a"), E("flameM", 591, 351, 5, 10, "#ffd24a"), E("flameR", 893, 392, 5, 10, "#ffd24a"),
    R("bowlL", 430, 476, 120, 52, "#e8e1d0", { rx: 14, stroke: "#d8d2c4", sw: 3 }),
    R("bowlR", 660, 476, 120, 52, "#e8e1d0", { rx: 14, stroke: "#d8d2c4", sw: 3 }),
    C("bloomL1", 470, 470, 24, "#fffaf0"), C("bloomL2", 500, 462, 26, "#fffaf0"), C("bloomL3", 530, 472, 22, "#fffaf0"),
    C("bloomR1", 700, 470, 24, "#fffaf0"), C("bloomR2", 730, 462, 26, "#fffaf0"), C("bloomR3", 760, 472, 22, "#fffaf0"),
    C("plateOuter", 600, 656, 56, "none", { stroke: "#c9b99a", sw: 3 }), C("plateInner", 600, 656, 38, "none", { stroke: "#c9b99a", sw: 3 }),
    E("napkinL", 226, 640, 19, 40, "none", { stroke: "#c9b99a", sw: 3 }), E("napkinR", 989, 640, 19, 40, "none", { stroke: "#c9b99a", sw: 3 }),
  ]),

  cover("marigold-courtyard", "Marigold Courtyard", "Haldi", "Marigold & Cream", ["haldi", "marigold", "courtyard", "garland"], [
    BG("sky", [[0, "#f6dfa7"], [1, "#f3e9d2"]]),
    R("beam", 0, 79, 1200, 31, "#7a4e2d"),
    P("coneL", [[120, 110], [41, 658], [281, 658]], "#f8f3e4"),
    P("coneR", [[1076, 110], [922, 658], [1162, 658]], "#f8f3e4"),
    C("sun", 600, 499, 99, "#f5db96"),
    R("floor", 0, 658, 1200, 142, "#d8b88a"),
    S("marigoldRow", "dotRow", { x0: 237, x1: 943, y: 720, n: 17, r: 26, fill: "#f0861c" }),
    K("diyaL", "diya", 499, 629, 0.38, { glowOpacity: 0 }), K("diyaR", "diya", 699, 629, 0.38, { glowOpacity: 0 }),
    S("swag", "swagGarland", { baseY: 97, amp: 70, peakX: 600, period: 740 }),
  ]),

  cover("mehendi-courtyard-bloom", "Mehendi Courtyard Bloom", "Mehendi", "Sky & Marigold", ["mehendi", "marigold", "courtyard", "chowki"], [
    BG("sky", [[0, "#c3e1f0"], [1, "#ece9dc"]], "v", { h: 646 }),
    R("beam", 0, 86, 1200, 20, "#8c5a35"),
    R("pillarL", 0, 111, 79, 535, "#faf6e8"), R("pillarR", 1119, 111, 81, 535, "#faf6e8"),
    R("floor", 0, 646, 1200, 154, "#e3c9a0"),
    S("strand1", "strand", { x: 206, y0: 103, y1: 291, r: 13, step: 20 }),
    S("strand2", "strand", { x: 365, y0: 103, y1: 245, r: 13, step: 20 }),
    S("strand3", "strand", { x: 845, y0: 103, y1: 245, r: 13, step: 20 }),
    S("strand4", "strand", { x: 1006, y0: 103, y1: 291, r: 13, step: 20 }),
    S("swag", "swagGarland", { baseY: 100, amp: 60, peakX: 439, period: 640, rows: [{ dy: 0, r: 22, fill: "#f0861c" }, { dy: 18, r: 15, fill: "#f7b82a" }] }),
    R("chowkiTop", 487, 309, 240, 18, "#c97a3d", { rx: 9 }),
    P("chowkiBody", [[549, 327], [668, 327], [679, 449], [521, 449]], "#d9884a"),
    K("rangoli", "rangoli", 603, 708, 0.6),
    K("diyaL", "diya", 223, 667, 0.3, { glowOpacity: 0 }), K("diyaR", "diya", 991, 667, 0.3, { glowOpacity: 0 }),
  ]),

  cover("sage-garden-reception", "Sage Garden Reception", "Reception", "Sage Green", ["reception", "sage", "garden", "vases"], [
    R("bg", 0, 0, 1200, 800, "#6e8f74"),
    R("top", 0, 0, 1200, 165, "#35523f"),
    S("bandA", "scallops", { y: 165, r: 42, gap: 62, rectH: 95, fill: "#9fb89f" }),
    R("mid", 0, 260, 1200, 70, "#7f9f84"),
    S("bandB", "scallops", { y: 330, r: 46, gap: 70, rectH: 110, fill: "#4f7557" }),
    R("lower", 0, 440, 1200, 60, "#7f9f84"),
    C("glowL", 120, 456, 80, "#cfd5a0", { opacity: 0.75 }), C("glowM", 600, 447, 93, "#cfd5a0", { opacity: 0.75 }), C("glowR", 1080, 456, 80, "#cfd5a0", { opacity: 0.75 }),
    P("table", [[211, 490], [982, 490], [1200, 578], [0, 578]], "#e8eee1"),
    R("tableFront", 0, 578, 1200, 222, "#eaf0e3"),
    L("tableEdge", 0, 578, 1200, 578, "#c2cfba", 4),
    K("vaseL", "vase", 288, 528, 0.4, { flower1: "#fffaee", flower2: "#fffaee" }),
    K("vaseM", "vase", 600, 528, 0.4, { flower1: "#fffaee", flower2: "#fffaee" }),
    K("vaseR", "vase", 912, 528, 0.4, { flower1: "#fffaee", flower2: "#fffaee" }),
    ...[120, 259, 398, 537, 676, 815, 954].map((x, i) => C(`dot${i}`, x, 658, 31, "#ccdac8")),
  ]),

  cover("sangeet-night-lights", "Sangeet Night Lights", "Sangeet", "Violet Night", ["sangeet", "night", "spotlight", "throne"], [
    BG("sky", [[0, "#1d1450"], [0.6, "#3b1860"], [1, "#4a1a62"]], "d"),
    P("beamL", [[0, 84], [0, 168], [600, 341], [600, 250]], "#8f80d0", { opacity: 0.28 }),
    P("beamR", [[1200, 84], [1200, 168], [600, 341], [600, 250]], "#8f80d0", { opacity: 0.28 }),
    P("spot", [[600, 302], [34, 662], [1183, 662]], "#6a2a78", { opacity: 0.8 }),
    R("floor", 0, 662, 1200, 138, "#130a2e"),
    R("throneFrame", 401, 442, 398, 220, "#d9a441", { rx: 70 }),
    R("stubL", 392, 612, 30, 50, "#d9a441"), R("stubR", 778, 612, 30, 50, "#d9a441"),
    R("throneInner", 437, 470, 326, 192, "#8e1f4d", { rx: 50 }),
    S("stageDots", "dotRow", { x0: 513, x1: 662, y: 691, n: 6, r: 8, fill: "#ffd24a" }),
    D("wire", "M0 93 C 140 190, 360 180, 600 74 S 1000 -60, 1200 20", { fill: "none", stroke: "#fbf3e0", sw: 4 }),
    S("bulbs", "stars", { items: [[79, 134, 10], [199, 187, 10], [339, 207, 10], [480, 168, 10], [600, 79, 10], [720, 168, 10], [859, 207, 10], [999, 187, 10], [1119, 135, 10]], fill: "#fbf3e0" }),
  ]),

  cover("silver-anniversary-soiree", "Silver Anniversary Soirée", "Anniversary", "Silver & White", ["anniversary", "silver", "chandelier", "table"], [
    R("bg", 0, 0, 1200, 800, "#f3f1ec"),
    D("edgeL", "M0,0 C 90,160 100,560 0,800 Z", { fill: "#e1dfdb" }),
    D("edgeR", "M1200,0 C 1110,160 1100,560 1200,800 Z", { fill: "#e1dfdb" }),
    P("tableTop", [[110, 499], [1090, 499], [1200, 581], [0, 581]], "#fefcf8"),
    R("tableFront", 0, 581, 1200, 219, "#fdfbf6"),
    L("tableEdge", 0, 581, 1200, 581, "#d8d2c4", 4),
    S("dots", "dotRow", { x0: 120, x1: 999, y: 680, n: 12, r: 10, fill: "#c5cad6" }),
    L("rod", 600, 0, 600, 139, "#a9b0bb", 5),
    P("shade", [[459, 139], [742, 139], [682, 219], [519, 219]], "#d6d9df", { stroke: "#a9b0bb", sw: 5 }),
    L("armL", 516, 219, 480, 351, "#a9b0bb", 4), L("armR", 682, 219, 718, 351, "#a9b0bb", 4), L("armM", 600, 219, 600, 391, "#a9b0bb", 4),
    C("dropL", 480, 351, 14, "#ffffff", { stroke: "#a9b0bb", sw: 3 }), C("dropR", 718, 351, 14, "#ffffff", { stroke: "#a9b0bb", sw: 3 }), C("dropM", 600, 391, 16, "#ffffff", { stroke: "#a9b0bb", sw: 3 }),
    C("smallL", 540, 298, 8, "#ffffff", { stroke: "#a9b0bb", sw: 2 }), C("smallR", 660, 298, 8, "#ffffff", { stroke: "#a9b0bb", sw: 2 }),
    R("bowlM", 540, 476, 120, 48, "#c5cdd9", { rx: 12 }), R("bowlL", 260, 490, 79, 43, "#c5cdd9", { rx: 10 }), R("bowlR", 860, 490, 79, 43, "#c5cdd9", { rx: 10 }),
    C("bloomM1", 560, 470, 22, "#fceeee"), C("bloomM2", 600, 458, 26, "#fceeee"), C("bloomM3", 642, 470, 22, "#fceeee"),
    C("leafL", 528, 466, 9, "#6f8f75"), C("leafR", 672, 466, 9, "#6f8f75"),
    C("bloomL", 299, 484, 14, "#fceeee"), C("bloomR", 899, 484, 14, "#fceeee"),
  ]),

  cover("soft-baby-shower-garden", "Soft Baby Shower Garden", "Baby shower", "Soft Pastel", ["baby shower", "pastel", "balloons", "pampas"], [
    R("top", 0, 0, 1200, 260, "#c8d8c0"),
    S("scallops", "scallops", { y: 215, dir: "down", r: 36, gap: 54, rectH: 65, fill: "#dce8d5" }),
    R("mid", 0, 252, 1200, 346, "#f7f0ea"),
    R("floor", 0, 598, 1200, 202, "#efe3d5"),
    R("mat", 502, 641, 357, 21, "#e5d7c3", { rx: 10 }),
    L("s1", 341, 658, 259, 516, "#cbb89a", 3), L("s2", 341, 658, 380, 446, "#cbb89a", 3), L("s3", 341, 658, 478, 527, "#cbb89a", 3), L("s4", 341, 658, 339, 573, "#cbb89a", 3),
    C("b1", 259, 422, 94, "#f6c6ce"), C("b2", 380, 362, 84, "#cfe0ef"), C("b3", 478, 447, 80, "#fde8bb"), C("b4", 339, 499, 74, "#e6dcf0"),
    K("pampas", "pampas", 880, 442, 1.25, { sx: 0.7 }),
  ]),

  cover("valentines-candlelit-dinner", "Valentine's Candlelit Dinner", "Valentine's", "Crimson & Candlelight", ["valentine", "candles", "dinner", "romantic"], [
    R("bg", 0, 0, 1200, 800, "#22100f"),
    C("halo", 600, 353, 380, "#3e1a14"),
    R("floor", 0, 658, 1200, 142, "#240f10"),
    D("curtainL", "M0,0 L120,0 C 165,200 170,420 117,658 L0,658 Z", { fill: "#8e1f35" }),
    D("curtainR", "M1200,0 L1080,0 C 1035,200 1030,420 1083,658 L1200,658 Z", { fill: "#8e1f35" }),
    E("tableEdge", 600, 617, 380, 85, "#c9a87a"),
    E("table", 600, 605, 380, 85, "#f2e4d0", { stroke: "#c9a87a", sw: 5 }),
    C("glowL", 480, 408, 69, "#8a6a3c", { opacity: 0.6 }), C("glowR", 720, 408, 69, "#8a6a3c", { opacity: 0.6 }),
    R("candleL", 471, 427, 19, 123, "#f6e6cc", { rx: 4 }), R("candleR", 711, 427, 19, 123, "#f6e6cc", { rx: 4 }),
    E("flameL", 480, 408, 8, 18, "#ffd24a"), E("flameR", 720, 408, 8, 18, "#ffd24a"),
    C("glassL", 380, 569, 38, "none", { stroke: "#e2d3b4", sw: 3, opacity: 0.7 }), C("glassR", 819, 569, 38, "none", { stroke: "#e2d3b4", sw: 3, opacity: 0.7 }),
    C("rose1", 540, 569, 22, "#b11f3c"), C("rose2", 578, 569, 22, "#b11f3c"), C("rose3", 619, 569, 22, "#b11f3c"), C("rose4", 646, 569, 22, "#b11f3c"),
    S("petalsL", "dotRow", { x0: 233, x1: 370, y: 620, n: 5, r: 10, fill: "#e8a5b0" }),
    S("petalsR", "dotRow", { x0: 799, x1: 932, y: 620, n: 5, r: 10, fill: "#e8a5b0" }),
  ]),

  cover("valentines-sweetheart-stage", "Valentine's Sweetheart Stage", "Valentine's", "Rose & Noir", ["valentine", "stage", "ring", "loveseat"], [
    BG("glow", [[0, "#4e1522"], [0.55, "#2a0f17"], [1, "#150a10"]], "radial", { cx: 600, cy: 380, r: 620 }),
    R("floor", 0, 641, 1200, 159, "#2a0f17"),
    S("stars", "stars", { items: [[79, 79, 5], [219, 139, 5], [358, 58, 5], [500, 38, 5], [699, 38, 5], [840, 58, 5], [979, 139, 5], [1119, 79, 5], [120, 298, 5], [1080, 298, 5]], fill: "#ffd685" }),
    S("ring", "ringGarland", { cx: 600, cy: 370, R: 245, n: 28, r: 29, a0: 105, a1: 435, from: "#b11f3c", to: "#b11f3c", inner: "#d9506a", innerK: 0.8 }),
    S("ringDots", "ringGarland", { cx: 600, cy: 370, R: 212, n: 64, r: 3.5, a0: 0, a1: 360, from: "#f5e7c8", to: "#f5e7c8" }),
    R("seatBody", 449, 594, 302, 86, "#a32436", { rx: 24 }), R("seatCushion", 470, 540, 260, 74, "#c0344b", { rx: 30 }),
    E("flameL", 339, 674, 8, 14, "#ffc84a"), E("flameR", 859, 674, 8, 14, "#ffc84a"),
  ]),

  cover("royal-gold-mandap", "Royal Gold Mandap", "Wedding", "Emerald & Gold", ["wedding", "mandap", "gold", "royal"], [
    R("bg", 0, 0, 1200, 800, "#2a1c12"),
    R("floor", 0, 600, 1200, 200, "#4a3020"),
    E("glowL", 140, 680, 120, 28, "#5b3f27"), E("glowR", 1060, 680, 120, 28, "#5b3f27"),
    S("stars", "stars", { items: [[80, 120, 8], [180, 200, 6], [1120, 120, 8], [1020, 200, 6]], fill: "#8f7d62" }),
    L("rod", 600, 40, 600, 140, "#d8b25a", 6),
    P("shade", [[476, 137], [724, 137], [678, 248], [522, 248]], "#b8934a", { stroke: "#d6b26a", sw: 6 }),
    C("orbTop", 600, 160, 40, "#e3cc8e", { opacity: 0.85 }), C("orbBottom", 600, 285, 40, "#e3cc8e", { opacity: 0.85 }),
    P("roof", [[300, 232], [600, 140], [900, 232]], "#1f4b37"),
    R("beam", 300, 232, 600, 16, "#e6c27a"),
    D("valance", "M330 248 Q 400 345 500 250 Q 600 345 700 250 Q 800 345 870 248 Z", { fill: "#2d6b4e" }),
    D("valanceTrim", "M330 248 Q 400 345 500 250 Q 600 345 700 250 Q 800 345 870 248", { fill: "none", stroke: "#e6c27a", sw: 6 }),
    R("pillarL", 290, 240, 40, 385, "#d8b25a"), R("baseL", 280, 624, 60, 24, "#e6c27a"),
    R("pillarR", 870, 240, 40, 385, "#d8b25a"), R("baseR", 860, 624, 60, 24, "#e6c27a"),
    R("platform", 380, 580, 440, 60, "#e6c27a"), R("cushion", 410, 524, 380, 56, "#f2ead6"),
  ]),
];
