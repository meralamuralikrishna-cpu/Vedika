import backdrop from "./Backdrop.js";
import curtain from "./Curtain.js";
import floralWall from "./FloralWall.js";
import arch from "./Arch.js";
import mandap from "./Mandap.js";
import swing from "./Swing.js";
import lights from "./Lights.js";
import diyas from "./Diyas.js";
import balloons from "./Balloons.js";
import lanterns from "./Lanterns.js";
import sofa from "./Sofa.js";
import pillars from "./Pillars.js";
import rings from "./Rings.js";
import rangoli from "./Rangoli.js";
import stage from "./Stage.js";
import chandelier from "./Chandelier.js";
import toran from "./Toran.js";
import cradle from "./Cradle.js";
import cake from "./Cake.js";
import { W, H, FLOOR_Y } from "./shared.js";

// Registry: element `type` -> renderer. Add a new component here to make it available everywhere.
export const components = {
  backdrop,
  curtain,
  floralWall,
  arch,
  mandap,
  swing,
  lights,
  diyas,
  balloons,
  lanterns,
  sofa,
  pillars,
  rings,
  rangoli,
  stage,
  chandelier,
  toran,
  cradle,
  cake,
};

export { W, H, FLOOR_Y };
export default components;
