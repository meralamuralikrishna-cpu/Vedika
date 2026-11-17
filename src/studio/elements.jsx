// Shared element library. Studio palette, canvas, template scenes and covers ALL render from this file,
// so a template cover is always pixel-identical to what opens in the Design Studio.
import { shade, range } from './elementUtils';
import { MORE_ELEMENTS } from './elementsMore';
export { shade };

export const ELEMENT_CATEGORIES = ["Flowers", "Backdrops", "Entrance", "Furniture", "Fabrics", "Lighting", "Props"];

const VEDIKA_ASSET_FILES = [
  ['backdrops', 'balloon-arch'], ['backdrops', 'drape-panel'], ['backdrops', 'floral-arch'], ['backdrops', 'floral-hoop'], ['backdrops', 'floral-wall'], ['backdrops', 'mandap'], ['backdrops', 'moon-gate'], ['backdrops', 'pillar-pair'],
  ['fabrics', 'swag'], ['fabrics', 'ruffle-panel'], ['fabrics', 'silk-ribbon'], ['fabrics', 'curtain'], ['fabrics', 'table-runner'], ['fabrics', 'pleated-drape'], ['fabrics', 'chair-sash'], ['fabrics', 'tassel-tie-back'],
  ['furniture', 'sofa'], ['furniture', 'throne'], ['furniture', 'chiavari-chair'], ['furniture', 'round-table'], ['furniture', 'banquet-table'], ['furniture', 'loveseat'], ['furniture', 'plinth'], ['furniture', 'cocktail-table'],
  ['lighting', 'fairy-lights'], ['lighting', 'chandelier'], ['lighting', 'lantern'], ['lighting', 'diya'], ['lighting', 'neon-ring'], ['lighting', 'string-bulbs'], ['lighting', 'candle'], ['lighting', 'uplight'],
  ['flowers', 'peony'], ['flowers', 'rose'], ['flowers', 'marigold'], ['flowers', 'eucalyptus'], ['flowers', 'orchid'], ['flowers', 'jasmine-strand'], ['flowers', 'lotus'], ['flowers', 'pampas'],
  ['props', 'kalash'], ['props', 'urli-bowl'], ['props', 'brass-diya-set'], ['props', 'rangoli'], ['props', 'cake'], ['props', 'vase'], ['props', 'welcome-sign'], ['props', 'flower-basket'],
];

const VEDIKA_ASSETS = VEDIKA_ASSET_FILES.map(([group, slug]) => {
  const category = group[0].toUpperCase() + group.slice(1);
  const name = slug.split('-').map((word) => word[0].toUpperCase() + word.slice(1)).join(' ');
  const fileGroup = group === 'fabrics' ? 'fabric' : group === 'lighting' ? 'lights' : group;
  const assetUrl = `/vedika-assets/${fileGroup}-${slug}.png`;
  return { id: `vedika-${group}-${slug}`, name, category, w: 160, h: 160, color: '#ffffff', assetUrl,
    render: () => <image href={assetUrl} width="160" height="160" preserveAspectRatio="none" /> };
});

