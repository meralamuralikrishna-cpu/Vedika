import { useState, useEffect } from 'react';
import {
  ChevronDown,
  Copy,
  Layers,
  RotateCw,
  Trash2,
  X,
  Palette,
  Sliders,
  Sparkles,
  SunMedium,
  Check,
} from 'lucide-react';
import { ELEMENT_MAP } from '../../studio/elements';
import ThemePicker from './ThemePicker';

const ARRANGEMENT_STYLES = [
  { id: 'cascade', label: 'Cascade' },
  { id: 'symmetrical', label: 'Symmetrical' },
  { id: 'asymmetric', label: 'Asymmetric' },
  { id: 'minimal', label: 'Minimal' },
];

function CollapsibleSection({ title, icon: Icon, open, onToggle, children, badge }) {
  return (
    <div className="studio-prop-section">
      <button
        type="button"
        className="studio-prop-section-header"
        onClick={onToggle}
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-3.5 w-3.5 text-[#82908A]" />}
          <span className="studio-section-title">{title}</span>
          {badge && <span className="studio-section-badge">{badge}</span>}
        </div>
        <ChevronDown
          className={`h-3.5 w-3.5 text-[#82908A] transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      {open && <div className="studio-prop-section-body">{children}</div>}
    </div>
  );
}

function CompactNumberInput({ label, value, min = 0, onChange, onFocus }) {
  return (
    <div className="studio-number-field">
      <span className="studio-field-label">{label}</span>
      <input
        type="number"
        min={min}
        value={Math.round(value ?? 0)}
        onFocus={onFocus}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="studio-compact-input"
      />
    </div>
  );
}

export default function PropertiesPanel({
  el,
  palette = [],
  ed,
  settings = {},
  onSettingsChange,
  onApplyTheme,
  onSelect,
}) {
  // Tabs: 'element' or 'themes'
  const [activeTab, setActiveTab] = useState(el ? 'element' : 'themes');
  const [sectionsOpen, setSectionsOpen] = useState({
    appearance: true,
    transform: true,
    arrange: true,
    themes: true,
    arrangement: true,
  });

  // Automatically switch tab when an element is selected
  useEffect(() => {
    if (el) {
      setActiveTab('element');
    }
  }, [el?.id]);

  const toggleSection = (key) => {
    setSectionsOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const definition = el ? ELEMENT_MAP[el.type] : null;
  const change = (patch) => el && ed?.live(el.id, patch);
  const checkpoint = () => ed?.checkpoint();

  const isLighting = definition?.category?.toLowerCase() === 'lighting';
  const isFlower = definition?.category?.toLowerCase() === 'flowers';

  return (
    <aside className="studio-properties-panel" aria-label="Properties and themes panel">
      {/* Top Header with Tab Switcher */}
      <div className="studio-props-header">
        <div className="studio-props-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'themes'}
            className={`studio-prop-tab ${activeTab === 'themes' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('themes')}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Themes</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'element'}
            className={`studio-prop-tab ${activeTab === 'element' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('element')}
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Element {el && '•'}</span>
          </button>
        </div>
      </div>

      <div className="studio-props-scroll-area">
        {/* ================= ELEMENT PROPERTIES VIEW ================= */}
        {activeTab === 'element' && (
          <div className="studio-element-properties">
            {!el ? (
              <div className="studio-no-selection-empty">
                <div className="studio-empty-circle">
                  <Sliders className="h-5 w-5 text-[#82908A]" />
                </div>
                <h3 className="text-[13px] font-semibold text-[#26332E]">No element selected</h3>
                <p className="text-[11px] text-[#82908A] max-w-[180px] text-center">
                  Click any element on the canvas to edit its position, colors, and layout.
                </p>
                <button
                  type="button"
                  className="studio-switch-themes-btn"
                  onClick={() => setActiveTab('themes')}
                >
                  View Themes & Arrangement →
                </button>
              </div>
            ) : (
              <>
                {/* Selected Element Header Info */}
                <div className="studio-selected-summary">
                  <div className="min-w-0">
                    <span className="studio-category-tag">
                      {definition?.category || 'Decor'}
                    </span>
                    <h3 className="studio-selected-title truncate">
                      {definition?.name || el.type}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelect && onSelect(null)}
                    className="studio-deselect-btn"
                    title="Deselect element"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* 1. Appearance Section */}
                <CollapsibleSection
                  title="Appearance"
                  icon={Palette}
                  open={sectionsOpen.appearance}
                  onToggle={() => toggleSection('appearance')}
                >
                  {/* Theme Palette Swatches */}
                  <div className="studio-control-group">
                    <span className="studio-control-label">Color Palette</span>
                    <div className="studio-color-swatches" role="group" aria-label="Palette colors">
                      {palette.map((color, i) => {
                        const isMatch =
                          (el.color || '').toLowerCase() === (color || '').toLowerCase();
                        return (
                          <button
                            key={`${color}-${i}`}
                            type="button"
                            className={`studio-swatch-btn ${isMatch ? 'is-selected' : ''}`}
                            style={{ backgroundColor: color }}
                            title={`Set color to ${color}`}
                            onClick={() => ed?.apply(el.id, { color })}
                          >
                            {isMatch && <Check className="h-3 w-3 text-white drop-shadow-sm" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Fill Color Picker */}
                  <div className="studio-control-group">
                    <div className="flex items-center justify-between">
                      <span className="studio-control-label">Fill</span>
                      <span className="text-[11px] font-mono text-[#82908A]">
                        {el.color || definition?.color || '#000000'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="studio-color-picker-wrapper">
                        <input
                          type="color"
                          value={el.color || definition?.color || '#000000'}
                          onFocus={checkpoint}
                          onChange={(e) => change({ color: e.target.value })}
                          className="studio-native-color-picker"
                        />
                        <span
                          className="studio-color-preview-box"
                          style={{ backgroundColor: el.color || definition?.color }}
                        />
                      </label>
                      <input
                        type="text"
                        value={el.color || definition?.color || ''}
                        onFocus={checkpoint}
                        onChange={(e) => change({ color: e.target.value })}
                        className="studio-hex-input"
                        placeholder="#HEX"
                      />
                    </div>
                  </div>

                  {/* Border / Stroke Option */}
                  <div className="studio-control-group">
                    <div className="flex items-center justify-between">
                      <span className="studio-control-label">Border outline</span>
                      <label className="studio-switch-container">
                        <input
                          type="checkbox"
                          checked={Boolean(el.border)}
                          onChange={(e) => {
                            checkpoint();
                            change({
                              border: e.target.checked,
                              borderColor: el.borderColor || '#A61935',
                              borderWidth: 2,
                            });
                          }}
                          className="studio-checkbox"
                        />
                      </label>
                    </div>
                    {el.border && (
                      <div className="flex items-center gap-2 mt-1.5 animate-fade-in">
                        <input
                          type="color"
                          value={el.borderColor || '#A61935'}
                          onChange={(e) => change({ borderColor: e.target.value })}
                          className="studio-compact-color-dot"
                        />
                        <span className="text-[11px] text-[#82908A]">Outline color</span>
                      </div>
                    )}
                  </div>

                  {/* Opacity Slider */}
                  <div className="studio-control-group">
                    <div className="flex items-center justify-between">
                      <span className="studio-control-label">Opacity</span>
                      <span className="text-[11px] font-mono text-[#26332E]">
                        {Math.round((el.opacity !== undefined ? el.opacity : 1) * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={Math.round((el.opacity !== undefined ? el.opacity : 1) * 100)}
                      onPointerDown={checkpoint}
                      onChange={(e) => change({ opacity: Number(e.target.value) / 100 })}
                      className="studio-range-slider"
                    />
                  </div>
                </CollapsibleSection>

                {/* 2. Transform Section */}
                <CollapsibleSection
                  title="Transform"
                  icon={Sliders}
                  open={sectionsOpen.transform}
                  onToggle={() => toggleSection('transform')}
                >
                  <div className="studio-transform-grid">
                    <CompactNumberInput
                      label="X"
                      value={el.x}
                      onFocus={checkpoint}
                      onChange={(x) => change({ x })}
                    />
                    <CompactNumberInput
                      label="Y"
                      value={el.y}
                      onFocus={checkpoint}
                      onChange={(y) => change({ y })}
                    />
                    <CompactNumberInput
                      label="Width"
                      value={el.w}
                      min={20}
                      onFocus={checkpoint}
                      onChange={(w) => change({ w: Math.max(20, w) })}
                    />
                    <CompactNumberInput
                      label="Height"
                      value={el.h}
                      min={20}
                      onFocus={checkpoint}
                      onChange={(h) => change({ h: Math.max(20, h) })}
                    />
                  </div>

                  {/* Rotation Control */}
                  <div className="studio-control-group mt-2">
                    <div className="flex items-center justify-between">
                      <span className="studio-control-label">Rotation</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-mono text-[#26332E]">
                          {Math.round(el.rotation || 0)}°
                        </span>
                        <button
                          type="button"
                          className="studio-quick-rotate-btn"
                          title="Rotate 90 degrees clockwise"
                          onClick={() => {
                            checkpoint();
                            change({ rotation: ((el.rotation || 0) + 90) % 360 });
                          }}
                        >
                          <RotateCw className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="359"
                      value={Math.round(el.rotation || 0)}
                      onPointerDown={checkpoint}
                      onChange={(e) => change({ rotation: Number(e.target.value) })}
                      className="studio-range-slider"
                    />
                  </div>
                </CollapsibleSection>

                {/* 3. Arrange Section */}
                <CollapsibleSection
                  title="Arrange"
                  icon={Layers}
                  open={sectionsOpen.arrange}
                  onToggle={() => toggleSection('arrange')}
                >
                  <div className="studio-arrange-grid">
                    <button
                      type="button"
                      className="studio-arrange-btn"
                      onClick={() => ed?.reorder(el.id, 1)}
                      title="Bring element forward"
                    >
                      <Layers className="h-3.5 w-3.5 text-[#82908A]" />
                      <span>Bring forward</span>
                    </button>
                    <button
                      type="button"
                      className="studio-arrange-btn"
                      onClick={() => ed?.reorder(el.id, -1)}
                      title="Send element backward"
                    >
                      <Layers className="h-3.5 w-3.5 text-[#82908A] rotate-180" />
                      <span>Send backward</span>
                    </button>
                    <button
                      type="button"
                      className="studio-arrange-btn"
                      onClick={() => {
                        const newId = ed?.duplicate(el.id);
                        if (newId && onSelect) onSelect(newId);
                      }}
                      title="Duplicate element"
                    >
                      <Copy className="h-3.5 w-3.5 text-[#82908A]" />
                      <span>Duplicate</span>
                    </button>
                    <button
                      type="button"
                      className="studio-arrange-btn is-danger"
                      onClick={() => {
                        ed?.remove(el.id);
                        onSelect && onSelect(null);
                      }}
                      title="Delete element"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </CollapsibleSection>
              </>
            )}
          </div>
        )}

        {/* ================= THEMES & ARRANGEMENT VIEW ================= */}
        {activeTab === 'themes' && (
          <div className="studio-themes-view">
            {/* 1. Themes Section (at top) */}
            <CollapsibleSection
              title="Themes"
              icon={Sparkles}
              open={sectionsOpen.themes}
              onToggle={() => toggleSection('themes')}
              badge="5 Presets"
            >
              <ThemePicker activeThemeId={settings?.themeId} onApply={onApplyTheme} />
            </CollapsibleSection>

            {/* 2. Arrangement Section (below Themes) */}
            <CollapsibleSection
              title="Arrangement"
              icon={SunMedium}
              open={sectionsOpen.arrangement}
              onToggle={() => toggleSection('arrangement')}
            >
              {/* Flower Density Slider */}
              <div className="studio-control-group">
                <div className="flex items-center justify-between">
                  <span className="studio-control-label">Flower density</span>
                  <span className="text-[11px] font-mono text-[#26332E]">
                    {settings?.flowerDensity || 65}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={settings?.flowerDensity || 65}
                  onChange={(e) =>
                    onSettingsChange &&
                    onSettingsChange({
                      ...settings,
                      flowerDensity: Number(e.target.value),
                    })
                  }
                  className="studio-range-slider"
                />
              </div>

              {/* Lighting Intensity Slider */}
              <div className="studio-control-group">
                <div className="flex items-center justify-between">
                  <span className="studio-control-label">Lighting intensity</span>
                  <span className="text-[11px] font-mono text-[#26332E]">
                    {settings?.lightingIntensity || 55}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={settings?.lightingIntensity || 55}
                  onChange={(e) =>
                    onSettingsChange &&
                    onSettingsChange({
                      ...settings,
                      lightingIntensity: Number(e.target.value),
                    })
                  }
                  className="studio-range-slider"
                />
              </div>

              {/* Arrangement Style Buttons */}
              <div className="studio-control-group">
                <span className="studio-control-label">Arrangement style</span>
                <div className="studio-styles-grid" role="group" aria-label="Arrangement styles">
                  {ARRANGEMENT_STYLES.map((style) => {
                    const isSelected = (settings?.arrangementStyle || 'cascade') === style.id;
                    return (
                      <button
                        key={style.id}
                        type="button"
                        className={`studio-style-btn ${isSelected ? 'is-active' : ''}`}
                        onClick={() =>
                          onSettingsChange &&
                          onSettingsChange({
                            ...settings,
                            arrangementStyle: style.id,
                          })
                        }
                      >
                        {style.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </CollapsibleSection>
          </div>
        )}
      </div>
    </aside>
  );
}
