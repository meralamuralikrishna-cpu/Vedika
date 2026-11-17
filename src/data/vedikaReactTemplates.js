const colors = {
  gold: ['#203b31', '#203b31', '#72563b', '#d8bc82'],
  marigold: ['#f7eddb', '#f7eddb', '#d0a253', '#e7c77e'],
  mehendi: ['#b9d8df', '#b9d8df', '#d4ad65', '#e9c778'],
  sangeet: ['#211b46', '#211b46', '#49346d', '#a679d9'],
  sage: ['#e8ece1', '#e8ece1', '#b9b49d', '#b9c7ad'],
  blush: ['#f4e5e1', '#f4e5e1', '#d4b4aa', '#d9a5a7'],
  noir: ['#24222a', '#24222a', '#5b4651', '#c99c87'],
  silver: ['#e8e9eb', '#e8e9eb', '#babcc3', '#d2d5dd'],
  birthday: ['#d6eeee', '#d6eeee', '#b4a1d3', '#f28ca7'],
  baby: ['#f3e9ef', '#f3e9ef', '#d8c9d8', '#d9c1d0'],
  diwali: ['#30234d', '#30234d', '#8b493c', '#e8a43a'],
  valentine: ['#4b1826', '#4b1826', '#762639', '#d49a91'],
  dinner: ['#efebe3', '#efebe3', '#c2b391', '#d7c9a9'],
};

