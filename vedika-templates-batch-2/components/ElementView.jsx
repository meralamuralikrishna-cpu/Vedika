import { components } from "./index.js";

// One element as a React component, e.g. inside an <svg viewBox="0 0 400 300">.
// Use `selected` / `onSelect` for the Studio editor.
export default function ElementView({ element, selected = false, onSelect }) {
  const draw = components[element.type];
  if (!draw) return null;
  return (
    <g
      data-id={element.id}
      data-type={element.type}
      onClick={onSelect ? () => onSelect(element.id) : undefined}
      style={{ cursor: onSelect ? "pointer" : "default", outline: selected ? "2px dashed #9b1c31" : "none" }}
      dangerouslySetInnerHTML={{ __html: draw(element) }}
    />
  );
}
