import { useReducer, useCallback } from "react";
import { ELEMENT_MAP } from "./elements";

export const defaultVenue = { enabled: false, image: null, showGrid: true, gridSize: 40, widthM: 12, depthM: 8 };
export const emptyScene = { name: "Untitled design", bg: ["#2a0a12", "#7a1424"], floor: ["#4a0f1a", "#d9a441"], palette: ["#F2A71B", "#8A1C2B", "#E9C46A", "#D1495B", "#FFF3C4"], elements: [], venue: defaultVenue };

let counter = 0;
const newId = () => `el-${Date.now().toString(36)}-${counter++}`;

function reducer(s, a) {
  switch (a.type) {
    case "checkpoint": return { ...s, past: [...s.past.slice(-49), s.present], future: [] };
    case "set": return { ...s, present: a.fn(s.present) };
    case "undo": return s.past.length ? { past: s.past.slice(0, -1), present: s.past[s.past.length - 1], future: [s.present, ...s.future] } : s;
    case "redo": return s.future.length ? { past: [...s.past, s.present], present: s.future[0], future: s.future.slice(1) } : s;
    case "load": return { past: [], present: a.scene, future: [] };
    default: return s;
  }
}

export default function useSceneEditor(initial) {
  const [state, dispatch] = useReducer(reducer, { past: [], present: { ...emptyScene, ...initial, venue: { ...defaultVenue, ...(initial?.venue || {}) } }, future: [] });
  const set = useCallback((fn) => dispatch({ type: "set", fn }), []);
  const checkpoint = useCallback(() => dispatch({ type: "checkpoint" }), []);
  const commit = useCallback((fn) => { dispatch({ type: "checkpoint" }); dispatch({ type: "set", fn }); }, []);
  const mapEl = (id, patch) => (sc) => ({ ...sc, elements: sc.elements.map((e) => (e.id === id ? { ...e, ...patch } : e)) });
  const addAt = (type, x, y) => {
    const def = ELEMENT_MAP[type];
    if (!def) return null;
    const id = newId();
    commit((sc) => ({ ...sc, elements: [...sc.elements, { id, type, x: Math.round(x), y: Math.round(y), w: def.w, h: def.h, rotation: 0, color: def.color }] }));
    return id;
  };

  return {
    scene: state.present,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
    undo: () => dispatch({ type: "undo" }),
    redo: () => dispatch({ type: "redo" }),
    load: (scene) => dispatch({ type: "load", scene }),
    checkpoint,
    live: (id, patch) => set(mapEl(id, patch)),            // during a gesture / typing (call checkpoint first)
    apply: (id, patch) => commit(mapEl(id, patch)),        // one-shot change with its own undo step
    add: (type) => { const def = ELEMENT_MAP[type]; return def ? addAt(type, 400 - def.w / 2, 300 - def.h / 2) : null; },
    addAt,
    remove: (id) => commit((sc) => ({ ...sc, elements: sc.elements.filter((e) => e.id !== id) })),
    duplicate: (id) => { const nid = newId(); commit((sc) => { const el = sc.elements.find((e) => e.id === id); return el ? { ...sc, elements: [...sc.elements, { ...el, id: nid, x: el.x + 24, y: el.y + 24 }] } : sc; }); return nid; },
    reorder: (id, dir) => commit((sc) => {
      const i = sc.elements.findIndex((e) => e.id === id); const j = i + dir;
      if (i < 0 || j < 0 || j >= sc.elements.length) return sc;
      const els = [...sc.elements]; [els[i], els[j]] = [els[j], els[i]]; return { ...sc, elements: els };
    }),
    applyTheme: (t) => commit((sc) => ({ ...sc, bg: t.bg, floor: t.floor, palette: t.palette })),
    setName: (name) => set((sc) => ({ ...sc, name })),
    setVenue: (patch) => commit((sc) => ({ ...sc, venue: { ...sc.venue, ...patch } })),
  };
}