const BASE_ELEMENTS = [
  { id: "marigold-garland", name: "Marigold garland", category: "Flowers", w: 300, h: 60, color: "#F2A71B",
    render: (c) => <g>{range(23).map((i) => { const t = i / 22; const x = 300 * t; const y = 10 + 38 * 4 * t * (1 - t);
      return <g key={i}><circle cx={x} cy={y} r="9" fill={i % 3 === 0 ? shade(c, -40) : c} /><circle cx={x} cy={y} r="3.6" fill="#ffffff" opacity=".35" /></g>; })}</g> },
  { id: "rose-cluster", name: "Rose cluster", category: "Flowers", w: 90, h: 90, color: "#E4577A",
    render: (c) => <g>
      <ellipse cx="18" cy="62" rx="16" ry="7" fill="#3f7d4e" transform="rotate(-25 18 62)" /><ellipse cx="74" cy="66" rx="16" ry="7" fill="#3f7d4e" transform="rotate(25 74 66)" />
      {[[30, 44, 26], [60, 38, 24], [47, 62, 22]].map(([x, y, r], i) => <g key={i}><circle cx={x} cy={y} r={r} fill={shade(c, i * 14)} /><circle cx={x} cy={y} r={r * 0.62} fill="none" stroke={shade(c, -45)} strokeWidth="2" /><circle cx={x} cy={y} r={r * 0.28} fill={shade(c, -45)} /></g>)}</g> },
  { id: "flower-wall", name: "Flower wall", category: "Flowers", w: 240, h: 200, color: "#F7B32B",
    render: (c) => <g>{range(9).flatMap((j) => range(10).map((i) => { const k = (i * 7 + j * 3) % 4; const x = 14 + i * 23.8 + (j % 2 ? 12 : 0); const y = 14 + j * 21;
      return <g key={`${i}-${j}`}><circle cx={x} cy={y} r="13" fill={shade(c, [0, 26, -26, 46][k])} /><circle cx={x} cy={y} r="4.5" fill="#00000026" /></g>; }))}</g> },
  { id: "mandap", name: "Mandap", category: "Backdrops", w: 360, h: 360, color: "#E9C46A",
    render: (c) => <g>
      <rect x="20" y="340" width="320" height="20" fill={shade(c, -70)} />
      {[50, 288].map((x) => <g key={x}><rect x={x} y="100" width="22" height="240" fill={c} /><rect x={x - 8} y="90" width="38" height="14" fill={shade(c, -40)} /><rect x={x - 8} y="326" width="38" height="14" fill={shade(c, -40)} /></g>)}
      <path d="M72 100 Q180 156 288 100 L288 120 Q180 176 72 120 Z" fill={shade(c, -80)} opacity=".55" />
      <path d="M20 100 L180 20 L340 100 Z" fill={shade(c, -40)} /><path d="M42 100 L180 38 L318 100 Z" fill={c} /><circle cx="180" cy="14" r="10" fill={shade(c, 30)} /></g> },
  { id: "floral-arch", name: "Floral arch", category: "Backdrops", w: 300, h: 340, color: "#E8B4A0",
    render: (c) => <g>
      <path d="M30 340 V150 A120 120 0 0 1 270 150 V340" stroke={c} strokeWidth="18" fill="none" />
      {range(9).map((k) => { const a = (Math.PI * k) / 8; return <circle key={k} cx={150 - 120 * Math.cos(a)} cy={150 - 120 * Math.sin(a)} r="12" fill={shade(c, 40)} />; })}
      {range(6).flatMap((k) => [30, 270].map((x) => <circle key={`${x}-${k}`} cx={x} cy={170 + k * 28} r="10" fill={shade(c, k % 2 ? 30 : 55)} />))}</g> },
  { id: "backdrop-panel", name: "Backdrop panel", category: "Backdrops", w: 360, h: 240, color: "#15233D",
    render: (c) => <g><rect width="360" height="240" rx="6" fill={c} /><rect x="10" y="10" width="340" height="220" rx="3" fill="none" stroke={shade(c, 60)} strokeWidth="3" /></g> },
  { id: "stage-platform", name: "Stage platform", category: "Furniture", w: 400, h: 60, color: "#241F63",
    render: (c) => <g><rect width="400" height="60" fill={c} /><rect width="400" height="8" fill={shade(c, 45)} />{range(9).map((i) => <rect key={i} x={i * 50 + 24} y="16" width="2" height="40" fill={shade(c, -25)} />)}</g> },
  { id: "round-table", name: "Round table", category: "Furniture", w: 120, h: 100, color: "#F4EFE6",
    render: (c) => <g><path d="M10 34 L22 98 H98 L110 34 Z" fill={c} /><ellipse cx="60" cy="34" rx="52" ry="14" fill={shade(c, -14)} /><ellipse cx="60" cy="32" rx="52" ry="14" fill={shade(c, 8)} /></g> },
  { id: "swing", name: "Jhula swing", category: "Furniture", w: 160, h: 220, color: "#6B4A0B",
    render: (c) => <g>
      <rect x="0" y="0" width="12" height="220" fill={c} /><rect x="148" y="0" width="12" height="220" fill={c} /><rect x="0" y="0" width="160" height="12" fill={shade(c, -20)} />
      {[34, 126].map((x) => <g key={x}><line x1={x} y1="12" x2={x} y2="150" stroke={shade(c, 70)} strokeWidth="3" />{range(7).map((i) => <circle key={i} cx={x} cy={26 + i * 19} r="5" fill="#F2A71B" />)}</g>)}
      <rect x="22" y="150" width="116" height="16" rx="8" fill={shade(c, 30)} /></g> },
  { id: "sofa", name: "Sofa", category: "Furniture", w: 160, h: 80, color: "#8A1C2B",
    render: (c) => <g><rect x="12" y="6" width="136" height="44" rx="14" fill={shade(c, 10)} /><rect x="0" y="40" width="160" height="30" rx="10" fill={shade(c, 24)} />
      <rect x="0" y="20" width="22" height="50" rx="10" fill={shade(c, -20)} /><rect x="138" y="20" width="22" height="50" rx="10" fill={shade(c, -20)} /><rect x="14" y="70" width="8" height="10" fill="#3a2410" /><rect x="138" y="70" width="8" height="10" fill="#3a2410" /></g> },
  { id: "silk-drape", name: "Silk drape", category: "Fabrics", w: 90, h: 320, color: "#8A1C2B",
    render: (c) => <g><path d="M0 0 H90 Q72 120 80 220 Q86 280 60 320 H8 Q32 220 20 120 Q12 60 0 0 Z" fill={c} /><path d="M30 0 Q40 130 28 316" stroke={shade(c, -40)} strokeWidth="3" fill="none" /><path d="M58 0 Q66 120 54 316" stroke={shade(c, 30)} strokeWidth="3" fill="none" opacity=".6" /></g> },
  { id: "valance", name: "Scalloped valance", category: "Fabrics", w: 320, h: 70, color: "#C9788F",
    render: (c) => <g><rect width="320" height="14" fill={shade(c, -30)} />{range(8).map((i) => <path key={i} d={`M${i * 40} 14 q20 56 40 0 Z`} fill={i % 2 ? shade(c, 18) : c} />)}</g> },
  { id: "fairy-lights", name: "Fairy lights", category: "Lighting", w: 400, h: 60, color: "#FFD98A",
    render: (c) => <g><path d="M0 6 Q200 66 400 6" stroke="#00000055" strokeWidth="1.5" fill="none" />
      {range(15).map((i) => { const t = (i + 1) / 16; const x = 400 * t; const y = 6 + 120 * t * (1 - t) + 6;
        return <g key={i}><circle cx={x} cy={y} r="13" fill={c} opacity=".2" /><circle cx={x} cy={y} r="4.5" fill={c} /></g>; })}</g> },
  { id: "lantern", name: "Hanging lantern", category: "Lighting", w: 50, h: 100, color: "#FF5FA2",
    render: (c) => <g><line x1="25" y1="0" x2="25" y2="14" stroke="#00000066" strokeWidth="2" /><rect x="17" y="12" width="16" height="6" fill="#3a2410" /><ellipse cx="25" cy="58" rx="34" ry="40" fill={c} opacity=".16" /><ellipse cx="25" cy="58" rx="20" ry="30" fill={c} /><ellipse cx="25" cy="52" rx="8" ry="14" fill="#ffffff" opacity=".3" /></g> },
  { id: "chandelier", name: "Chandelier", category: "Lighting", w: 100, h: 120, color: "#FFD166",
    render: (c) => <g><line x1="50" y1="0" x2="50" y2="22" stroke={shade(c, -80)} strokeWidth="3" /><path d="M20 40 H80 L96 70 H4 Z" fill={shade(c, -50)} /><rect x="38" y="20" width="24" height="22" rx="4" fill={shade(c, -30)} />
      {[10, 35, 65, 90].map((x, i) => <g key={x}><circle cx={x} cy={80 + (i % 3 ? 8 : 0)} r="12" fill={c} opacity=".22" /><circle cx={x} cy={80 + (i % 3 ? 8 : 0)} r="5" fill="#fff3c4" /></g>)}
      {[24, 50, 76].map((x) => <path key={x} d={`M${x} 72 l-4 28 l4 8 l4 -8 z`} fill="#ffffff" opacity=".55" />)}</g> },
  { id: "balloon-cluster", name: "Balloon cluster", category: "Props", w: 120, h: 160, color: "#FF6B6B",
    render: (c) => <g>{[[60, 150], [60, 150], [60, 150]].map(([x, y], i) => <path key={i} d={`M${[35, 80, 58][i]} ${[64, 56, 108][i]} Q60 130 ${x} ${y}`} stroke="#00000055" fill="none" />)}
      {[[35, 40, 28, c], [80, 32, 26, shade(c, 60)], [58, 80, 30, shade(c, -45)]].map(([x, y, r, f], i) => <g key={i}><ellipse cx={x} cy={y} rx={r} ry={r * 1.2} fill={f} /><ellipse cx={x - r * 0.35} cy={y - r * 0.4} rx={r * 0.16} ry={r * 0.28} fill="#ffffff" opacity=".4" /></g>)}</g> },
  { id: "cake", name: "Cake", category: "Props", w: 90, h: 90, color: "#FF6B6B",
    render: (c) => <g><rect x="10" y="56" width="70" height="30" rx="4" fill={c} /><rect x="22" y="32" width="46" height="26" rx="4" fill={shade(c, 28)} /><rect x="10" y="56" width="70" height="6" fill="#ffffff" opacity=".7" /><rect x="22" y="32" width="46" height="5" fill="#ffffff" opacity=".7" />
      <rect x="43" y="12" width="4" height="20" fill="#FFD93D" /><ellipse cx="45" cy="8" rx="4" ry="6" fill="#FF9F1C" /></g> },
  { id: "ring-pair", name: "Ring pair", category: "Props", w: 80, h: 50, color: "#F4D58D",
    render: (c) => <g><circle cx="28" cy="28" r="18" fill="none" stroke={c} strokeWidth="6" /><circle cx="52" cy="28" r="18" fill="none" stroke={shade(c, -30)} strokeWidth="6" /><path d="M28 4 l6 6 l-6 6 l-6 -6 z" fill="#ffffff" /></g> },
  { id: "diya", name: "Diya", category: "Props", w: 50, h: 30, color: "#C0561B",
    render: (c) => <g><path d="M4 14 Q25 40 46 14 Z" fill={c} /><ellipse cx="25" cy="14" rx="21" ry="3" fill={shade(c, -40)} /><ellipse cx="25" cy="7" rx="5" ry="9" fill="#FFB703" /><ellipse cx="25" cy="9" rx="2" ry="5" fill="#fff3c4" /></g> },
];
export const ELEMENTS = [...BASE_ELEMENTS, ...MORE_ELEMENTS, ...VEDIKA_ASSETS];
export const ELEMENT_MAP = Object.fromEntries(ELEMENTS.map((e) => [e.id, e]));
