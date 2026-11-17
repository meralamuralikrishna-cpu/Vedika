import { useState } from "react";
import AssetLibrary from "./AssetLibrary";

// Simple starter editor: template cover as the stage, click assets to drop them on it.
export default function DesignStudio({ template }) {
  const [placed, setPlaced] = useState([]);

  const addAsset = (asset) =>
    setPlaced((p) => [...p, { uid: crypto.randomUUID(), src: asset.src, name: asset.name, x: 50, y: 60, size: 18 }]);

  const nudge = (uid, dx, dy) =>
    setPlaced((p) => p.map((i) => (i.uid === uid ? { ...i, x: i.x + dx, y: i.y + dy } : i)));

  if (!template) return <p className="muted">Pick a template from “Explore Templates” first.</p>;

  return (
    <div className="studio">
      <div>
        <h1>{template.title}</h1>
        <div className="stage">
          <img className="stage__bg" src={template.cover} alt="" />
          {placed.map((i) => (
            <img
              key={i.uid}
              className="stage__item"
              src={i.src}
              alt={i.name}
              style={{ left: `${i.x}%`, top: `${i.y}%`, width: `${i.size}%` }}
              draggable={false}
              onDoubleClick={() => setPlaced((p) => p.filter((x) => x.uid !== i.uid))}
              onClick={() => nudge(i.uid, 2, 0)}
            />
          ))}
        </div>
        <p className="muted">Click an asset to add it. Click it on the stage to nudge, double-click to remove. Swap in a drag library (dnd-kit / react-rnd) for real dragging.</p>
      </div>
      <AssetLibrary onPick={addAsset} />
    </div>
  );
}
