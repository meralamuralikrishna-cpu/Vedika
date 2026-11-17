export default function VenuePanel({ venue, onChange }) {
  const onFile = (e) => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = () => onChange({ image: r.result }); r.readAsDataURL(f); };
  return (
    <div className="studio-form">
      <label className="studio-check"><input type="checkbox" checked={venue.enabled} onChange={(e) => onChange({ enabled: e.target.checked })} /> Venue / floor-plan mode</label>
      <label className="studio-check"><input type="checkbox" checked={venue.showGrid} onChange={(e) => onChange({ showGrid: e.target.checked })} /> Show grid</label>
      <label>Grid size (px)<input type="number" min="10" max="200" value={venue.gridSize} onChange={(e) => onChange({ gridSize: Math.max(10, +e.target.value || 40) })} /></label>
      <label>Venue width (m)<input type="number" min="1" value={venue.widthM} onChange={(e) => onChange({ widthM: +e.target.value || 1 })} /></label>
      <label>Venue depth (m)<input type="number" min="1" value={venue.depthM} onChange={(e) => onChange({ depthM: +e.target.value || 1 })} /></label>
      <p className="studio-hint">One grid square is about {((venue.widthM / 800) * venue.gridSize).toFixed(2)} m wide.</p>
      <label>Plan image<input type="file" accept="image/*" onChange={onFile} /></label>
      {venue.image && <button className="studio-btn" onClick={() => onChange({ image: null })}>Remove plan image</button>}
    </div>
  );
}
