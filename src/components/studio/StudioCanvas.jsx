import { useRef, useState, useEffect, useCallback } from 'react';
import { Maximize2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { SceneBackdrop, ElementShape, CANVAS_W, CANVAS_H, FLOOR_Y } from '../../studio/SceneView';
import { ELEMENT_MAP } from '../../studio/elements';
import TemplateArt from '../../studio/TemplateArt';

export default function StudioCanvas({
  scene,
  selectedId,
  onSelect,
  onCheckpoint,
  onLive,
  onAddAt,
  zoom,
  onZoom,
  onFit,
  preview,
  svgRef,
}) {
  const containerRef = useRef(null);
  const drag = useRef(null);
  const [guides, setGuides] = useState({ x: null, y: null, floor: false });
  const [dragDims, setDragDims] = useState(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, startPanX: 0, startPanY: 0 });
  const isSpacePressed = useRef(false);

  // Convert screen coordinates to SVG viewBox coordinates
  const toSvg = useCallback(
    (e) => {
      const svg = svgRef.current;
      if (!svg) return { x: 0, y: 0 };
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const p = pt.matrixTransform(svg.getScreenCTM().inverse());
      return { x: p.x, y: p.y };
    },
    [svgRef]
  );

  // Keyboard navigation for Spacebar panning
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      if (e.code === 'Space' && !isSpacePressed.current) {
        isSpacePressed.current = true;
        if (containerRef.current) {
          containerRef.current.style.cursor = 'grab';
        }
      }
    };
    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        isSpacePressed.current = false;
        if (containerRef.current) {
          containerRef.current.style.cursor = '';
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const begin = (e, el, mode, corner = null) => {
    if (isSpacePressed.current || e.button === 1) return; // panning
    e.stopPropagation();
    onSelect(el.id);
    try {
      svgRef.current.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    drag.current = {
      mode,
      corner,
      id: el.id,
      start: toSvg(e),
      orig: { ...el },
      moved: false,
    };
  };

  const move = (e) => {
    const d = drag.current;
    if (!d) return;

    const p = toSvg(e);
    const dx = p.x - d.start.x;
    const dy = p.y - d.start.y;

    if (!d.moved) {
      if (Math.abs(dx) + Math.abs(dy) < 2) return;
      d.moved = true;
      onCheckpoint();
    }

    const o = d.orig;
    const a = ((o.rotation || 0) * Math.PI) / 180;
    let patch = {};
    const activeGuides = { x: null, y: null, floor: false };

    if (d.mode === 'move') {
      let nx = Math.round(o.x + dx);
      let ny = Math.round(o.y + dy);

      // Grid snapping if grid enabled
      const v = scene.venue;
      if (v?.enabled && v?.showGrid && v.gridSize > 0) {
        const gs = v.gridSize;
        nx = Math.round(nx / gs) * gs;
        ny = Math.round(ny / gs) * gs;
      }

      // Alignment guides
      const centerX = nx + o.w / 2;
      const centerY = ny + o.h / 2;
      const bottomY = ny + o.h;

      // Snap to canvas center X (400)
      if (Math.abs(centerX - CANVAS_W / 2) < 7) {
        nx = Math.round(CANVAS_W / 2 - o.w / 2);
        activeGuides.x = CANVAS_W / 2;
      }

      // Snap to canvas center Y (300)
      if (Math.abs(centerY - CANVAS_H / 2) < 7) {
        ny = Math.round(CANVAS_H / 2 - o.h / 2);
        activeGuides.y = CANVAS_H / 2;
      }

      // Snap to floor line (470)
      if (Math.abs(bottomY - FLOOR_Y) < 7) {
        ny = Math.round(FLOOR_Y - o.h);
        activeGuides.floor = true;
      }

      setGuides(activeGuides);
      patch = { x: nx, y: ny };
      setDragDims({ text: `X: ${nx}  Y: ${ny}` });
    } else if (d.mode === 'resize') {
      const corner = d.corner || 'se';
      const lx = dx * Math.cos(a) + dy * Math.sin(a);
      const ly = -dx * Math.sin(a) + dy * Math.cos(a);

      let w = o.w;
      let h = o.h;
      let cx = o.x + o.w / 2;
      let cy = o.y + o.h / 2;

      if (corner === 'se') {
        w = Math.max(20, Math.round(o.w + lx));
        h = Math.max(20, Math.round(o.h + ly));
        const dw = w - o.w;
        const dh = h - o.h;
        cx = o.x + o.w / 2 + (dw / 2) * Math.cos(a) - (dh / 2) * Math.sin(a);
        cy = o.y + o.h / 2 + (dw / 2) * Math.sin(a) + (dh / 2) * Math.cos(a);
      } else if (corner === 'sw') {
        w = Math.max(20, Math.round(o.w - lx));
        h = Math.max(20, Math.round(o.h + ly));
        const dw = w - o.w;
        const dh = h - o.h;
        cx = o.x + o.w / 2 - (dw / 2) * Math.cos(a) - (dh / 2) * Math.sin(a);
        cy = o.y + o.h / 2 - (dw / 2) * Math.sin(a) + (dh / 2) * Math.cos(a);
      } else if (corner === 'ne') {
        w = Math.max(20, Math.round(o.w + lx));
        h = Math.max(20, Math.round(o.h - ly));
        const dw = w - o.w;
        const dh = h - o.h;
        cx = o.x + o.w / 2 + (dw / 2) * Math.cos(a) + (dh / 2) * Math.sin(a);
        cy = o.y + o.h / 2 + (dw / 2) * Math.sin(a) - (dh / 2) * Math.cos(a);
      } else if (corner === 'nw') {
        w = Math.max(20, Math.round(o.w - lx));
        h = Math.max(20, Math.round(o.h - ly));
        const dw = w - o.w;
        const dh = h - o.h;
        cx = o.x + o.w / 2 - (dw / 2) * Math.cos(a) + (dh / 2) * Math.sin(a);
        cy = o.y + o.h / 2 - (dw / 2) * Math.sin(a) - (dh / 2) * Math.cos(a);
      }

      patch = {
        w,
        h,
        x: Math.round(cx - w / 2),
        y: Math.round(cy - h / 2),
      };
      setDragDims({ text: `${w} × ${h} px` });
    } else if (d.mode === 'rotate') {
      let ang =
        (Math.atan2(p.y - (o.y + o.h / 2), p.x - (o.x + o.w / 2)) * 180) / Math.PI + 90;
      if (e.shiftKey) {
        ang = Math.round(ang / 15) * 15;
      }
      const finalAngle = Math.round((ang + 360) % 360);
      patch = { rotation: finalAngle };
      setDragDims({ text: `${finalAngle}°` });
    }

    onLive(d.id, patch);
  };

  const end = (e) => {
    drag.current = null;
    setGuides({ x: null, y: null, floor: false });
    setDragDims(null);
    try {
      svgRef.current.releasePointerCapture(e.pointerId);
    } catch {
      /* not captured */
    }
  };

  // Workspace Pan Handling
  const handleStagePointerDown = (e) => {
    if (isSpacePressed.current || e.button === 1) {
      e.preventDefault();
      setIsPanning(true);
      panStart.current = {
        x: e.clientX,
        y: e.clientY,
        startPanX: pan.x,
        startPanY: pan.y,
      };
      if (containerRef.current) containerRef.current.style.cursor = 'grabbing';
      return;
    }
    // Clicking empty space deselects
    onSelect(null);
  };

  const handleStagePointerMove = (e) => {
    if (isPanning) {
      const dx = e.clientX - panStart.current.x;
      const dy = e.clientY - panStart.current.y;
      setPan({
        x: panStart.current.startPanX + dx,
        y: panStart.current.startPanY + dy,
      });
    }
  };

  const handleStagePointerUp = () => {
    if (isPanning) {
      setIsPanning(false);
      if (containerRef.current) {
        containerRef.current.style.cursor = isSpacePressed.current ? 'grab' : '';
      }
    }
  };

  // Handle Drag & Drop from Library onto Canvas
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('text/plain');
    if (!type) return;
    const def = ELEMENT_MAP[type];
    const p = toSvg(e);
    const dropX = def ? Math.round(p.x - def.w / 2) : Math.round(p.x - 40);
    const dropY = def ? Math.round(p.y - def.h / 2) : Math.round(p.y - 40);
    if (onAddAt) {
      const newId = onAddAt(type, dropX, dropY);
      if (newId) onSelect(newId);
    }
  };

  // Calculate zoom to fit
  const handleZoomToFit = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    const padding = 64;
    const availableW = clientWidth - padding;
    const availableH = clientHeight - padding;
    const fitScale = Math.min(availableW / CANVAS_W, availableH / CANVAS_H);
    const clampedScale = Math.max(0.25, Math.min(1.5, +fitScale.toFixed(2)));
    setPan({ x: 0, y: 0 });
    if (onZoom) onZoom(clampedScale);
  }, [onZoom]);

  const sel = scene.elements.find((e) => e.id === selectedId);
  const v = scene.venue;

  // Render grid lines if enabled
  const gridLines = [];
  if (v?.enabled && v?.showGrid && !preview) {
    const size = v.gridSize || 40;
    for (let x = 0; x <= CANVAS_W; x += size) {
      gridLines.push(<line key={`x${x}`} x1={x} y1="0" x2={x} y2={CANVAS_H} />);
    }
    for (let y = 0; y <= CANVAS_H; y += size) {
      gridLines.push(<line key={`y${y}`} x1="0" y1={y} x2={CANVAS_W} y2={y} />);
    }
  }

  return (
    <div
      ref={containerRef}
      className="studio-canvas-workspace"
      onPointerDown={handleStagePointerDown}
      onPointerMove={handleStagePointerMove}
      onPointerUp={handleStagePointerUp}
      onPointerLeave={handleStagePointerUp}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Transform Wrapper for Pan & Zoom */}
      <div
        className="studio-canvas-centerer"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px)`,
        }}
      >
        <svg
          ref={svgRef}
          className="studio-main-svg"
          viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
          style={{
            width: CANVAS_W * zoom,
            height: CANVAS_H * zoom,
          }}
          onPointerDown={(e) => {
            if (e.target === svgRef.current) onSelect(null);
          }}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
        >
          {/* Rounded Canvas Clip & Shadow Defs */}
          <defs>
            <clipPath id="studio-canvas-clip">
              <rect width={CANVAS_W} height={CANVAS_H} rx="12" ry="12" />
            </clipPath>
            <filter id="handle-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#26332E" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Canvas Background with Corner Clipping */}
          <g clipPath="url(#studio-canvas-clip)">
            <SceneBackdrop scene={scene} uid="studio" />
            {scene.templateArt && <TemplateArt template={scene.templateArt} />}
            {v?.enabled && v?.image && (
              <image
                href={v.image}
                x="0"
                y="0"
                width={CANVAS_W}
                height={CANVAS_H}
                preserveAspectRatio="xMidYMid meet"
                opacity=".6"
              />
            )}
          </g>

          {/* Grid lines */}
          {gridLines.length > 0 && (
            <g
              data-ui="true"
              stroke="#FFFFFF"
              strokeOpacity=".2"
              strokeWidth="1"
              pointerEvents="none"
              clipPath="url(#studio-canvas-clip)"
            >
              {gridLines}
            </g>
          )}

          {/* Render Elements in Scene */}
          {scene.elements.map((el) => (
            <g
              key={el.id}
              className="studio-element-group"
              style={{ cursor: preview ? 'default' : 'move' }}
              onPointerDown={(e) => !preview && begin(e, el, 'move')}
            >
              <ElementShape el={el} />
            </g>
          ))}

          {/* Alignment Guides */}
          {!preview && guides.x !== null && (
            <g data-ui="true" pointerEvents="none">
              <line
                x1={guides.x}
                y1="0"
                x2={guides.x}
                y2={CANVAS_H}
                stroke="#A61935"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
            </g>
          )}
          {!preview && guides.y !== null && (
            <g data-ui="true" pointerEvents="none">
              <line
                x1="0"
                y1={guides.y}
                x2={CANVAS_W}
                y2={guides.y}
                stroke="#A61935"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
            </g>
          )}
          {!preview && guides.floor && (
            <g data-ui="true" pointerEvents="none">
              <line
                x1="0"
                y1={FLOOR_Y}
                x2={CANVAS_W}
                y2={FLOOR_Y}
                stroke="#A61935"
                strokeWidth="2"
              />
            </g>
          )}

          {/* Selection Box & Transform Controls */}
          {sel && !preview && (
            <g
              data-ui="true"
              transform={`translate(${sel.x} ${sel.y}) rotate(${sel.rotation || 0} ${sel.w / 2} ${sel.h / 2})`}
            >
              {/* High-precision selection box */}
              <rect
                x="0"
                y="0"
                width={sel.w}
                height={sel.h}
                fill="none"
                stroke="#A61935"
                strokeWidth="1.5"
                strokeDasharray={drag.current?.mode === 'move' ? '5 4' : 'none'}
                pointerEvents="none"
              />

              {/* Rotation lollipop handle */}
              <line
                x1={sel.w / 2}
                y1="0"
                x2={sel.w / 2}
                y2="-26"
                stroke="#A61935"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <circle
                cx={sel.w / 2}
                cy="-26"
                r="7"
                fill="#FFFFFF"
                stroke="#A61935"
                strokeWidth="2"
                filter="url(#handle-shadow)"
                style={{ cursor: 'grab' }}
                onPointerDown={(e) => begin(e, sel, 'rotate')}
              />

              {/* 4 Corner Resize Handles */}
              {/* Top-Left */}
              <circle
                cx="0"
                cy="0"
                r="5.5"
                fill="#FFFFFF"
                stroke="#A61935"
                strokeWidth="2"
                filter="url(#handle-shadow)"
                style={{ cursor: 'nwse-resize' }}
                onPointerDown={(e) => begin(e, sel, 'resize', 'nw')}
              />
              {/* Top-Right */}
              <circle
                cx={sel.w}
                cy="0"
                r="5.5"
                fill="#FFFFFF"
                stroke="#A61935"
                strokeWidth="2"
                filter="url(#handle-shadow)"
                style={{ cursor: 'nesw-resize' }}
                onPointerDown={(e) => begin(e, sel, 'resize', 'ne')}
              />
              {/* Bottom-Left */}
              <circle
                cx="0"
                cy={sel.h}
                r="5.5"
                fill="#FFFFFF"
                stroke="#A61935"
                strokeWidth="2"
                filter="url(#handle-shadow)"
                style={{ cursor: 'nesw-resize' }}
                onPointerDown={(e) => begin(e, sel, 'resize', 'sw')}
              />
              {/* Bottom-Right */}
              <circle
                cx={sel.w}
                cy={sel.h}
                r="5.5"
                fill="#FFFFFF"
                stroke="#A61935"
                strokeWidth="2"
                filter="url(#handle-shadow)"
                style={{ cursor: 'nwse-resize' }}
                onPointerDown={(e) => begin(e, sel, 'resize', 'se')}
              />

              {/* Live Dimensions / Rotation Pill during manipulation */}
              {dragDims && (
                <g transform={`translate(${sel.w / 2} ${sel.h + 24})`}>
                  <rect
                    x="-45"
                    y="-12"
                    width="90"
                    height="20"
                    rx="10"
                    fill="#09251E"
                    opacity="0.9"
                  />
                  <text
                    x="0"
                    y="2"
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="11"
                    fontFamily="Inter, system-ui, sans-serif"
                    fontWeight="500"
                  >
                    {dragDims.text}
                  </text>
                </g>
              )}
            </g>
          )}
        </svg>
      </div>

      {/* Floating Bottom Zoom & View Dock */}
      <div className="studio-floating-zoom-dock" role="group" aria-label="Zoom controls">
        <button
          type="button"
          onClick={() => onZoom && onZoom(Math.max(0.25, +(zoom - 0.1).toFixed(2)))}
          title="Zoom out"
          aria-label="Zoom out"
        >
          <ZoomOut className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          className="studio-dock-zoom-val"
          onClick={() => onZoom && onZoom(1)}
          title="Click to reset to 100%"
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          type="button"
          onClick={() => onZoom && onZoom(Math.min(2, +(zoom + 0.1).toFixed(2)))}
          title="Zoom in"
          aria-label="Zoom in"
        >
          <ZoomIn className="h-3.5 w-3.5" />
        </button>
        <span className="studio-dock-divider" />
        <button
          type="button"
          onClick={handleZoomToFit}
          title="Zoom to fit workspace"
          aria-label="Fit to workspace"
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
