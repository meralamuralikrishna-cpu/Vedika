import { componentsById } from "../components/index.js";

// One component as a 400x400 icon:  <ComponentIcon type="floral-arch" color="#e8a5a8" />
// Extra props override that component's defaults (colours, sizes).
export default function ComponentIcon({ type, size = 64, ...overrides }) {
  const def = componentsById[type];
  if (!def) return null;
  const html = def.draw({ ...def.defaults, ...overrides });
  return <svg viewBox="0 0 400 400" width={size} height={size} role="img" aria-label={def.label} dangerouslySetInnerHTML={{ __html: html }} />;
}
