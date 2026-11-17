import ElementView from "./components/ElementView.jsx";

// Drop-in cover for a template card:  <TemplateCover template={t} />
// Pass `selectedId` / `onSelect` to make elements clickable in the editor.
export default function TemplateCover({ template, selectedId, onSelect, className = "" }) {
  return (
    <svg viewBox="0 0 400 300" className={className} style={{ width: "100%", aspectRatio: "4 / 3" }} role="img" aria-label={template.name}>
      {template.elements.map((el) => (
        <ElementView key={el.id} element={el} selected={el.id === selectedId} onSelect={onSelect} />
      ))}
    </svg>
  );
}
