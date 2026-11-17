import { componentMeta, componentDefaults } from "./meta.js";

// Sidebar list of draggable/clickable components for the Studio.
// onAdd receives a ready-to-use element: { id, type, ...defaults }.
export default function ComponentPalette({ onAdd }) {
  const groups = {};
  for (const [type, m] of Object.entries(componentMeta)) (groups[m.group] ||= []).push([type, m]);
  return (
    <div>
      {Object.entries(groups).map(([group, items]) => (
        <section key={group}>
          <h4>{group}</h4>
          {items.map(([type, m]) => (
            <button
              key={type}
              onClick={() => onAdd({ id: `${type}-${Date.now()}`, type, ...componentDefaults[type] })}
            >
              {m.label}
            </button>
          ))}
        </section>
      ))}
    </div>
  );
}
