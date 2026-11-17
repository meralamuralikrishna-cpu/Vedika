import { useState } from 'react';
import {
  ArrowLeft,
  Download,
  Eye,
  FileCode,
  Image as ImageIcon,
  Map,
  Redo2,
  RotateCcw,
  Save,
  Share2,
  Undo2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

function ToolButton({
  label,
  children,
  onClick,
  disabled,
  active,
  variant = 'default',
  badge,
}) {
  return (
    <button
      type="button"
      className={`studio-tool-btn ${active ? 'is-active' : ''} ${variant === 'primary' ? 'is-primary' : ''} ${disabled ? 'is-disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      aria-pressed={active || undefined}
    >
      {children}
      {badge && <span className="studio-btn-badge">{badge}</span>}
    </button>
  );
}

export default function StudioToolbar({
  name,
  onName,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  zoom,
  onZoom,
  onFit,
  floorPlanMode,
  onToggleFloorPlan,
  onReset,
  preview,
  onPreview,
  onPNG,
  onJSON,
  onShare,
  onSave,
  onClose,
  isTemporarySession = false,
}) {
  return (
    <header className="studio-header-toolbar" role="toolbar" aria-label="Editor toolbar">
      {/* LEFT: Design name & Temporary session indicator */}
      <div className="studio-toolbar-left">
        {onClose && (
          <ToolButton label="Back to workspace" onClick={onClose}>
            <ArrowLeft className="h-4 w-4" />
          </ToolButton>
        )}
        <div className="studio-name-container">
          <input
            type="text"
            className="studio-title-input"
            value={name || 'Untitled design'}
            onChange={(e) => onName(e.target.value)}
            title="Click to rename design"
            aria-label="Design name"
          />
        </div>
        {(!onSave || isTemporarySession) && (
          <div className="studio-session-badge" title="Changes in this session are not saved to the cloud">
            <span className="studio-session-pulse" />
            <span>Temporary session</span>
          </div>
        )}
      </div>

      {/* CENTER: Undo, Redo, Zoom out, Zoom percentage, Zoom in, Floor plan, Reset, Preview */}
      <div className="studio-toolbar-center" aria-label="Canvas controls">
        <div className="studio-btn-group">
          <ToolButton label="Undo (Ctrl+Z)" onClick={onUndo} disabled={!canUndo}>
            <Undo2 className="h-4 w-4" />
          </ToolButton>
          <ToolButton label="Redo (Ctrl+Shift+Z)" onClick={onRedo} disabled={!canRedo}>
            <Redo2 className="h-4 w-4" />
          </ToolButton>
        </div>

        <span className="studio-toolbar-sep" aria-hidden="true" />

        <div className="studio-btn-group">
          <ToolButton
            label="Zoom out"
            onClick={() => onZoom(Math.max(0.25, +(zoom - 0.1).toFixed(2)))}
          >
            <ZoomOut className="h-4 w-4" />
          </ToolButton>
          <button
            type="button"
            className="studio-zoom-display"
            onClick={() => (onFit ? onFit() : onZoom(1))}
            title="Click to reset zoom"
            aria-label="Current zoom level"
          >
            {Math.round(zoom * 100)}%
          </button>
          <ToolButton
            label="Zoom in"
            onClick={() => onZoom(Math.min(2, +(zoom + 0.1).toFixed(2)))}
          >
            <ZoomIn className="h-4 w-4" />
          </ToolButton>
        </div>

        <span className="studio-toolbar-sep" aria-hidden="true" />

        <div className="studio-btn-group">
          <button
            type="button"
            className={`studio-pill-btn ${floorPlanMode ? 'is-active' : ''}`}
            onClick={onToggleFloorPlan}
            title="Toggle venue floor plan & grid"
            aria-pressed={floorPlanMode}
          >
            <Map className="h-3.5 w-3.5" />
            <span>Floor plan</span>
          </button>
          <ToolButton label="Reset canvas" onClick={onReset}>
            <RotateCcw className="h-4 w-4" />
          </ToolButton>
          <button
            type="button"
            className={`studio-pill-btn ${preview ? 'is-active' : ''}`}
            onClick={() => onPreview(!preview)}
            title="Toggle preview mode"
            aria-pressed={preview}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* RIGHT: Export PNG, Export JSON, Share, Save */}
      <div className="studio-toolbar-right">
        <button
          type="button"
          className="studio-action-btn"
          onClick={onPNG}
          title="Download PNG snapshot"
        >
          <ImageIcon className="h-3.5 w-3.5 text-[#82908A]" />
          <span>Export PNG</span>
        </button>

        <button
          type="button"
          className="studio-action-btn"
          onClick={onJSON}
          title="Export design as JSON file"
        >
          <FileCode className="h-3.5 w-3.5 text-[#82908A]" />
          <span>Export JSON</span>
        </button>

        {onShare && (
          <button
            type="button"
            className="studio-action-btn"
            onClick={onShare}
            title="Create shareable guest link"
          >
            <Share2 className="h-3.5 w-3.5 text-[#82908A]" />
            <span>Share</span>
          </button>
        )}

        {onSave && (
          <button
            type="button"
            className="studio-primary-save-btn"
            onClick={onSave}
            title="Save your design"
          >
            <Save className="h-4 w-4" />
            <span>Save</span>
          </button>
        )}
      </div>
    </header>
  );
}
