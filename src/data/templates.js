// Bundled starter layouts (editable examples, not real client records).
// Each scene uses the SAME element ids as the Design Studio, so covers match the editor exactly.
import { defaultVenue } from "../studio/useSceneEditor";
import { THEMES } from "../studio/themes";
import { newTemplates as suppliedTemplates } from "../../vedika-new-templates/newTemplates.js";
import { newTemplates as batchTwoTemplates } from "../../vedika-templates-batch-2/newTemplates.js";
import { coverAssetTemplates } from "./coverAssetTemplates";

const suppliedCovers = import.meta.glob("../../vedika-new-templates/covers/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
});
const batchTwoCovers = import.meta.glob("../../vedika-templates-batch-2/covers/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
});

export const TEMPLATE_CATEGORIES = ["Birthday", "Wedding", "Diwali", "Engagement", "Reception", "Haldi", "Mehendi", "Sangeet", "Anniversary", "Baby shower", "Valentine's", "Corporate", "Navratri", "Housewarming", "Naming ceremony", "Eid", "Christmas", "Puja", "Bridal shower", "Graduation", "Holi", "Dinner"];
const theme = (id) => THEMES.find((t) => t.id === id);
// element tuple: [type, x, y, w, h, color, rotation?]
const build = (id, name, themeId, els, venue = {}) => {
  const t = theme(themeId);
  return { name, bg: t.bg, floor: t.floor, palette: t.palette, venue: { ...defaultVenue, ...venue },
    elements: els.map(([type, x, y, w, h, color, rotation = 0], i) => ({ id: `${id}-${i}`, type, x, y, w, h, color, rotation })) };
};
const T = (id, title, category, themeId, tags, els, venueMode = false) => {
  const scene = build(id, title, themeId, els, venueMode ? { enabled: true, showGrid: true } : {});
  return { id, title, category, theme: theme(themeId).name, tags, venueMode, scene, elementCount: els.length, cover: `/images/templates/${id}.svg` };
};

