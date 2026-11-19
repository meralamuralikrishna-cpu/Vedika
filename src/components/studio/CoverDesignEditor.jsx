import { useMemo, useRef, useState, useEffect } from 'react';
import { componentsById } from '../../assets/vedika-cover-assets/src/components/index.js';
import { renderElement } from '../../assets/vedika-cover-assets/src/render.js';
import componentData from '../../assets/vedika-cover-assets/data/components.json';
import primitiveData from '../../assets/vedika-cover-assets/data/scene-primitives.json';
import ComponentPalette from '../../assets/vedika-cover-assets/src/react/ComponentPalette.jsx';
import StudioToolbar from './TemplateStudioToolbar';
import { coverElementBounds, coverElementName, isCoverComponent, moveCoverElement } from '../../studio/coverElements';

const W = 1200;
const H = 800;
const getCtx = (prefix) => ({ n: 0, uid(key) { return `${prefix}-${key}${this.n++}`; } });
const defs = new Map(componentData.map((item) => [item.id, item]));
const primitiveDefs = new Map(primitiveData.map((item) => [item.id, item]));

function elementMarkup(element, ctx) {
  const markup = renderElement(element, ctx);
  if (isCoverComponent(element) || (!(element.s && element.s !== 1) && !(element.rot && element.rot !== 0))) return markup;
  const box = coverElementBounds(element);
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  return `<g transform="translate(${cx} ${cy}) rotate(${element.rot || 0}) scale(${element.s || 1}) translate(${-cx} ${-cy})">${markup}</g>`;
}

function numberOrText(value) {
  return typeof value === 'object' ? JSON.stringify(value) : value;
}

function downloadSvg(svg, name) {
  const clone = svg.cloneNode(true);
  clone.querySelectorAll('[data-ui="true"]').forEach((node) => node.remove());
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  const blob = new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'design'}.svg`;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function downloadPng(svg, name) {
  const clone = svg.cloneNode(true);
  clone.querySelectorAll('[data-ui="true"]').forEach((node) => node.remove());
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('width', W * 2);
  clone.setAttribute('height', H * 2);
  const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml;charset=utf-8' }));
  try {
    const image = new Image();
    await new Promise((resolve, reject) => { image.onload = resolve; image.onerror = reject; image.src = url; });
    const canvas = document.createElement('canvas');
    canvas.width = W * 2;
    canvas.height = H * 2;
    canvas.getContext('2d').drawImage(image, 0, 0);
    canvas.toBlob((blob) => {
      const pngUrl = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = pngUrl;
      anchor.download = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'design'}.png`;
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(pngUrl), 1000);
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

