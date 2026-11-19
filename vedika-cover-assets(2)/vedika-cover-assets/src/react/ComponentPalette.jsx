import { groups } from "../components/index.js";
import ComponentIcon from "./ComponentIcon.jsx";

// Studio sidebar: the six libraries (Backdrops, Fabric, Flowers, Furniture, Lights, Props).
// onAdd receives a ready element: { id, type, x, y, s } to push into a cover's `elements`.
export default function ComponentPalette({ onAdd }) {
  return (
    <div>
      {Object.entries(groups).map(([key, g]) => (
        <section key={key}>
          <h4>{g.title}</h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {g.items.map((c) => (
              <button
                key={c.id}
                title={c.label}
                onClick={() => onAdd({ id: `${c.id}-${Date.now()}`, type: c.id, x: 600, y: 400, s: 1 })}
              >
                <ComponentIcon type={c.id} size={56} />
                <small>{c.label}</small>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