const templates = [
  ['royal-gold-mandap', 'Royal Gold Mandap', 'Wedding', 'Gold & Emerald', 'gold', true, ['backdrops-mandap,220,36,360,370','lights-chandelier,350,45,100,120','furniture-throne,320,325,160,150','flowers-orchid,235,280,85,95','flowers-orchid,480,280,85,95','props-urli-bowl,90,405,90,80','props-kalash,610,400,80,85']],
  ['marigold-courtyard', 'Marigold Courtyard', 'Haldi', 'Marigold & Cream', 'marigold', false, ['backdrops-drape-panel,190,35,420,340','flowers-marigold,210,65,380,65','flowers-marigold,210,145,380,65','lights-lantern,260,50,55,85','lights-lantern,485,50,55,85','furniture-plinth,340,370,120,100']],
  ['mehendi-courtyard-bloom', 'Mehendi Courtyard Bloom', 'Mehendi', 'Sky & Marigold', 'mehendi', false, ['backdrops-floral-wall,180,30,440,320','backdrops-floral-hoop,275,70,250,260','flowers-marigold,200,120,110,90','flowers-peony,490,125,100,90','furniture-loveseat,320,335,160,90','props-urli-bowl,80,405,90,80']],
  ['sangeet-night-lights', 'Sangeet Night Lights', 'Sangeet', 'Violet Night', 'sangeet', true, ['backdrops-moon-gate,220,30,360,370','lights-neon-ring,330,65,140,140','lights-fairy-lights,100,25,600,70','lights-chandelier,360,85,80,100','furniture-loveseat,320,355,160,85','fabrics-pleated-drape,50,40,125,390','fabrics-pleated-drape,625,40,125,390']],
  ['sage-garden-reception', 'Sage Garden Reception', 'Reception', 'Sage & Ivory', 'sage', true, ['backdrops-floral-wall,170,30,460,310','flowers-eucalyptus,205,235,100,110','flowers-eucalyptus,495,235,100,110','furniture-loveseat,320,320,160,90','furniture-chiavari-chair,150,370,90,150','furniture-chiavari-chair,560,370,90,150','lights-uplight,90,420,65,80']],
  ['blush-arch-ceremony', 'Blush Arch Ceremony', 'Wedding', 'Blush & Sage', 'blush', false, ['backdrops-floral-arch,250,25,300,350','flowers-peony,185,215,110,110','flowers-peony,505,215,110,110','flowers-rose,275,75,80,80','flowers-rose,445,75,80,80','furniture-loveseat,320,340,160,85','lights-string-bulbs,175,15,450,60']],
  ['engagement-ring-night', 'Engagement Ring Night', 'Engagement', 'Noir & Rose Gold', 'noir', true, ['backdrops-moon-gate,240,25,320,340','lights-neon-ring,340,55,120,120','flowers-rose,205,180,100,100','flowers-rose,495,180,100,100','furniture-loveseat,320,330,160,90','lights-candle,170,405,55,75','lights-candle,575,405,55,75']],
  ['silver-anniversary-soiree', 'Silver Anniversary Soirée', 'Anniversary', 'Silver & Ivory', 'silver', true, ['backdrops-floral-hoop,270,20,260,320','flowers-peony,185,180,95,95','flowers-eucalyptus,520,190,95,95','furniture-sofa,320,320,160,95','lights-chandelier,350,35,100,105','lights-candle,205,400,50,70','lights-candle,545,400,50,70']],
  ['birthday-balloon-bash', 'Birthday Balloon Bash', 'Birthday', 'Teal & Bright Pink', 'birthday', false, ['backdrops-balloon-arch,220,20,360,340','props-cake,345,265,110,110','furniture-round-table,325,375,150,105','props-vase,175,350,70,85','props-vase,555,350,70,85','lights-string-bulbs,180,20,440,55']],
  ['soft-baby-shower-garden', 'Soft Baby Shower Garden', 'Baby shower', 'Soft Pastel', 'baby', false, ['backdrops-balloon-arch,225,25,350,325','backdrops-floral-arch,285,65,230,260','furniture-round-table,330,370,140,100','props-cake,360,285,80,80','flowers-peony,180,290,90,90','flowers-peony,530,290,90,90']],
  ['diwali-glow-courtyard', 'Diwali Glow Courtyard', 'Diwali', 'Lantern Orange & Dusk', 'diwali', true, ['backdrops-mandap,230,25,340,340','lights-lantern,130,55,65,100','lights-lantern,605,55,65,100','flowers-marigold,200,70,400,55','props-rangoli,325,385,150,130','lights-diya,245,415,60,60','lights-diya,495,415,60,60']],
  ['valentines-sweetheart-stage', "Valentine's Sweetheart Stage", "Valentine's", 'Rose & Wine', 'valentine', false, ['backdrops-moon-gate,230,25,340,350','flowers-rose,185,170,110,110','flowers-rose,505,170,110,110','furniture-loveseat,320,335,160,90','lights-fairy-lights,130,20,540,70','lights-candle,225,415,50,70','lights-candle,525,415,50,70']],
  ['valentines-candlelit-dinner', "Valentine's Candlelit Dinner", "Valentine's", 'Crimson & Candlelight', 'valentine', false, ['furniture-round-table,325,245,150,115','furniture-loveseat,320,360,160,85','lights-candle,370,205,55,65','flowers-rose,250,250,70,70','flowers-rose,485,250,70,70','lights-string-bulbs,185,45,430,60']],
  ['ivory-elegance-dinner', 'Ivory Elegance Dinner', 'Dinner', 'Ivory & Gold', 'dinner', false, ['backdrops-drape-panel,185,30,430,300','furniture-banquet-table,200,330,400,90','fabrics-table-runner,270,315,260,40','flowers-peony,205,240,80,80','flowers-peony,515,240,80,80','lights-candle,355,260,50,65']],
];

function parseElement(templateId, value, index) {
  const [assetId, x, y, w, h] = value.split(',');
  return { id: `${templateId}-${index}`, type: `vedika-${assetId}`, x: Number(x), y: Number(y), w: Number(w), h: Number(h), rotation: 0, color: '#ffffff' };
}

export const vedikaReactTemplates = templates.map(([id, title, category, themeName, paletteKey, venueMode, components]) => {
  const [bg, bg2, floor, trim] = colors[paletteKey];
  const scene = {
    name: title, bg: [bg, bg2], floor: [floor, floor], palette: [trim, bg, floor, bg2],
    venue: { enabled: venueMode, showGrid: venueMode, image: null, gridSize: 40, widthM: 12, depthM: 8 },
    elements: components.map((value, index) => parseElement(id, value, index)),
  };
  return { id: `vedika-${id}`, title, category, theme: themeName, tags: [category.toLowerCase(), ...title.toLowerCase().split(/\s+/)], venueMode,
    elementCount: components.length, cover: `/vedika-covers/${id}.png`, scene };
});
