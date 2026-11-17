import { Check } from 'lucide-react';
import { THEMES } from '@/data/themes';

export default function ThemePicker({ onApply, activeThemeId }) {
  const themes = THEMES.slice(0, 5);

  return (
    <div className="studio-themes-list" role="radiogroup" aria-label="Wedding Themes">
      {themes.map((theme) => {
        const active = activeThemeId === theme.id;
        const applied = {
          ...theme,
          bg: [theme.palette.backdrop, theme.palette.secondary],
          floor: [theme.palette.platform, theme.palette.accent],
          palette: [
            theme.palette.primary,
            theme.palette.secondary,
            theme.palette.accent,
            theme.palette.backdrop,
            theme.palette.platform,
          ],
        };

        const swatches = [
          theme.palette.primary,
          theme.palette.accent,
          theme.palette.secondary,
        ];

        return (
          <button
            key={theme.id}
            type="button"
            role="radio"
            aria-checked={active}
            className={`studio-theme-card ${active ? 'is-active' : ''}`}
            onClick={() => onApply(applied)}
          >
            <div className="studio-theme-swatches-row">
              {swatches.map((color, idx) => (
                <span
                  key={idx}
                  className="studio-swatch-circle"
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                />
              ))}
            </div>

            <div className="studio-theme-info">
              <span className="studio-theme-name">{theme.name}</span>
              <span className="studio-theme-desc truncate">{theme.description}</span>
            </div>

            {active && (
              <span className="studio-theme-check" aria-hidden="true">
                <Check className="h-3.5 w-3.5" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
