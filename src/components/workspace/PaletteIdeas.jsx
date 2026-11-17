import { useState } from "react";
import { THEMES } from "../../studio/themes";
import "./workspace.css";

export default function PaletteIdeas({ limit = 4, onUse }) {
  const [copied, setCopied] = useState("");
  const copy = async (hex) => { try { await navigator.clipboard.writeText(hex); setCopied(hex); setTimeout(() => setCopied(""), 1200); } catch { /* clipboard unavailable */ } };
  return (
    <section className="ws">
      <header className="ws-head"><h2>Palette ideas</h2></header>
      <div className="ws-grid ws-grid-sm">
        {THEMES.slice(0, limit).map((t) => (
          <div key={t.id} className="ws-palette">
            <div className="ws-palette-bars">{t.palette.map((c) => <button key={c} style={{ background: c }} onClick={() => copy(c)} aria-label={`Copy ${c}`} title={c} />)}</div>
            <div className="ws-palette-foot"><span>{t.name}</span>{onUse && <button className="ws-btn" onClick={() => onUse(t)}>Use</button>}</div>
            {t.palette.includes(copied) && <small className="ws-muted">Copied {copied}</small>}
          </div>
        ))}
      </div>
    </section>
  );
}
