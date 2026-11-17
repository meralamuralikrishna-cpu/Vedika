// Second batch of studio elements. Merged into ELEMENTS by elements.jsx. Add new ones here.
import { shade, range } from "./elementUtils";
const GOLD = "#C8902A";
const LEAF = "#3F7D4E";

export const MORE_ELEMENTS = [
  // ---------- Flowers ----------
  { id: "jasmine-curtain", name: "Jasmine curtain", category: "Flowers", w: 140, h: 260, color: "#FFF8E7",
    render: (c) => <g><rect width="140" height="6" fill={shade(c, -130)} />{range(7).map((i) => { const x = 10 + i * 20, len = 200 + ((i * 37) % 50);
      return <g key={i}><line x1={x} y1="6" x2={x} y2={len} stroke={shade(c, -100)} strokeWidth="1.2" />{range(Math.floor(len / 12)).map((k) => <ellipse key={k} cx={x} cy={14 + k * 12} rx="4.5" ry="6" fill={k % 2 ? shade(c, -14) : c} />)}</g>; })}</g> },
  { id: "lotus", name: "Lotus", category: "Flowers", w: 90, h: 60, color: "#F7A8C4",
    render: (c) => <g><ellipse cx="45" cy="54" rx="42" ry="6" fill={LEAF} />{[-60, -30, 30, 60, 0].map((a, i) => <ellipse key={a} cx="45" cy="30" rx="10" ry="24" fill={shade(c, i === 4 ? 25 : (i % 2) * 14)} transform={`rotate(${a} 45 52)`} />)}</g> },
  { id: "floral-pot", name: "Flower pot", category: "Flowers", w: 70, h: 90, color: "#C0561B",
    render: (c) => <g><ellipse cx="18" cy="48" rx="12" ry="5" fill={LEAF} transform="rotate(-30 18 48)" /><ellipse cx="52" cy="48" rx="12" ry="5" fill={LEAF} transform="rotate(30 52 48)" />
      {[[20, 38, "#F2A71B"], [35, 26, "#E4577A"], [50, 38, "#F7B32B"], [35, 44, "#ffffff"]].map(([x, y, f], i) => <g key={i}><circle cx={x} cy={y} r="12" fill={f} /><circle cx={x} cy={y} r="4" fill="#00000026" /></g>)}
      <path d="M12 56 H58 L52 90 H18 Z" fill={c} /><rect x="10" y="52" width="50" height="8" rx="3" fill={shade(c, 25)} /></g> },
  { id: "petal-scatter", name: "Petal scatter", category: "Flowers", w: 200, h: 60, color: "#E4577A",
    render: (c) => <g>{range(26).map((i) => <ellipse key={i} cx={(i * 53) % 190 + 6} cy={(i * 29) % 48 + 6} rx="7" ry="4" fill={shade(c, (i % 3) * 25 - 20)} opacity=".92" transform={`rotate(${(i * 47) % 180} ${(i * 53) % 190 + 6} ${(i * 29) % 48 + 6})`} />)}</g> },

  // ---------- Backdrops ----------
  { id: "moon-gate", name: "Moon gate", category: "Backdrops", w: 260, h: 260, color: "#F4EFE6",
    render: (c) => <g><circle cx="130" cy="130" r="118" fill="none" stroke={c} strokeWidth="22" /><circle cx="130" cy="130" r="106" fill="none" stroke={shade(c, -50)} strokeWidth="2" />
      {range(12).map((i) => { const a = (Math.PI * 2 * i) / 12; return <circle key={i} cx={130 + 118 * Math.cos(a)} cy={130 + 118 * Math.sin(a)} r="8" fill={i % 2 ? "#F2B5C4" : "#E4577A"} />; })}</g> },
  { id: "jali-screen", name: "Jali screen", category: "Backdrops", w: 240, h: 300, color: "#C8902A",
    render: (c) => <g><rect width="240" height="300" fill={shade(c, -90)} />{range(7).flatMap((j) => range(6).map((i) => { const x = 20 + i * 40, y = 20 + j * 40;
      return <path key={`${i}-${j}`} d={`M${x} ${y - 18} L${x + 18} ${y} L${x} ${y + 18} L${x - 18} ${y} Z`} fill={c} stroke={shade(c, -50)} strokeWidth="2" />; }))}<rect x="3" y="3" width="234" height="294" fill="none" stroke={shade(c, 30)} strokeWidth="6" /></g> },
  { id: "photo-frame", name: "Photo frame", category: "Backdrops", w: 260, h: 300, color: "#C8902A",
    render: (c) => <g><rect x="9" y="9" width="242" height="282" fill="#ffffff" opacity=".07" /><rect x="9" y="9" width="242" height="282" rx="8" fill="none" stroke={c} strokeWidth="18" /><rect x="22" y="22" width="216" height="256" rx="4" fill="none" stroke={shade(c, 45)} strokeWidth="3" />
      {[[9, 9], [251, 9], [9, 291], [251, 291]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="14" fill={shade(c, 25)} stroke={shade(c, -40)} strokeWidth="2" />)}<circle cx="130" cy="9" r="16" fill="#E4577A" /><circle cx="130" cy="9" r="6" fill="#00000026" /></g> },
  { id: "gazebo", name: "Gazebo", category: "Backdrops", w: 360, h: 340, color: "#FFFFFF",
    render: (c) => <g>{[28, 108, 238, 318].map((x) => <rect key={x} x={x} y="100" width="14" height="240" fill={shade(c, -25)} />)}<rect x="10" y="326" width="340" height="14" fill={shade(c, -60)} />
      <path d="M0 100 Q180 -40 360 100 Z" fill={shade(c, -35)} /><path d="M24 100 Q180 -14 336 100 Z" fill={c} /><rect x="0" y="96" width="360" height="10" fill={shade(c, -50)} /><circle cx="180" cy="22" r="8" fill={GOLD} />
      <path d="M42 106 Q75 160 108 106 M108 106 Q173 170 238 106 M238 106 Q278 160 318 106" fill="none" stroke={shade(c, -70)} strokeWidth="5" opacity=".6" /></g> },

  // ---------- Entrance ----------
  { id: "entrance-gate", name: "Entrance gate", category: "Entrance", w: 300, h: 360, color: "#E9C46A",
    render: (c) => <g>{[0, 266].map((x) => <g key={x}><rect x={x} y="70" width="34" height="290" fill={c} /><rect x={x - 6} y="62" width="46" height="14" fill={shade(c, -40)} /><rect x={x - 6} y="346" width="46" height="14" fill={shade(c, -40)} /></g>)}
      <rect x="0" y="40" width="300" height="26" fill={shade(c, -30)} /><path d="M90 40 L150 0 L210 40 Z" fill={c} /><circle cx="150" cy="-2" r="6" fill={shade(c, 40)} />
      {range(17).map((i) => { const t = i / 16; return <circle key={i} cx={36 + 228 * t} cy={72 + 34 * 4 * t * (1 - t)} r="8" fill={i % 3 === 0 ? "#D1495B" : "#F2A71B"} />; })}</g> },
  { id: "flower-pillar", name: "Flower pillar", category: "Entrance", w: 50, h: 320, color: "#F4EFE6",
    render: (c) => <g><rect x="10" y="34" width="30" height="270" fill={c} /><rect x="4" y="28" width="42" height="12" fill={shade(c, -40)} /><rect x="4" y="300" width="42" height="14" fill={shade(c, -40)} />
      {range(10).map((k) => <circle key={k} cx={25 + (k % 2 ? 8 : -8)} cy={56 + k * 24} r="8" fill={k % 3 === 0 ? "#F2A71B" : "#E4577A"} />)}<circle cx="25" cy="18" r="18" fill="#F2B5C4" /><circle cx="25" cy="18" r="7" fill="#E4577A" /></g> },
  { id: "aisle-runner", name: "Aisle runner", category: "Entrance", w: 160, h: 300, color: "#8A1C2B",
    render: (c) => <g><path d="M62 0 H98 L160 300 H0 Z" fill={c} /><path d="M70 0 L52 300 M90 0 L108 300" stroke={shade(c, 60)} strokeWidth="2.5" fill="none" /><path d="M80 0 V300" stroke={shade(c, 40)} strokeWidth="1.5" strokeDasharray="10 8" /></g> },
  { id: "rangoli", name: "Rangoli", category: "Entrance", w: 140, h: 80, color: "#E4577A",
    render: (c) => <g>{[[66, 34, c], [56, 29, "#F2A71B"], [46, 24, "#ffffff"], [34, 18, shade(c, -30)], [22, 11, "#F2A71B"], [10, 5, "#ffffff"]].map(([rx, ry, f], i) => <ellipse key={i} cx="70" cy="40" rx={rx} ry={ry} fill={f} />)}
      {range(16).map((i) => { const a = (Math.PI * 2 * i) / 16; return <circle key={i} cx={70 + 60 * Math.cos(a)} cy={40 + 30 * Math.sin(a)} r="3" fill={i % 2 ? "#ffffff" : LEAF} />; })}</g> },
  { id: "welcome-board", name: "Welcome board", category: "Entrance", w: 120, h: 190, color: "#F4EFE6",
    render: (c) => <g><path d="M30 130 L12 190 M90 130 L108 190 M60 130 V184" stroke="#6B4A0B" strokeWidth="5" strokeLinecap="round" /><rect x="10" y="0" width="100" height="132" rx="6" fill={c} stroke={shade(c, -70)} strokeWidth="3" />
      <rect x="30" y="34" width="60" height="6" rx="3" fill={shade(c, -90)} /><rect x="22" y="52" width="76" height="6" rx="3" fill={shade(c, -90)} /><rect x="34" y="70" width="52" height="6" rx="3" fill={shade(c, -90)} />
      {[[16, 6], [104, 6]].map(([x, y]) => <circle key={x} cx={x} cy={y + 6} r="8" fill="#E4577A" />)}<path d="M40 100 Q60 116 80 100" stroke={GOLD} strokeWidth="3" fill="none" /></g> },

  // ---------- Furniture ----------
  { id: "chair-royal", name: "Royal chair", category: "Furniture", w: 90, h: 120, color: "#8A1C2B",
    render: (c) => <g><path d="M18 70 V24 Q18 2 45 2 Q72 2 72 24 V70 Z" fill={c} /><path d="M26 66 V26 Q26 12 45 12 Q64 12 64 26 V66 Z" fill="none" stroke={shade(c, 45)} strokeWidth="2" />
      <rect x="10" y="68" width="70" height="28" rx="8" fill={shade(c, 22)} /><rect x="4" y="48" width="14" height="30" rx="6" fill={shade(c, -20)} /><rect x="72" y="48" width="14" height="30" rx="6" fill={shade(c, -20)} /><rect x="14" y="96" width="8" height="24" fill={GOLD} /><rect x="68" y="96" width="8" height="24" fill={GOLD} /></g> },
  { id: "chiavari-chair", name: "Chiavari chair", category: "Furniture", w: 50, h: 90, color: "#E9C46A",
    render: (c) => <g><rect x="8" y="2" width="34" height="42" rx="4" fill="none" stroke={c} strokeWidth="4" />{[17, 25, 33].map((x) => <line key={x} x1={x} y1="6" x2={x} y2="42" stroke={c} strokeWidth="2.5" />)}
      <rect x="6" y="44" width="38" height="9" rx="3" fill={c} /><path d="M10 53 L8 90 M40 53 L42 90" stroke={c} strokeWidth="4" strokeLinecap="round" /></g> },
  { id: "cocktail-table", name: "Cocktail table", category: "Furniture", w: 60, h: 100, color: "#F4EFE6",
    render: (c) => <g><path d="M4 12 L14 92 H46 L56 12 Z" fill={c} /><ellipse cx="30" cy="12" rx="28" ry="7" fill={shade(c, 10)} /><ellipse cx="30" cy="92" rx="16" ry="4" fill={shade(c, -40)} /></g> },
  { id: "bench", name: "Cushioned bench", category: "Furniture", w: 180, h: 60, color: "#6B4A0B",
    render: (c) => <g><rect x="0" y="22" width="180" height="12" rx="4" fill={c} /><rect x="14" y="34" width="10" height="26" fill={shade(c, -20)} /><rect x="156" y="34" width="10" height="26" fill={shade(c, -20)} /><rect x="6" y="6" width="168" height="18" rx="9" fill="#D1495B" /><path d="M60 8 V22 M120 8 V22" stroke="#00000030" strokeWidth="2" /></g> },
  { id: "throne-sofa", name: "Throne sofa", category: "Furniture", w: 200, h: 140, color: "#8A1C2B",
    render: (c) => <g><path d="M12 76 V40 Q12 14 40 14 Q70 -2 100 12 Q130 -2 160 14 Q188 14 188 40 V76 Z" fill={c} stroke={GOLD} strokeWidth="3" /><path d="M28 76 V46 Q28 30 46 30 H154 Q172 30 172 46 V76 Z" fill={shade(c, 18)} />
      <rect x="0" y="72" width="200" height="42" rx="14" fill={shade(c, 24)} /><rect x="0" y="48" width="26" height="66" rx="12" fill={shade(c, -18)} stroke={GOLD} strokeWidth="2" /><rect x="174" y="48" width="26" height="66" rx="12" fill={shade(c, -18)} stroke={GOLD} strokeWidth="2" />
      <rect x="16" y="114" width="12" height="26" fill={GOLD} /><rect x="172" y="114" width="12" height="26" fill={GOLD} /></g> },

  // ---------- Fabrics ----------
  { id: "ceiling-drape", name: "Ceiling drape", category: "Fabrics", w: 400, h: 120, color: "#FFFFFF",
    render: (c) => <g><rect width="400" height="6" fill={shade(c, -50)} />{range(5).map((i) => <g key={i}><path d={`M${i * 80} 6 Q${i * 80 + 40} 118 ${i * 80 + 80} 6 Z`} fill={shade(c, -(i % 2) * 22)} /><path d={`M${i * 80 + 20} 6 Q${i * 80 + 40} 70 ${i * 80 + 60} 6`} fill="none" stroke={shade(c, -60)} strokeWidth="1.5" opacity=".5" /></g>)}</g> },
  { id: "cushion-set", name: "Bolster cushions", category: "Fabrics", w: 120, h: 60, color: "#E9C46A",
    render: (c) => <g><rect x="4" y="22" width="50" height="30" rx="13" fill={c} /><rect x="42" y="8" width="52" height="42" rx="14" fill={shade(c, 28)} /><rect x="80" y="24" width="38" height="28" rx="11" fill={shade(c, -35)} />
      {[[4, 37], [118, 38]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="4" fill={GOLD} />)}<path d="M50 29 H86 M52 36 H84" stroke={shade(c, -40)} strokeWidth="2" opacity=".6" /></g> },

  // ---------- Lighting ----------
  { id: "spotlight", name: "Spotlight", category: "Lighting", w: 70, h: 110, color: "#FFF3C4",
    render: (c) => <g><polygon points="35,32 0,110 70,110" fill={c} opacity=".24" /><rect x="22" y="4" width="26" height="26" rx="5" fill="#3A3A46" /><circle cx="35" cy="32" r="8" fill={c} /><rect x="32" y="0" width="6" height="6" fill="#6b6b78" /></g> },
  { id: "neon-ring", name: "Neon ring", category: "Lighting", w: 120, h: 120, color: "#FF5FA2",
    render: (c) => <g><circle cx="60" cy="60" r="50" fill="none" stroke={c} strokeWidth="18" opacity=".22" /><circle cx="60" cy="60" r="50" fill="none" stroke={c} strokeWidth="6" /><circle cx="60" cy="60" r="50" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity=".7" /></g> },
  { id: "candle-cluster", name: "Candle cluster", category: "Lighting", w: 90, h: 70, color: "#FFF3C4",
    render: (c) => <g><ellipse cx="45" cy="62" rx="44" ry="7" fill={GOLD} />{[[10, 26], [27, 14], [45, 22], [63, 12], [78, 28]].map(([x, top], i) => <g key={i}><rect x={x - 6} y={top + 8} width="12" height={58 - top - 8} fill={c} /><circle cx={x} cy={top} r="12" fill="#FFB703" opacity=".25" /><ellipse cx={x} cy={top + 2} rx="3.5" ry="6" fill="#FFB703" /></g>)}</g> },
  { id: "lantern-row", name: "Lantern row", category: "Lighting", w: 400, h: 90, color: "#F2A71B",
    render: (c) => <g><path d="M0 8 Q200 32 400 8" stroke="#00000066" strokeWidth="1.5" fill="none" />{range(6).map((i) => { const t = (i + 0.5) / 6; const y = 8 + 24 * t * (1 - t) * 2 * 1;
      const cx = 400 * t; return <g key={i}><line x1={cx} y1={y} x2={cx} y2="38" stroke="#00000066" /><ellipse cx={cx} cy="58" rx="24" ry="30" fill={c} opacity=".18" /><ellipse cx={cx} cy="58" rx="14" ry="20" fill={shade(c, (i % 3) * 25 - 20)} /></g>; })}</g> },

  // ---------- Props ----------
  { id: "balloon-arch", name: "Balloon arch", category: "Props", w: 300, h: 140, color: "#FF6B6B",
    render: (c) => <g>{range(13).map((i) => { const a = (Math.PI * i) / 12; const f = [c, shade(c, 60), shade(c, -50), "#ffffff"][i % 4];
      return <g key={i}><circle cx={150 - 128 * Math.cos(a)} cy={132 - 110 * Math.sin(a)} r="17" fill={f} /><circle cx={150 - 128 * Math.cos(a) - 5} cy={132 - 110 * Math.sin(a) - 6} r="4" fill="#ffffff" opacity=".4" /></g>; })}</g> },
  { id: "kalash", name: "Kalash", category: "Props", w: 50, h: 70, color: "#C8902A",
    render: (c) => <g><ellipse cx="14" cy="22" rx="12" ry="5" fill={LEAF} transform="rotate(-30 14 22)" /><ellipse cx="36" cy="22" rx="12" ry="5" fill={LEAF} transform="rotate(30 36 22)" /><circle cx="25" cy="14" r="10" fill="#8B5A2B" />
      <rect x="17" y="26" width="16" height="8" fill={shade(c, -30)} /><path d="M10 34 Q3 68 25 69 Q47 68 40 34 Z" fill={c} /><path d="M14 46 H36" stroke={shade(c, 50)} strokeWidth="3" /></g> },
  { id: "chhatri", name: "Chhatri", category: "Props", w: 120, h: 100, color: "#E9C46A",
    render: (c) => <g><line x1="60" y1="36" x2="60" y2="100" stroke="#6B4A0B" strokeWidth="4" /><path d="M0 42 Q60 -30 120 42 Z" fill={c} />{range(6).map((i) => <path key={i} d={`M${i * 20} 42 q10 12 20 0`} fill={i % 2 ? shade(c, -35) : "#D1495B"} />)}{range(7).map((i) => <circle key={i} cx={i * 20} cy="52" r="3" fill={GOLD} />)}<circle cx="60" cy="6" r="5" fill={GOLD} /></g> },
  { id: "palm-plant", name: "Palm plant", category: "Props", w: 90, h: 140, color: "#3F7D4E",
    render: (c) => <g>{[-70, -35, 35, 70, 0].map((a, i) => <ellipse key={a} cx="45" cy="52" rx="9" ry="44" fill={shade(c, (i % 2) * 22)} transform={`rotate(${a} 45 100)`} />)}<path d="M20 98 H70 L62 140 H28 Z" fill="#C0561B" /><rect x="18" y="94" width="54" height="9" rx="3" fill="#D9742F" /></g> },
  { id: "gift-stack", name: "Gift stack", category: "Props", w: 90, h: 80, color: "#D1495B",
    render: (c) => <g><rect x="4" y="44" width="52" height="36" fill={c} /><rect x="27" y="44" width="6" height="36" fill="#ffffff" /><rect x="46" y="28" width="40" height="52" fill={shade(c, -35)} /><rect x="63" y="28" width="6" height="52" fill="#FFD93D" />
      <rect x="4" y="44" width="52" height="5" fill="#00000020" /><circle cx="30" cy="42" r="6" fill="#ffffff" /><circle cx="66" cy="26" r="6" fill="#FFD93D" /></g> },
];