const bundledTemplates = [
  T("wedding-mandap", "Marigold Mandap", "Wedding", "marigold-maroon", ["mandap", "garland", "traditional"], [
    ["silk-drape", 40, 60, 120, 410, "#8A1C2B"], ["silk-drape", 640, 60, 120, 410, "#8A1C2B"], ["mandap", 220, 110, 360, 360, "#E9C46A"],
    ["marigold-garland", 245, 235, 310, 70, "#F2A71B"], ["marigold-garland", 245, 330, 310, 60, "#D1495B"], ["sofa", 320, 400, 160, 80, "#D1495B"], ["fairy-lights", 0, 10, 800, 80, "#FFD98A"]], true),
  T("haldi-yellow-wall", "Sunshine Haldi Wall", "Haldi", "turmeric", ["flower wall", "daytime", "swing"], [
    ["flower-wall", 60, 60, 680, 340, "#F7B32B"], ["swing", 320, 250, 160, 220, "#6B4A0B"], ["marigold-garland", 0, 30, 800, 70, "#FFE8A3"], ["diya", 150, 440, 50, 30, "#C0561B"], ["diya", 600, 440, 50, 30, "#C0561B"]]),
  T("sangeet-night", "Sangeet Neon Night", "Sangeet", "violet-night", ["stage", "lights", "lanterns"], [
    ["silk-drape", 0, 0, 150, 470, "#5A2BD6"], ["silk-drape", 650, 0, 150, 470, "#5A2BD6"], ["stage-platform", 150, 380, 500, 90, "#241F63"],
    ["fairy-lights", 0, 20, 800, 90, "#FF9EC7"], ["lantern", 190, 70, 50, 100, "#FF5FA2"], ["lantern", 560, 90, 50, 100, "#7B5CFF"], ["chandelier", 350, 70, 100, 120, "#FFD166"]], true),
  T("reception-floral-stage", "Blush Reception Stage", "Reception", "ivory-blush", ["stage", "floral", "elegant"], [
    ["flower-wall", 120, 60, 560, 320, "#F2B5C4"], ["stage-platform", 120, 380, 560, 90, "#F4EFE6"], ["sofa", 320, 300, 160, 80, "#8A1C2B"],
    ["rose-cluster", 140, 330, 70, 70, "#E4577A"], ["rose-cluster", 590, 330, 70, 70, "#E4577A"], ["fairy-lights", 100, 10, 600, 80, "#FFD98A"]], true),
  T("birthday-balloon-arch", "Balloon Arch Party", "Birthday", "bright-party", ["balloons", "kids", "cake table"], [
    ["balloon-cluster", 60, 90, 160, 220, "#FF6B6B"], ["balloon-cluster", 590, 90, 160, 220, "#4D96FF"], ["balloon-cluster", 330, 40, 130, 180, "#FFD93D"],
    ["round-table", 330, 380, 140, 90, "#FFFFFF"], ["cake", 365, 318, 70, 70, "#FF6B6B"]]),
  T("baby-shower-pastel", "Pastel Baby Shower", "Baby shower", "soft-pastel", ["pastel", "balloons", "photo corner"], [
    ["floral-arch", 235, 100, 330, 370, "#CDB4DB"], ["balloon-cluster", 70, 150, 140, 190, "#BDE0FE"], ["balloon-cluster", 590, 150, 140, 190, "#FFC8DD"],
    ["round-table", 340, 400, 120, 70, "#FFFFFF"], ["cake", 365, 345, 70, 70, "#FFC8DD"]]),
  T("corporate-gala", "Midnight Gala", "Corporate", "navy-steel", ["stage", "minimal", "lighting"], [
    ["backdrop-panel", 150, 90, 500, 300, "#15233D"], ["stage-platform", 150, 390, 500, 80, "#2F4B7C"], ["fairy-lights", 0, 20, 800, 80, "#9FC5FF"],
    ["chandelier", 60, 40, 80, 100, "#9FC5FF"], ["chandelier", 660, 40, 80, 100, "#9FC5FF"]], true),
  T("engagement-rose-arch", "Rose Ring Arch", "Engagement", "rose-gold", ["arch", "roses", "ring ceremony"], [
    ["silk-drape", 60, 70, 120, 400, "#C9788F"], ["silk-drape", 620, 70, 120, 400, "#C9788F"], ["floral-arch", 230, 100, 340, 370, "#E8B4A0"],
    ["rose-cluster", 205, 120, 70, 70, "#FFB3C6"], ["rose-cluster", 525, 120, 70, 70, "#FFB3C6"], ["ring-pair", 340, 410, 120, 70, "#F4D58D"]]),
];

const adaptSuppliedTemplate = (item, covers, batch) => {
  const backdrop = item.elements.find((element) => element.type === "backdrop");
  return {
    id: item.id,
    title: item.name,
    category: item.category,
    theme: item.theme,
    tags: item.tags,
    venueMode: item.floorPlanReady,
    elementCount: item.elementCount,
    cover: covers[`../../${batch === 1 ? "vedika-new-templates" : "vedika-templates-batch-2"}/covers/${item.id}.svg`],
    scene: {
      name: item.name,
      bg: [backdrop?.fill ?? "#f4efe6", backdrop?.fill ?? "#f4efe6"],
      floor: [backdrop?.floor ?? "#c9a66b", backdrop?.trim ?? "#ffffff"],
      palette: [backdrop?.trim ?? "#ffffff", backdrop?.fill ?? "#f4efe6", backdrop?.floor ?? "#c9a66b"],
      venue: { ...defaultVenue, ...(item.floorPlanReady ? { enabled: true, showGrid: true } : {}) },
      templateArt: { ...item, componentSet: batch },
      elements: [],
    },
  };
};

const extraTemplates = suppliedTemplates.map((item) => adaptSuppliedTemplate(item, suppliedCovers, 1));
const batchTwoAppTemplates = batchTwoTemplates.map((item) => adaptSuppliedTemplate(item, batchTwoCovers, 2));

export const templates = [...bundledTemplates, ...extraTemplates, ...batchTwoAppTemplates, ...coverAssetTemplates];
