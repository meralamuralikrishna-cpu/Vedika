import { useState } from "react";
import { ASSETS, ASSET_CATEGORIES } from "../data/assets";

// onPick(asset) -> add the asset to your canvas
export default function AssetLibrary({ onPick }) {
  const [cat, setCat] = useState(ASSET_CATEGORIES[0]);
  const items = ASSETS.filter((a) => a.category === cat);

  return (
    <div className="assets">
      <div className="assets__tabs">
        {ASSET_CATEGORIES.map((c) => (
          <button key={c} className={`chip ${c === cat ? "is-active" : ""}`} onClick={() => setCat(c)}>
            {c[0].toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>
      <div className="assets__grid">
        {items.map((a) => (
          <button key={a.id} className="asset" onClick={() => onPick?.(a)} title={a.name}>
            <div className="asset__img"><img src={a.src} alt={a.name} /></div>
            <span>{a.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
