const makePalette = (colors) => ({
  primary: colors[0],
  secondary: colors[1],
  accent: colors[2],
  backdrop: colors[4],
  platform: colors[3],
});

// The imported five-color palettes are merged with the app's rendering data.
// Existing theme IDs and palettes stay stable so saved designs continue to load.
export const THEMES = [
  {
    id: 'blush-romance',
    name: 'Blush Romance',
    description: 'Soft blush florals with champagne accents',
    colors: ['#f2b8bf', '#fbf3e6', '#d8b878', '#8fa88a', '#3b2f26'],
    palette: { primary: '#E8C7C4', secondary: '#FAF7F2', accent: '#C5A46D', backdrop: '#F3E6E4', platform: '#D4C4B0' },
    defaultSettings: { flowerDensity: 70, lightingIntensity: 60, arrangementStyle: 'cascade' },
  },
  {
    id: 'ivory-elegance',
    name: 'Ivory Elegance',
    description: 'Clean ivory tones with soft sage greenery',
    colors: ['#f3ece0', '#fffaf0', '#cbb892', '#e6dcc8', '#3b2f26'],
    palette: { primary: '#FAF7F2', secondary: '#A8B5A0', accent: '#C5A46D', backdrop: '#F5F1EA', platform: '#E8E2D6' },
    defaultSettings: { flowerDensity: 45, lightingIntensity: 50, arrangementStyle: 'symmetrical' },
  },
  {
    id: 'sage-garden',
    name: 'Sage Garden',
    description: 'Lush garden greens with natural textures',
    colors: ['#6e8c72', '#9db89c', '#e9efe3', '#f4e9b8', '#2f4a3d'],
    palette: { primary: '#A8B5A0', secondary: '#243D35', accent: '#C5A46D', backdrop: '#E4EBE0', platform: '#C5CBB8' },
    defaultSettings: { flowerDensity: 80, lightingIntensity: 45, arrangementStyle: 'asymmetric' },
  },
  {
    id: 'royal-gold',
    name: 'Royal Gold',
    description: 'Deep forest with rich champagne gold',
    colors: ['#d9b25f', '#1f4a36', '#f3ead2', '#2a1d12', '#e6c27a'],
    palette: { primary: '#C5A46D', secondary: '#243D35', accent: '#E8C7C4', backdrop: '#2F4A40', platform: '#3D5A4E' },
    defaultSettings: { flowerDensity: 55, lightingIntensity: 75, arrangementStyle: 'symmetrical' },
  },
  {
    id: 'traditional-marigold',
    name: 'Traditional Marigold',
    description: 'Festive marigold and warm ivory tradition',
    colors: ['#f08a1c', '#f7b92b', '#fbf6ea', '#b8802f', '#7a4e2b'],
    palette: { primary: '#E8A838', secondary: '#FAF7F2', accent: '#C45C26', backdrop: '#F7EBD4', platform: '#E0C89A' },
    defaultSettings: { flowerDensity: 90, lightingIntensity: 65, arrangementStyle: 'cascade' },
  },
  { id: 'valentine-red', name: 'Valentine Red', description: 'Romantic reds and candlelit warmth', colors: ['#b3203a', '#d6455a', '#f6c2c8', '#ffe3a8', '#24100f'], palette: makePalette(['#b3203a', '#d6455a', '#f6c2c8', '#ffe3a8', '#24100f']), defaultSettings: { flowerDensity: 75, lightingIntensity: 70, arrangementStyle: 'cascade' } },
  { id: 'midnight-neon', name: 'Midnight Neon', description: 'Electric color against a deep evening backdrop', colors: ['#1a1240', '#5a1d6e', '#ff4fa3', '#7fe0ff', '#fff4d0'], palette: makePalette(['#1a1240', '#5a1d6e', '#ff4fa3', '#7fe0ff', '#fff4d0']), defaultSettings: { flowerDensity: 45, lightingIntensity: 90, arrangementStyle: 'asymmetric' } },
  { id: 'pastel-soft', name: 'Pastel Soft', description: 'Airy pastels for gentle, joyful gatherings', colors: ['#f6c9cf', '#cfe0ef', '#fbe9b8', '#e6d9ee', '#efe4d6'], palette: makePalette(['#f6c9cf', '#cfe0ef', '#fbe9b8', '#e6d9ee', '#efe4d6']), defaultSettings: { flowerDensity: 55, lightingIntensity: 55, arrangementStyle: 'minimal' } },
  { id: 'diwali-glow', name: 'Diwali Glow', description: 'Jewel tones, marigold, and festive light', colors: ['#1c1448', '#b3492e', '#ff9d2e', '#ffd34d', '#2f8f6a'], palette: makePalette(['#1c1448', '#b3492e', '#ff9d2e', '#ffd34d', '#2f8f6a']), defaultSettings: { flowerDensity: 80, lightingIntensity: 85, arrangementStyle: 'symmetrical' } },
  { id: 'silver-elegance', name: 'Silver Elegance', description: 'Pearl, silver, and soft botanical accents', colors: ['#d7dbe0', '#aab0b8', '#f4f1ec', '#fbf1ee', '#7f9a7a'], palette: makePalette(['#d7dbe0', '#aab0b8', '#f4f1ec', '#fbf1ee', '#7f9a7a']), defaultSettings: { flowerDensity: 50, lightingIntensity: 65, arrangementStyle: 'symmetrical' } },
];

export const THEME_PRESETS = THEMES;

export function getTheme(id) {
  return THEMES.find((theme) => theme.id === id) ?? THEMES[0];
}

export const DEFAULT_SETTINGS = {
  themeId: 'blush-romance',
  flowerDensity: 65,
  lightingIntensity: 55,
  arrangementStyle: 'cascade',
};
