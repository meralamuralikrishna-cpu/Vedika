import { useMemo, useState } from 'react';
import { Search, X, MapPinned, Upload, Trash2, Grid } from 'lucide-react';
import { ELEMENTS } from '../../studio/elements';
import SaveToMoodboardButton from '@/components/workspace/SaveToMoodboardButton';

const CATEGORIES = [
  'Flowers',
  'Backdrops',
  'Furniture',
  'Lighting',
  'Fabrics',
  'Props',
  'Entrance',
  'Venue',
];

const describe = (element) => {
  if (element.description) return element.description;
  const category = element.category.toLowerCase();
  switch (category) {
    case 'flowers':
      return 'Fresh floral accents & garlands';
    case 'backdrops':
      return 'Architectural arches & screens';
    case 'furniture':
      return 'Stage seating, tables & swings';
    case 'lighting':
      return 'Warm fairy lights & chandeliers';
    case 'fabrics':
      return 'Silk drapes & scalloped valances';
    case 'props':
      return 'Ceremonial props & decor accents';
    case 'entrance':
      return 'Grand gates, rangoli & welcome boards';
    default:
      return `${category.charAt(0).toUpperCase()}${category.slice(1)} decor accent`;
  }
};

export default function ElementPalette({ onAdd, venue, onVenueChange }) {
  const [category, setCategory] = useState('Flowers');
  const [query, setQuery] = useState('');

  const items = useMemo(() => {
    if (category === 'Venue') return [];
    const search = query.trim().toLowerCase();
    return ELEMENTS.filter(
      (element) =>
        element.category === category &&
        (!search ||
          `${element.name} ${element.category} ${describe(element)}`
            .toLowerCase()
            .includes(search))
    );
  }, [category, query]);

  const handlePlanUpload = (e) => {
    const f = e.target.files?.[0];
    if (!f || !onVenueChange) return;
    const r = new FileReader();
    r.onload = () => onVenueChange({ image: r.result, enabled: true });
    r.readAsDataURL(f);
  };

  return (
    <aside className="studio-elements-library" aria-label="Decoration elements library">
      {/* Top Header */}
      <div className="studio-lib-header">
        <div className="studio-lib-title-row">
          <h2 className="studio-lib-heading">Elements</h2>
          <span className="studio-lib-count">
            {category === 'Venue' ? '1 tool' : `${items.length} items`}
          </span>
        </div>

        {/* Search Input */}
        <div className="studio-search-wrapper">
          <Search className="studio-search-icon" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search elements..."
            aria-label="Search decoration elements"
            className="studio-search-field"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="studio-search-clear"
              aria-label="Clear search"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Category Filter Buttons */}
        <div className="studio-categories-grid" role="tablist" aria-label="Element categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={category === cat}
              className={`studio-category-pill ${category === cat ? 'is-active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Elements Content List */}
      <div className="studio-lib-body">
        {category === 'Venue' ? (
          <div className="studio-venue-section">
            <div className="studio-venue-card-banner">
              <MapPinned className="h-5 w-5 text-[#A61935]" />
              <div>
                <h3 className="text-[13px] font-semibold text-[#26332E]">Venue floor plan</h3>
                <p className="text-[11px] text-[#82908A]">Set venue boundaries and place décor to scale</p>
              </div>
            </div>

            {venue && onVenueChange && (
              <div className="studio-venue-controls">
                <label className="studio-toggle-label">
                  <input
                    type="checkbox"
                    checked={venue.enabled}
                    onChange={(e) => onVenueChange({ enabled: e.target.checked })}
                    className="studio-checkbox"
                  />
                  <span>Enable floor plan mode</span>
                </label>

                <label className="studio-toggle-label">
                  <input
                    type="checkbox"
                    checked={venue.showGrid}
                    onChange={(e) => onVenueChange({ showGrid: e.target.checked })}
                    className="studio-checkbox"
                  />
                  <span>Show alignment grid</span>
                </label>

                <div className="studio-venue-inputs">
                  <div className="studio-compact-field">
                    <span>Grid size</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="10"
                        max="100"
                        value={venue.gridSize || 40}
                        onChange={(e) =>
                          onVenueChange({ gridSize: Math.max(10, +e.target.value || 40) })
                        }
                      />
                      <small>px</small>
                    </div>
                  </div>

                  <div className="studio-compact-field">
                    <span>Width</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="1"
                        value={venue.widthM || 12}
                        onChange={(e) =>
                          onVenueChange({ widthM: Math.max(1, +e.target.value || 1) })
                        }
                      />
                      <small>m</small>
                    </div>
                  </div>

                  <div className="studio-compact-field">
                    <span>Depth</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="1"
                        value={venue.depthM || 8}
                        onChange={(e) =>
                          onVenueChange({ depthM: Math.max(1, +e.target.value || 1) })
                        }
                      />
                      <small>m</small>
                    </div>
                  </div>
                </div>

                <div className="studio-plan-upload-box">
                  <label className="studio-upload-btn">
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload blueprint / plan image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePlanUpload}
                      className="hidden"
                    />
                  </label>

                  {venue.image && (
                    <button
                      type="button"
                      className="studio-remove-plan-btn"
                      onClick={() => onVenueChange({ image: null })}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-600" />
                      <span>Remove plan image</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : items.length === 0 ? (
          <div className="studio-lib-empty">
            <span className="text-2xl">⌕</span>
            <strong>No elements found</strong>
            <p>Try searching for a different keyword or choose another category.</p>
          </div>
        ) : (
          <div className="studio-element-cards-list">
            {items.map((element) => (
              <div
                key={element.id}
                role="button"
                tabIndex={0}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', element.id);
                  e.dataTransfer.effectAllowed = 'copy';
                }}
                onClick={() => onAdd(element.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onAdd(element.id);
                  }
                }}
                className="studio-element-card"
                title={`Click to add ${element.name} or drag onto canvas`}
              >
                <div className="studio-card-thumbnail">
                  <svg
                    viewBox={`0 0 ${element.w} ${element.h}`}
                    className="studio-card-svg"
                    aria-hidden="true"
                  >
                    {element.render(element.color)}
                  </svg>
                </div>
                <div className="studio-card-meta">
                  <span className="studio-card-name truncate">{element.name}</span>
                  <span className="studio-card-desc truncate">{describe(element)}</span>
                </div>
                <div className="studio-card-plus" aria-hidden="true">
                  +
                </div>
                <SaveToMoodboardButton className="studio-element-save" item={{ type: 'element', elementId: element.id, title: element.name, category: element.category, color: element.color }} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Helper */}
      <div className="studio-lib-footer">
        <span>Drag elements onto canvas or click to add</span>
      </div>
    </aside>
  );
}
