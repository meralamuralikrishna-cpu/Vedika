import { useEffect, useRef, useState, useCallback } from 'react';
import useSceneEditor, { emptyScene } from '../../studio/useSceneEditor';
import { exportPNG, exportJSON } from '../../studio/exporters';
import StudioCanvas from './StudioCanvas';
import StudioToolbar from './TemplateStudioToolbar';
import ElementPalette from './ElementPalette';
import PropertiesPanel from './TemplateStudioPropertiesPanel';
import { DEFAULT_SETTINGS } from '@/data/themes';
import CoverDesignEditor from './CoverDesignEditor';
import './studio.css';

export default function DesignStudio({
  initialScene,
  initialSettings,
  onSave,
  onShare,
  onClose,
}) {
  const ed = useSceneEditor(initialScene);
  const { scene } = ed;
  const svgRef = useRef(null);
  const [selectedId, setSelectedId] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [preview, setPreview] = useState(false);
  const [settings, setSettings] = useState(initialSettings || DEFAULT_SETTINGS);

  const sel = scene.elements.find((e) => e.id === selectedId) || null;

  // Keyboard Shortcuts (Undo, Redo, Delete, Save, Deselect)
  useEffect(() => {
    const onKey = (e) => {
      if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      const mod = e.ctrlKey || e.metaKey;

      if (mod && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        e.shiftKey ? ed.redo() : ed.undo();
      } else if (mod && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        ed.redo();
      } else if (mod && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (onSave) onSave(scene, settings);
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        e.preventDefault();
        ed.remove(selectedId);
        setSelectedId(null);
      } else if (e.key === 'Escape') {
        if (selectedId) setSelectedId(null);
        if (preview) setPreview(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [ed, selectedId, preview, onSave, scene, settings]);

  const handleApplyTheme = useCallback(
    (theme) => {
      ed.applyTheme(theme);
      setSettings((prev) => ({
        ...prev,
        themeId: theme.id,
        ...(theme.defaultSettings || {}),
      }));
    },
    [ed]
  );

  const handleReset = useCallback(() => {
    if (window.confirm('Reset canvas to initial layout? Any unsaved edits will be reverted.')) {
      ed.load(initialScene || emptyScene);
      setSelectedId(null);
      setZoom(1);
    }
  }, [ed, initialScene]);

  const handleFit = useCallback(() => {
    setZoom(0.95);
  }, []);

  if (initialScene?.coverElements) {
    return <CoverDesignEditor initialScene={initialScene} initialSettings={initialSettings} onSave={onSave} onShare={onShare} onClose={onClose} />;
  }

  return (
    <div className="studio-app-container">
      {/* Top compact editor toolbar (~55px) */}
      <StudioToolbar
        name={scene.name}
        onName={ed.setName}
        canUndo={ed.canUndo}
        canRedo={ed.canRedo}
        onUndo={ed.undo}
        onRedo={ed.redo}
        zoom={zoom}
        onZoom={setZoom}
        onFit={handleFit}
        floorPlanMode={Boolean(scene.venue?.enabled)}
        onToggleFloorPlan={() => ed.setVenue({ enabled: !scene.venue?.enabled })}
        onReset={handleReset}
        preview={preview}
        onPreview={setPreview}
        onPNG={() => exportPNG(svgRef.current, scene.name)}
        onJSON={() => exportJSON(scene)}
        onShare={onShare ? () => onShare(scene, settings) : undefined}
        onSave={onSave ? () => onSave(scene, settings) : undefined}
        onClose={onClose}
        isTemporarySession={!onSave}
      />

      {/* Main 3-panel editor body */}
      <div className="studio-three-panel-layout">
        {/* Panel 1: Center-left: Decoration elements library (200–220px) */}
        {!preview && (
          <ElementPalette
            onAdd={(type) => {
              const id = ed.add(type);
              if (id) setSelectedId(id);
            }}
            venue={scene.venue}
            onVenueChange={ed.setVenue}
          />
        )}

        {/* Panel 2: Center: Large design canvas (flexible width, warm ivory #F5F1EA) */}
        <main className="studio-center-canvas-area" role="main">
          <StudioCanvas
            scene={scene}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onCheckpoint={ed.checkpoint}
            onLive={ed.live}
            onAddAt={(type, x, y) => {
              const id = ed.addAt(type, x, y);
              if (id) setSelectedId(id);
              return id;
            }}
            zoom={zoom}
            onZoom={setZoom}
            onFit={handleFit}
            preview={preview}
            svgRef={svgRef}
          />
        </main>

        {/* Panel 3: Right: Properties and themes panel (225–245px) */}
        {!preview && (
          <PropertiesPanel
            el={sel}
            palette={scene.palette}
            ed={ed}
            settings={settings}
            onSettingsChange={setSettings}
            onApplyTheme={handleApplyTheme}
            onSelect={setSelectedId}
          />
        )}
      </div>
    </div>
  );
}