function CoverProperties({ element, elements, onChange, onAction, onMove, onDelete }) {
  const definition = defs.get(element.type);
  const primitive = primitiveDefs.get(element.type);
  const controls = definition?.controls ?? Object.fromEntries(Object.keys(primitive?.defaults ?? element).filter((key) => !['id', 'type', 's', 'rot', 'sx', 'sy'].includes(key)).map((key) => {
    const value = element[key];
    return [key, typeof value === 'number' ? 'number' : (typeof value === 'string' && /^#[\da-f]{6}$/i.test(value) ? 'color' : (Array.isArray(value) ? 'list' : 'text'))];
  }));
  const [listDrafts, setListDrafts] = useState({});
  useEffect(() => setListDrafts({}), [element.id]);

  const field = (key, type) => {
    const value = element[key] ?? definition?.defaults?.[key] ?? primitive?.defaults?.[key] ?? '';
    const common = { key, onBlur: () => {}, className: 'cover-prop-input' };
    if (type === 'color' && typeof value === 'string' && /^#[\da-f]{6}$/i.test(value)) return <input {...common} type="color" value={value} onFocus={onChange.checkpoint} onChange={(event) => onChange.update(key, event.target.value)} />;
    if (type === 'number') return <input {...common} type="number" value={value} onFocus={onChange.checkpoint} onChange={(event) => onChange.update(key, Number(event.target.value) || 0)} />;
    if (type === 'list') {
      const draft = listDrafts[key] ?? JSON.stringify(value, null, 2);
      return <textarea {...common} rows={3} value={draft} onFocus={onChange.checkpoint} onChange={(event) => {
        const text = event.target.value;
        setListDrafts((prev) => ({ ...prev, [key]: text }));
        try { onChange.update(key, JSON.parse(text)); } catch { /* retain the draft until it becomes valid JSON */ }
      }} />;
    }
    return <input {...common} type="text" value={numberOrText(value)} onFocus={onChange.checkpoint} onChange={(event) => onChange.update(key, event.target.value)} />;
  };

  return (
    <aside className="studio-properties-panel cover-properties-panel" aria-label="Cover component properties">
      <div className="studio-props-header"><strong>{coverElementName(element)}</strong><small>{element.type}</small></div>
      <div className="cover-props-scroll">
        <label>Position X <input className="cover-prop-input" type="number" value={Math.round((coverElementBounds(element).x + coverElementBounds(element).w / 2))} onFocus={onChange.checkpoint} onChange={(e) => onMove(Number(e.target.value) - (coverElementBounds(element).x + coverElementBounds(element).w / 2), 0)} /></label>
        <label>Position Y <input className="cover-prop-input" type="number" value={Math.round((coverElementBounds(element).y + coverElementBounds(element).h / 2))} onFocus={onChange.checkpoint} onChange={(e) => onMove(0, Number(e.target.value) - (coverElementBounds(element).y + coverElementBounds(element).h / 2))} /></label>
        <label>Scale <input className="cover-prop-input" type="number" min="0.05" step="0.05" value={element.s ?? 1} onFocus={onChange.checkpoint} onChange={(e) => onChange.update('s', Math.max(0.05, Number(e.target.value) || 0.05))} /></label>
        <label>Rotation <input className="cover-prop-input" type="number" value={element.rot ?? 0} onFocus={onChange.checkpoint} onChange={(e) => onChange.update('rot', Number(e.target.value) || 0)} /></label>
        <hr />
        {Object.entries(controls).map(([key, type]) => <label key={key}>{key}{field(key, type)}</label>)}
        <div className="cover-layer-actions">
          <button onClick={() => onAction('duplicate')}>Duplicate</button>
          <button disabled={elements.findIndex((entry) => entry.id === element.id) === elements.length - 1} onClick={() => onAction('forward')}>Bring forward</button>
          <button disabled={elements.findIndex((entry) => entry.id === element.id) === 0} onClick={() => onAction('backward')}>Send backward</button>
          <button className="danger" onClick={onDelete}>Delete</button>
        </div>
      </div>
    </aside>
  );
}

export default function CoverDesignEditor({ initialScene, initialSettings, onSave, onShare, onClose }) {
  const [elements, setElements] = useState(() => initialScene.coverElements ?? []);
  const [name, setName] = useState(initialScene.name ?? 'Untitled design');
  const [selectedId, setSelectedId] = useState(null);
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);
  const [zoom, setZoom] = useState(1);
  const [preview, setPreview] = useState(false);
  const [venueEnabled, setVenueEnabled] = useState(Boolean(initialScene.venue?.enabled));
  const svgRef = useRef(null);
  const drag = useRef(null);
  const selected = elements.find((element) => element.id === selectedId);
  const context = useMemo(() => getCtx(initialScene.coverId ?? 'cover'), [initialScene.coverId]);
  const markup = useMemo(() => elements.map((element) => elementMarkup(element, context)).join(''), [elements, context]);

  const checkpoint = () => { setPast((items) => [...items.slice(-49), elements]); setFuture([]); };
  const edit = (fn, saveHistory = true) => { if (saveHistory) checkpoint(); setElements((items) => fn(items)); };
  const undo = () => {
    if (!past.length) return;
    setFuture((items) => [elements, ...items]);
    setElements(past[past.length - 1]);
    setPast((items) => items.slice(0, -1));
  };
  const redo = () => {
    if (!future.length) return;
    setPast((items) => [...items, elements]);
    setElements(future[0]);
    setFuture((items) => items.slice(1));
  };
  const addComponent = (element) => {
    const component = componentsById[element.type];
    const next = { ...element, id: `${element.type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` };
    if (component) Object.assign(next, component.defaults);
    next.id = `${element.type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    edit((items) => [...items, next]);
    setSelectedId(next.id);
  };

  const point = (event) => {
    const svg = svgRef.current;
    const p = svg.createSVGPoint();
    p.x = event.clientX; p.y = event.clientY;
    const mapped = p.matrixTransform(svg.getScreenCTM().inverse());
    return { x: mapped.x, y: mapped.y };
  };
  const pointerDown = (event) => {
    const handle = event.target.closest('[data-cover-handle]')?.getAttribute('data-cover-handle');
    const target = event.target.closest('[data-id]');
    const id = handle ? selectedId : target?.getAttribute('data-id');
    if (!id) { setSelectedId(null); return; }
    const element = elements.find((entry) => entry.id === id);
    if (!element) return;
    event.preventDefault();
    svgRef.current.setPointerCapture(event.pointerId);
    setSelectedId(id);
    const start = point(event);
    const box = coverElementBounds(element);
    drag.current = {
      id, handle: handle ?? 'move', start, element, elements,
      center: { x: box.x + box.w / 2, y: box.y + box.h / 2 },
      distance: Math.hypot(start.x - (box.x + box.w / 2), start.y - (box.y + box.h / 2)),
      angle: Math.atan2(start.y - (box.y + box.h / 2), start.x - (box.x + box.w / 2)),
      moved: false,
    };
  };
  const pointerMove = (event) => {
    const state = drag.current;
    if (!state) return;
    const now = point(event);
    const dx = now.x - state.start.x, dy = now.y - state.start.y;
    if (!state.moved && Math.abs(dx) + Math.abs(dy) < 2) return;
    state.moved = true;
    setElements(state.elements.map((element) => {
      if (element.id !== state.id) return element;
      if (state.handle === 'scale') {
        const distance = Math.max(20, Math.hypot(now.x - state.center.x, now.y - state.center.y));
        return { ...element, s: Math.max(0.05, (state.element.s ?? 1) * distance / Math.max(20, state.distance)) };
      }
      if (state.handle === 'rotate') {
        const angle = Math.atan2(now.y - state.center.y, now.x - state.center.x);
        return { ...element, rot: (state.element.rot ?? 0) + ((angle - state.angle) * 180 / Math.PI) };
      }
      return moveCoverElement(state.element, dx, dy);
    }));
  };
  const pointerUp = () => {
    if (drag.current?.moved) {
      setPast((items) => [...items.slice(-49), drag.current.elements]);
      setFuture([]);
    }
    drag.current = null;
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (/INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
      const mod = event.ctrlKey || event.metaKey;
      if (mod && event.key.toLowerCase() === 's') { event.preventDefault(); onSave?.(saveScene, initialSettings); }
      else if (mod && event.key.toLowerCase() === 'z') { event.preventDefault(); event.shiftKey ? redo() : undo(); }
      else if (mod && event.key.toLowerCase() === 'y') { event.preventDefault(); redo(); }
      else if ((event.key === 'Delete' || event.key === 'Backspace') && selectedId) { event.preventDefault(); edit((items) => items.filter((item) => item.id !== selectedId)); setSelectedId(null); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const updateProperty = (key, value) => edit((items) => items.map((item) => item.id === selectedId ? { ...item, [key]: value } : item), false);
  const updatePropertyCheckpoint = () => checkpoint();
  const moveSelected = (dx, dy) => edit((items) => items.map((item) => item.id === selectedId ? moveCoverElement(item, dx, dy) : item));
  const action = (kind) => {
    if (kind === 'duplicate') {
      const source = elements.find((item) => item.id === selectedId);
      if (!source) return;
      const copy = moveCoverElement({ ...source, id: `${source.id}-copy-${Date.now()}` }, 24, 24);
      edit((items) => {
        const index = items.findIndex((item) => item.id === selectedId);
        return [...items.slice(0, index + 1), copy, ...items.slice(index + 1)];
      });
      setSelectedId(copy.id);
      return;
    }
    edit((items) => {
    const index = items.findIndex((item) => item.id === selectedId);
    if (index < 0) return items;
    const to = kind === 'forward' ? Math.min(items.length - 1, index + 1) : Math.max(0, index - 1);
    if (to === index) return items;
    const next = [...items];
    [next[index], next[to]] = [next[to], next[index]];
    return next;
    });
  };
  const saveScene = { ...initialScene, name, coverElements: elements, venue: { ...initialScene.venue, enabled: venueEnabled } };

  const selectedBounds = selected ? coverElementBounds(selected) : null;
  return (
    <div className="studio-app-container cover-studio-app">
      <StudioToolbar name={name} onName={setName} canUndo={past.length > 0} canRedo={future.length > 0} onUndo={undo} onRedo={redo} zoom={zoom} onZoom={setZoom} onFit={() => setZoom(1)} floorPlanMode={venueEnabled} onToggleFloorPlan={() => setVenueEnabled((value) => !value)} onReset={() => { if (window.confirm('Reset canvas to initial layout? Any unsaved edits will be reverted.')) { setPast((items) => [...items, elements]); setFuture([]); setElements(initialScene.coverElements ?? []); setName(initialScene.name ?? 'Untitled design'); setSelectedId(null); } }} preview={preview} onPreview={setPreview} onPNG={() => downloadPng(svgRef.current, name)} onSVG={() => downloadSvg(svgRef.current, name)} onJSON={() => {
        const blob = new Blob([JSON.stringify(saveScene, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'design'}.json`; anchor.click(); URL.revokeObjectURL(url);
      }} onSave={onSave ? () => onSave(saveScene, initialSettings) : undefined} onShare={onShare ? () => onShare(saveScene, initialSettings) : undefined} onClose={onClose} isTemporarySession={!onSave} />
      <div className="studio-three-panel-layout">
        {!preview && <aside className="studio-elements-library cover-component-palette"><div className="studio-lib-header"><h2 className="studio-lib-heading">Components</h2><span className="studio-lib-count">48 items</span></div><div className="cover-component-palette-scroll"><ComponentPalette onAdd={addComponent} /></div><div className="studio-lib-footer">Select a group, then add a component to the cover</div></aside>}
        <main className="studio-center-canvas-area cover-editor-center">
          <div className="studio-canvas-workspace cover-canvas-workspace">
            <div className="cover-canvas-scale" style={{ transform: `scale(${zoom})` }}>
              <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" aria-label={`${name} design canvas`} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp}>
                <g dangerouslySetInnerHTML={{ __html: markup }} />
                {venueEnabled && !preview && <g data-ui="true" pointerEvents="none" opacity=".55">
                  {Array.from({ length: 23 }, (_, index) => <line key={`vx-${index}`} x1={(index + 1) * 50} y1="0" x2={(index + 1) * 50} y2={H} stroke="#477463" strokeWidth="1" strokeDasharray="3 5" />)}
                  {Array.from({ length: 15 }, (_, index) => <line key={`hy-${index}`} x1="0" y1={(index + 1) * 50} x2={W} y2={(index + 1) * 50} stroke="#477463" strokeWidth="1" strokeDasharray="3 5" />)}
                </g>}
                {selectedBounds && !preview && <g data-ui="true" pointerEvents="none">
                  <rect x={selectedBounds.x} y={selectedBounds.y} width={selectedBounds.w} height={selectedBounds.h} fill="none" stroke="#A61935" strokeWidth="2" strokeDasharray="7 5" />
                  <g pointerEvents="all"><circle data-cover-handle="rotate" cx={selectedBounds.x + selectedBounds.w / 2} cy={selectedBounds.y - 32} r="10" fill="#fff" stroke="#A61935" strokeWidth="3" /></g>
                  <g pointerEvents="all"><rect data-cover-handle="scale" x={selectedBounds.x + selectedBounds.w - 10} y={selectedBounds.y + selectedBounds.h - 10} width="20" height="20" rx="3" fill="#fff" stroke="#A61935" strokeWidth="3" /></g>
                </g>}
              </svg>
            </div>
          </div>
        </main>
        {!preview && selected && <CoverProperties element={selected} elements={elements} onChange={{ update: updateProperty, checkpoint: updatePropertyCheckpoint }} onAction={action} onMove={moveSelected} onDelete={() => { edit((items) => items.filter((item) => item.id !== selectedId)); setSelectedId(null); }} />}
        {!preview && !selected && <aside className="studio-properties-panel cover-properties-panel"><div className="studio-props-header"><strong>Cover settings</strong></div><label className="cover-floor-toggle"><input type="checkbox" checked={venueEnabled} onChange={(event) => setVenueEnabled(event.target.checked)} />Floor plan ready</label></aside>}
      </div>
    </div>
  );
}
