import { backdrops } from "./backdrops.js";
import { fabric } from "./fabric.js";
import { flowers } from "./flowers.js";
import { furniture } from "./furniture.js";
import { lights } from "./lights.js";
import { props } from "./props.js";
import { scene } from "./scene.js";

// The six component libraries (8 items each) from the Vedika asset sheets.
export const groups = {
  backdrops: { title: "Backdrops", items: backdrops },
  fabric: { title: "Fabric", items: fabric },
  flowers: { title: "Flowers", items: flowers },
  furniture: { title: "Furniture", items: furniture },
  lights: { title: "Lights", items: lights },
  props: { title: "Props", items: props },
};

export const componentList = Object.entries(groups).flatMap(([group, g]) => g.items.map((c) => ({ ...c, group })));
export const componentsById = Object.fromEntries(componentList.map((c) => [c.id, c]));
export { scene };
export const sceneById = Object.fromEntries(scene.map((s) => [s.id, s]));
